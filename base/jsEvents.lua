local jsEvents = {}


local cjson = require 'cjson'


local lists = {} -- `eventName` -> `listenerId` -> `listener`

local nextId = 1
function jsEvents.listen(name, listener)
    local list = lists[name]
    if not list then
        list = {}
        lists[name] = list
    end

    local id = nextId
    nextId = nextId + 1
    list[id] = listener

    return function()
        list[id] = nil
    end
end

local receiveChannel = love.thread.getChannel('JS_EVENTS')

function jsEvents.update()
    local eventJson
    while true do
        local eventJson = receiveChannel:pop()
        if eventJson == nil then
            return
        end
        local event = cjson.decode(eventJson)
        if event then
            local list = lists[event.name]
            if list then
                local params = event.params
                for _, listener in pairs(list) do
                    listener(params)
                end
            end
        end
    end
end

local platform = love.system.getOS()
if platform == 'iOS' or platform == 'Android' then -- Use channels on mobile
    local sendChannel = love.thread.getChannel('LUA_TO_JS_EVENTS')
    sendChannel:clear()
    function jsEvents.send(name, params)
        sendChannel:push(cjson.encode({
            name = name,
            params = params,
        }))
    end
elseif not CASTLE_SERVER then -- Use FFI on desktop
    local ffi = require 'ffi'
    ffi.cdef[[
        void ghostSendJSEvent(const char *eventName, const char *serializedParams);
    ]]
    local C = ffi.C

    function jsEvents.send(name, params)
        C.ghostSendJSEvent(name, cjson.encode(params))
    end
else -- Noop on remote server
    function jsEvents.send()
    end
end


return jsEvents