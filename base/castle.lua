local jsEvents = require 'jsEvents'
local jsCalls = require 'jsCalls'
local cjson = require 'cjson'
local ltn12 = require 'ltn12'
local http = require 'copas.http'

local ffi = require 'ffi'
local C = ffi.C


local castle = {}


-- user

castle.user = {}

local me

jsEvents.listen('CASTLE_SET_IS_LOGGED_IN', function(isLoggedIn)
    castle.user.isLoggedIn = isLoggedIn
    castle.isLoggedIn = isLoggedIn --- XXX: Backwards compat...

    if not isLoggedIn then
        me = nil
    end
end)

jsEvents.listen('CASTLE_SET_ME', function(theMe)
    me = theMe
end)

function castle.user.getMe()
    return me
end


-- storage

castle.storage = {}

if not CASTLE_SERVER then -- We're in the JS client, use the JS client's API calls
    function castle.storage.getGlobal(key)
        assert(type(key) == 'string', '`castle.storage.getGlobal` needs a string `key`')

        local json = jsCalls.storageGetGlobal { key = key }
        if type(json) == 'string' then
            return cjson.decode(json)
        else
            return nil
        end
    end

    function castle.storage.setGlobal(key, value)
        assert(type(key) == 'string', '`castle.storage.setGlobal` needs a string `key`')

        local encoded = nil
        if value ~= nil then
            encoded = cjson.encode(value)
        end
        return jsCalls.storageSetGlobal { key = key, value = encoded }
    end

    function castle.storage.get(key)
        assert(type(key) == 'string', '`castle.storage.get` needs a string `key`')

        local json = jsCalls.storageGetUser { key = key }
        if type(json) == 'string' then
            return cjson.decode(json)
        else
            return nil
        end
    end

    function castle.storage.set(key, value)
        assert(type(key) == 'string', '`castle.storage.set` needs a string `key`')

        local encoded = nil
        if value ~= nil then
            encoded = cjson.encode(value)
        end
        return jsCalls.storageSetUser { key = key, value = encoded }
    end
else -- We're on the game server, do the GraphQL HTTP requests ourselves
    STORAGE_ID = 'e486b038-883c-420a-be97-36e25f24fcf4' -- TODO(nikki): Um we should get this from the game...

    local function graphql(query, variables)
        local source = cjson.encode({
            query = query,
            variables = variables,
        })
        local sink = {}
        local response, httpCode, headers, status = http.request {
            method = 'POST',
            url = 'https://api.castle.games/graphql',
            headers = {
                ['Content-Type'] = 'application/json',
                ['Accept'] = 'application/json',
                ['Content-Length'] = #source,
                ['Connection'] = 'keep-alive',
            },
            source = ltn12.source.string(source),
            sink = ltn12.sink.table(sink),
        }
        return cjson.decode(table.concat(sink))
    end

    function castle.storage.getGlobal(key)
        assert(type(key) == 'string', '`castle.storage.getGlobal` needs a string `key`')

        local result = graphql([[
            query($storageId: String!, $key: String!) {
                gameGlobalStorage(storageId: $storageId, key: $key) {
                    value
                }
            }
        ]], {
            storageId = STORAGE_ID,
            key = key,
        })

        local err = result and
            type(result.errors) == 'table' and
            result.errors[1] and
            result.errors[1].message
        if err then
            error('`castle.storage.getGlobal`: ' .. err)
        end

        local json = result and
            type(result.data) == 'table' and
            type(result.data.gameGlobalStorage) == 'table' and
            result.data.gameGlobalStorage.value
        if type(json) == 'string' then
            return cjson.decode(json)
        else
            return nil
        end
    end

    function castle.storage.setGlobal(key, value)
        assert(type(key) == 'string', '`castle.storage.setGlobal` needs a string `key`')

        local encoded = cjson.null
        if value ~= nil then
            encoded = cjson.encode(value)
        end

        local result = graphql([[
            mutation($storageId: String!, $key: String!, $value: String) {
                setGameGlobalStorage(storageId: $storageId, key: $key, value: $value)
            }
        ]], {
            storageId = STORAGE_ID,
            key = key,
            value = encoded,
        })

        local err = result and
            type(result.errors) == 'table' and
            result.errors[1] and
            result.errors[1].message
        if err then
            error('`castle.storage.setGlobal`: ' .. err)
        end

        local success = result and
            type(result.data) == 'table' and
            result.data.setGameGlobalStorage == true
        if not success then
            error('`castle.storage.setGlobal` failed')
        end
    end

    function castle.storage.get(key)
        error('`castle.storage.get`: attempted to use user storage on the server')
    end

    function castle.storage.set(key, value)
        error('`castle.storage.set`: attempted to use user storage on the server')
    end
end


-- multiplayer

castle.multiplayer = {}

function castle.multiplayer.connectClient(mediaUrl, callback)
    jsEvents.listen('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', function(params)
        callback(params.address)
    end)
    jsEvents.send('CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST', {
        mediaUrl = mediaUrl,
    })
end
castle.connectClient = castle.multiplayer.connectClient -- XXX: Backwards compat...

ffi.cdef 'void ghostHeartbeat(int numClients);'
function castle.multiplayer.heartbeat(numClients)
    if CASTLE_SERVER then
        C.ghostHeartbeat(numClients)
    end
end
castle.heartbeat = castle.multiplayer.heartbeat -- XXX: Backwards compat...

ffi.cdef 'void ghostSetIsAcceptingPlayers(bool isAcceptingPlayers);'
function castle.multiplayer.setIsAcceptingClients(isAcceptingClients)
    if CASTLE_SERVER then
        C.ghostSetIsAcceptingPlayers(isAcceptingClients)
    end
end
castle.setIsAcceptingClients = castle.multiplayer.setIsAcceptingClients -- XXX: Backwards compat...


return castle