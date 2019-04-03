local jsEvents = require 'jsEvents'
local jsCalls = require 'jsCalls'
local cjson = require 'cjson'

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