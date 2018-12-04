local jsEvents = require 'jsEvents'

local share = {}

function share.connectClient(mediaUrl, callback)
    params = {}
    params['mediaUrl'] = mediaUrl
    jsEvents.listen('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', function(params)
        callback(params.address)
    end)
    jsEvents.send('CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST', params)
end

return share