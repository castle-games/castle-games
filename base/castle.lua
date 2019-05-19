local jsEvents = require 'jsEvents'
local bridge = require 'bridge'
local cjson = require 'cjson'
local ltn12 = require 'ltn12'
local http = require 'copas.http'
local uuid = require 'uuid'

local ffi = require 'ffi'
local C = ffi.C


local castle = {}


-- system

local theOS = love.system.getOS()
local isMobile = theOS == 'Android' or theOS == 'iOS'
local isRemoteServer = not not CASTLE_SERVER
local isDesktop = not (isMobile or isRemoteServer)

castle.system = {}

function castle.system.isMobile()
    return isMobile
end

function castle.system.isDesktop()
    return isDesktop
end

function castle.system.isRemoteServer()
    return isRemoteServer
end

ffi.cdef 'double ghostGetGlobalScaling();'
function castle.system.getGlobalScaling()
    if isDesktop then
        return C.ghostGetGlobalScaling()
    else
        return 1
    end
end

ffi.cdef 'double ghostGetScreenScaling();'
function castle.system.getScreenScaling()
    if isDesktop then
        return C.ghostGetScreenScaling()
    else
        return 1
    end
end


-- game

castle.game = {}

do
    local decodedInitialParams

    function castle.game.getInitialParams()
        if decodedInitialParams then
            return decodedInitialParams
        end
        if CASTLE_INITIAL_DATA and CASTLE_INITIAL_DATA.initialParams then
            decodedInitialParams = cjson.decode(CASTLE_INITIAL_DATA.initialParams)
            return decodedInitialParams
        end
        return nil
    end
end

function castle.game.getReferrer()
    if CASTLE_INITIAL_DATA and CASTLE_INITIAL_DATA.referrerGame then
        return CASTLE_INITIAL_DATA.referrerGame
    end
    return nil
end

function castle.game.load(gameIdOrUrl, params)
    network.async(function()
        bridge.js.gameLoad {
            gameIdOrUrl = gameIdOrUrl,
            params = cjson.encode(params),
        }
    end)
end


-- user

castle.user = {}

if CASTLE_INITIAL_DATA then
    local isLoggedIn = not not (CASTLE_INITIAL_DATA.user and CASTLE_INITIAL_DATA.user.isLoggedIn)
    castle.user.isLoggedIn = isLoggedIn
    castle.isLoggedIn = isLoggedIn --- XXX: Backwards compat...
end

function castle.user.getMe()
    if castle.user.isLoggedIn then
        return CASTLE_INITIAL_DATA.user.me
    end
    return nil
end


-- storage

castle.storage = {}

if not CASTLE_SERVER then -- We're in the JS client, use the JS client's API calls
    function castle.storage.getGlobal(key)
        assert(type(key) == 'string', '`castle.storage.getGlobal` needs a string `key`')

        local json = bridge.js.storageGetGlobal { key = key }
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
        return bridge.js.storageSetGlobal { key = key, value = encoded }
    end

    function castle.storage.get(key)
        assert(type(key) == 'string', '`castle.storage.get` needs a string `key`')

        local json = bridge.js.storageGetUser { key = key }
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
        return bridge.js.storageSetUser { key = key, value = encoded }
    end
else -- We're on the game server, do the GraphQL HTTP requests ourselves
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

    -- Get `storageId` from game database model
    local storageId
    if CASTLE_GAME_INFO then
        decodedGameInfo = cjson.decode(CASTLE_GAME_INFO)
        if decodedGameInfo.storageId then
            storageId = decodedGameInfo.storageId
        end
    end

    function castle.storage.getGlobal(key)
        assert(storageId, '`castle.storage.getGlobal` needs a `storageId`')
        assert(type(key) == 'string', '`castle.storage.getGlobal` needs a string `key`')

        local result = graphql([[
            query($storageId: String!, $key: String!) {
                gameGlobalStorage(storageId: $storageId, key: $key) {
                    value
                }
            }
        ]], {
            storageId = storageId,
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
        assert(storageId, '`castle.storage.getGlobal` needs a `storageId`')
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
            storageId = storageId,
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
        error('`castle.storage.get`: user storage access is not allowed on remote servers')
    end

    function castle.storage.set(key, value)
        error('`castle.storage.set`: user storage access is not allowed on remote servers')
    end
end


-- post

castle.post = {}

function castle.post._decodePost(encodedPost)
    local decodedData
    pcall(function()
        decodedData = cjson.decode(encodedPost.data)
    end)
    return {
        postId = encodedPost.postId,
        creator = encodedPost.creator,
        mediaUrl = encodedPost.mediaUrl,
        data = decodedData,
    }
end

do
    local decodedInitialPost -- Memoize to prevent decoding JSON multiple times

    function castle.post.getInitialPost()
        if decodedInitialPost then
            return decodedInitialPost
        end
        if CASTLE_INITIAL_DATA and CASTLE_INITIAL_DATA.initialPost then
            decodedInitialPost = castle.post._decodePost(CASTLE_INITIAL_DATA.initialPost)
            return decodedInitialPost
        end
        return nil
    end
end

function castle.post.create(options)
    local message = options.message or 'Say something!'

    local mediaType = nil
    local mediaPath = nil
    local media = options.media
    if type(media) == 'string' then
        if media == 'capture' then
            mediaType = 'capture'
        end
    elseif type(media) == 'userdata' then
        if media.typeOf and media:typeOf('ImageData') then
            local savePath = CASTLE_TMP_DIR_NAME .. '/' .. 'img-' .. uuid() .. '.png'
            media:encode('png', savePath)
            mediaPath = love.filesystem.getSaveDirectory() .. '/' .. savePath
        end
    end

    local encodedData = nil
    local data = options.data
    if data ~= nil then
        encodedData = cjson.encode(data)
    end

    return bridge.js.postCreate {
        message = message,
        mediaType = mediaType,
        mediaPath = mediaPath,
        data = encodedData,
    }
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


-- ui

castle.ui = require 'ui'


return castle