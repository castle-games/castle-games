local jsEvents = require 'jsEvents'

local ffi = require 'ffi'
local C = ffi.C

local castle = {}

function castle.connectClient(mediaUrl, callback)
    jsEvents.listen('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', function(params)
        callback(params.address)
    end)
    jsEvents.send('CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST', {
        mediaUrl = mediaUrl,
    })
end

jsEvents.listen('CASTLE_SET_LOGGED_IN', function(isLoggedIn)
    castle.isLoggedIn = isLoggedIn
end)

ffi.cdef 'void ghostHeartbeat(int numClients);'
function castle.heartbeat(numClients)
    if CASTLE_SERVER then
        C.ghostHeartbeat(numClients)
    end
end

ffi.cdef 'void ghostSetIsAcceptingPlayers(bool isAcceptingPlayers);'
function castle.setIsAcceptingClients(isAcceptingClients)
    if CASTLE_SERVER then
        C.ghostSetIsAcceptingPlayers(isAcceptingClients)
    end
end

return castle