local jsEvents = require 'jsEvents'

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

return castle