local copas = require 'copas'
local jsEvents = require 'jsEvents'


-- Keep track of calls we've sent to JS and are waiting on for a response
local nextCallId = 1
local waitingCalls = {} 


-- Make a call to `methods.<methodName>(arg)` in 'luacalls.js', blocking the current coroutine (must be a
-- network coroutine) till a response is received. Returns the result or throws the error from the response.
local function call(methodName, arg)
    -- Get the coroutine we're running in and make sure it's a network coroutine
    local coro = coroutine.running()
    if not network.isNetworkCoroutine(coro) then
        local caller = debug.getinfo(2).name
        local functionDesc = caller and ('`' .. caller .. '`') or 'this function'
        error(functionDesc .. ' must be called on a network coroutine -- i.e., in a `network.async` block, in'
            .. ' `love.load` or in top-level module code, etc.')
    end

    -- Save to `waitingCalls`
    local id = nextCallId
    nextCallId = nextCallId + 1
    local waitingCall = {
        coro = coro,
    }
    waitingCalls[id] = waitingCall

    -- Send call request to JS and pause the coroutine till explicitly awoken
    jsEvents.send('JS_CALL_REQUEST', {
        id = id,
        methodName = methodName,
        arg = arg,
    })
    copas.sleep(-1)

    -- Make sure the call was finished, remove from `waitingCalls`, then return the result
    if not waitingCall.responseReceived then
        local caller = debug.getinfo(2).name
        local functionDesc = caller and ('`' .. caller .. '`') or 'this function'
        error(functionDesc .. ': coroutine was awoken without a response')
    end
    waitingCalls[id] = nil
    if waitingCall.error then
        error(waitingCall.error)
    else
        return waitingCall.result
    end
end


-- Listen for call responses from JS
jsEvents.listen('JS_CALL_RESPONSE', function(response)
    local waitingCall = waitingCalls[response.id]
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


-- Convenience table so you can just do `jsCall.<methodName>(arg)`
return setmetatable({}, {
    __index = function(t, k)
        local wrapper = function(arg)
            return call(k, arg)
        end
        t[k] = wrapper
        return wrapper
    end
})