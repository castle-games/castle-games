local copas = require 'copas'
local uuid = require '__ghost__.uuid'

local jsEvents = require '__ghost__.jsEvents'


local bridge = {}


---
--- LUA -> JS -> LUA
---

-- Keep track of calls we've sent to JS and are waiting on for a response
local waitingJSCalls = {} 

-- Make a JS call to `bridge.js.<methodName>(arg)` in 'bridge.js', blocking the current coroutine (must be a
-- network coroutine) till a response is received. Returns the result or throws the error from the response.
local function jsCall(methodName, arg)
    -- Can't do this on remote servers...
    if CASTLE_SERVER then
        return
    end

    -- Get the coroutine we're running in and make sure it's a network coroutine
    local coro = coroutine.running()
    if not network.isNetworkCoroutine(coro) then
        local caller = debug.getinfo(2).name
        local functionDesc = caller and ('`' .. caller .. '`') or 'this function'
        error(functionDesc .. ' must be called on a network coroutine -- i.e., in a `network.async` block, in'
            .. ' `love.load` or in top-level module code, etc.')
    end

    -- Save to `waitingJSCalls`
    local id = uuid() -- Using a UUID is overkill here but it's easy...
    local waitingCall = {
        coro = coro,
    }
    waitingJSCalls[id] = waitingCall

    -- Send JS call request to JS and pause the coroutine till explicitly awoken
    jsEvents.send('JS_CALL_REQUEST', {
        id = id,
        methodName = methodName,
        arg = arg,
    })
    copas.sleep(-1)

    -- Make sure the JS call was finished, remove from `waitingJSCalls`, then return the result
    if not waitingCall.responseReceived then
        local caller = debug.getinfo(2).name
        local functionDesc = caller and ('`' .. caller .. '`') or 'this function'
        error(functionDesc .. ': coroutine was awoken without a response')
    end
    waitingJSCalls[id] = nil
    if waitingCall.error then
        error(waitingCall.error)
    else
        return waitingCall.result
    end
end

-- Listen for JS call responses from JS
jsEvents.listen('JS_CALL_RESPONSE', function(response)
    local waitingCall = waitingJSCalls[response.id]
    if waitingCall then
        waitingCall.responseReceived = true
        if response.error then
            waitingCall.error = response.error
        else
            waitingCall.result = response.result
        end
        copas.wakeup(waitingCall.coro)
    end
end)

-- Convenience table so you can just do `bridge.js.<methodName>(arg)`
bridge.js = setmetatable({}, {
    __index = function(t, k)
        local wrapper = function(arg)
            return jsCall(k, arg)
        end
        t[k] = wrapper
        return wrapper
    end
})


---
--- JS -> LUA -> JS
---

-- Methods callable as `Bridge.Lua.<methodName>(arg)` from JS. Can network-block (are called in a
-- network coroutine). Can throw errors. The return value or error is relayed back to JS, as a
-- resolution or rejection of the `Promise`.
bridge.lua = {}


-- Example JS-exposed Lua method just for testing
function bridge.lua.sayHello(arg)
    local name = arg.name
    if name ~= 'l' then
        copas.sleep(2)
        return 'lua: hello, ' .. name
    else
        error("lua: 'l' not allowed!")
    end
end


-- Screenshots

function bridge.lua.captureScreenshot(arg)
    local result
    local coro = coroutine.running()
    love.graphics.captureScreenshot(function(imageData)
        local savePath = CASTLE_TMP_DIR_NAME .. '/' .. 'shot-' .. uuid() .. '.png'
        imageData:encode('png', savePath)
        result = {
            path = love.filesystem.getSaveDirectory() .. '/' .. savePath,
            width = imageData:getWidth(),
            height = imageData:getHeight(),
        }
        copas.wakeup(coro)
    end)
    copas.sleep(-1)
    return result
end


-- Listen for Lua call requests from JS
jsEvents.listen('LUA_CALL_REQUEST', function(request)
    network.async(function()
        local function sendError(msg)
            jsEvents.send('LUA_CALL_RESPONSE', {
                id = request.id,
                error = msg,
            })
        end
        copas.setErrorHandler(sendError)
        local result
        local success, err = pcall(function()
            result = bridge.lua[request.methodName](request.arg)
        end)
        if success then
            jsEvents.send('LUA_CALL_RESPONSE', {
                id = request.id,
                result = result
            })
        else
            sendError(err)
        end
    end)
end)


return bridge