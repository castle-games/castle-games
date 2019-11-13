-- Based on Copas:
--     http://keplerproject.github.io/copas/reference.html
--   which is based on LuaSocket:
--     http://w3.impa.br/~diego/software/luasocket/reference.html

local copas = require 'copas'
local http = require 'copas.http'
http.SSLPROTOCOL = 'tlsv1_2'
local limit = require 'copas.limit'
local sqlite3 = require 'lsqlite3'
local ltn12 = require 'ltn12'
local cjson = require 'cjson'

local serpent = require '__ghost__.serpent'
local jsEvents = require '__ghost__.jsEvents'
local bridge = require '__ghost__.bridge'


local network = {}


local tasks = limit.new(10)
local coros = setmetatable({}, { __mode = 'k' })

-- Return whether the given coroutine is a network coroutine (top-level module code, `love.load` or `network.async` blocks)
function network.isNetworkCoroutine(coro)
    return not not coros[coro]
end

local function ensureCoro(uri)
    if not network.isNetworkCoroutine(coroutine.running()) then -- avoid `assert` to skip concats in the happy case
        error("attempted a network call for '" .. uri
                .. "' in a non-network coroutine -- ensure that resource loading "
                .. "(eg. `network.fetch`, `require`, `love.image.newImage` etc.) happens only in "
                .. "network coroutines (eg. top-level module code, `love.load`, `network.async` "
                .. "blocks) and not elsewhere (eg. `love.update`, `love.draw` or other events)")
    end
end

-- Run `foo` asynchronously with the caller. Runs it as a coroutine, so that
-- network requests inside it will appear to 'block' inside that coroutine,
-- while code outside the coroutine still runs. If `onError` is given, calls it
-- with the error as the only argument when an error occurs during the
-- asynchronous call. Forwards the rest of the arguments to `foo` when it is
-- called.
function network.async(foo, onError, ...)
    local outerPortal = getfenv(2).portal
    tasks:addthread(function(...)
        coros[coroutine.running()] = true
        copas.setErrorHandler(function(msg, co, skt)
            local stack = debug.traceback(msg)
            if onError then
                onError(msg)
            elseif outerPortal then
                outerPortal:handleError(msg, stack)
            elseif DEFAULT_ERROR_HANDLER then
                DEFAULT_ERROR_HANDLER(msg, stack)
            else
                print('uncaught async error:', msg, co, skt, debug.traceback(co))
            end
        end)
        foo(...)
    end, ...)
end

local nextRequestId = 1

-- Same interface as http://w3.impa.br/~diego/software/luasocket/http.html#request -- but is
-- async, tracks ongoing requests for debugging, and logs requests
function network.request(firstArg, ...)
    -- Figure out URL and method
    local url, method
    if type(firstArg) == 'table' then
        url = firstArg.url
        method = firstArg.method or 'GET'
    else
        url = firstArg
        method = select('#', ...) == 0 and 'GET' or 'POST'
    end

    -- Ensure we're in a network coroutine
    ensureCoro(url)

    -- Generate an `id`
    local id = nextRequestId
    nextRequestId = nextRequestId + 1

    -- Send JS event
    jsEvents.send('GHOST_NETWORK_REQUEST', {
        type = 'start',
        id = id,
        url = url,
        method = method,
    })

    -- Function that will run after -- log time taken and send JS event. We use a
    -- function so that we can use '...' parameters to forward all return values
    local startTime = love.timer.getTime()
    function after(...)
        local ms = math.floor(1000 * (love.timer.getTime() - startTime))
        print(ms .. 'ms', method, url)

        -- Send JS event
        jsEvents.send('GHOST_NETWORK_REQUEST', {
            type = 'stop',
            id = id,
            url = url,
            method = method,
        })

        return ...
    end

    return after(http.request(firstArg, ...))
end

-- Database for persistent storage.
love.filesystem.write('dummy', '') -- Create a dummy file to make sure the save directory exists
local db = sqlite3.open(love.filesystem.getSaveDirectory() .. '/ghost_network.db')

-- Create persistent fetch cache
db:exec[[
    create table if not exists fetch_cache (
        timestamp datetime default current_timestamp,
        url, method,
        response, httpCode, headers, status,
        primary key (url, method)
    );
]]

-- Create ETag cache
db:exec[[
    create table if not exists etag_cache (
        url primary key, response, etag
    );
]]

-- Whether `url` is safe to cache (never expires)
local function isCacheable(url)
    do -- Content-addressed asset (eg. user profile photo, hosted game assets) on our CDN
        local hash = url:match('https://d1vkcv80qw9qqp.cloudfront.net/([a-f0-9]*)')
        if hash and #hash == 32 then
            return true
        end
        local hash = url:match('^https?://s3%-us%-west%-2%.amazonaws%.com/castle%-hosted%-games/([^/]*)')
        if hash and hash:match('^[a-f0-9]*$') and #hash == 40 then
            return true
        end
        local hash = url:match('^https?://hosted%.castle%.games/([^/]*)')
        if hash and hash:match('^[a-f0-9]*$') and #hash == 40 then
            return true
        end
    end
    do -- Github SHA
        local sha = url:match('^https://raw.githubusercontent.com/[^/]*/[^/]*/([a-f0-9]*)/')
        if sha and #sha == 40 then
            return true
        end
    end
    return false
end

-- Save a result to the ETag cache
local persisteETag
do
    local stmt = db:prepare[[
        insert into etag_cache (url, response, etag)
            values (?, ?, ?)
            on conflict (url) do update set
                response = excluded.response,
                etag = excluded.etag;
    ]]
    persisteETag = function(url, response, etag)
        if not etag then
            return
        end
        stmt:bind(1, url)
        stmt:bind(2, response)
        stmt:bind_blob(3, etag)
        stmt:step()
        stmt:reset()
    end
end

-- Find a result in the ETag cache, `nil` if not found
local findETag
do
    local selectStmt = db:prepare[[
        select response, etag from etag_cache where url = ?;
    ]]
    findETag = function(url)
        local response, etag
        selectStmt:bind_values(url)
        for iresponse, ietag in selectStmt:urows() do
            response, etag = iresponse, ietag
        end
        selectStmt:reset()
        return response, etag
    end
end

-- Return a cache-friendly version of `url` if there is one, else just return `url`
local mapToCacheable
do
    local githubBranchShas = {}
    mapToCacheable = function(url)
        do -- GitHub branch -> SHA
            local user, repo, branch, path = url:match(
                '^https?://raw%.githubusercontent%.com/([^/]*)/([^/]*)/([^/]*)/(.*)')
            if user and repo and branch then
                if not (branch:match('^[a-f0-9]*$') and #branch == 40) then -- Ensure not a SHA
                    local sha = githubBranchShas[user .. '/' .. repo .. '/' .. branch] -- Cached?
                    if not sha then -- First try against the REST API, which is rate limited
                        local apiUrl = 'https://api.github.com/repos/' .. user .. '/' .. repo
                                .. '/git/refs/heads/' .. branch
                        local sendHeaders = {}
                        local response, etag = findETag(apiUrl)
                        if etag then
                            sendHeaders['if-none-match'] = etag
                        end
                        local sink = {}
                        local _, httpCode, headers = network.request {
                            url = apiUrl,
                            headers = sendHeaders,
                            sink = ltn12.sink.table(sink),
                        }
                        if httpCode ~= 304 then
                            response = table.concat(sink)
                            persisteETag(apiUrl, response, headers['etag'])
                        end
                        local decoded = cjson.decode(response)
                        if decoded and decoded.object and decoded.object.sha then
                            sha = decoded.object.sha
                            githubBranchShas[user .. '/' .. repo .. '/' .. branch] = sha -- Cache
                        end
                    end
                    if not sha then -- If the above failed it may be due to rate limit, try HTML
                        local commitsPageUrl = 'https://github.com/' .. user .. '/' .. repo
                                .. '/commits/' .. branch
                        local sink = {}
                        network.request {
                            url = commitsPageUrl,
                            sink = ltn12.sink.table(sink),
                        }
                        local response = table.concat(sink)
                        local prefix = 'https://github.com/' .. user .. '/' .. repo .. '/commit/'
                        local prefixPos = response:find(prefix, 1, true)
                        if prefixPos then
                            local shaPos = prefixPos + #prefix
                            sha = response:sub(shaPos, shaPos + 39)
                        else
                            sha = 'INVALID'
                        end
                        githubBranchShas[user .. '/' .. repo .. '/' .. branch] = sha -- Cache
                    end
                    if sha == 'INVALID' then
                        return url
                    end
                    return 'https://raw.githubusercontent.com/' .. user .. '/' .. repo .. '/'
                            .. sha .. '/' .. path
                end
            end
        end

        do -- Castle-hosted asset
            local filename = url:match('^https?://api%.castle%.games/api/hosted/[^/]*/[^/]*/(.*)')
            if filename then
                -- See if it redirects to a CDN URL
                if castle.game.getCurrent().hostedFiles and castle.game.getCurrent().hostedFiles[filename] then
                    return castle.game.getCurrent().hostedFiles[filename]
                end

                local response, httpCode, headers, status = network.request {
                    url = url,
                    redirect = false,
                }
                if httpCode == 302 then
                    local location = headers['location']
                    local hash = location:match('^https?://s3%-us%-west%-2%.amazonaws%.com/castle%-hosted%-games/([^/]*)')
                    if hash and hash:match('^[a-f0-9]*$') and #hash == 40 then
                        return location
                    end
                    local hash = location:match('^https?://hosted%.castle%.games/([^/]*)')
                    if hash and hash:match('^[a-f0-9]*$') and #hash == 40 then
                        return location
                    end
                end
            end
        end

        return url
    end
end

-- Save a result to the persistent fetch cache, updating an existing entry if it exists
local persistFetchResult
do
    local stmt = db:prepare[[
        insert into fetch_cache (url, method, response, httpCode, headers, status)
            values (?, ?, ?, ?, ?, ?)
            on conflict (url, method) do update set
                timestamp = current_timestamp,
                response = excluded.response,
                httpCode = excluded.httpCode,
                headers = excluded.headers,
                status = excluded.status;
    ]]
    persistFetchResult = function(url, method, result)
        if isCacheable(url) then
            local response, httpCode, headers, status = unpack(result)
            stmt:bind(1, url)
            stmt:bind(2, method)
            stmt:bind_blob(3, response)
            stmt:bind(4, httpCode)
            stmt:bind(5, serpent.dump(headers))
            stmt:bind(6, status)
            stmt:step()
            stmt:reset()
        end
    end
end

-- Find a result in the persistent fetch cache, `nil` if not found; updates the timestamp of the entry
local findPersistedFetchResult
do
    local updateStmt = db:prepare[[
        update fetch_cache set timestamp = current_timestamp
            where url = ? and method = ?;
    ]]
    local selectStmt = db:prepare[[
        select response, httpCode, headers, status from fetch_cache
            where url = ? and method = ?;
    ]]
    findPersistedFetchResult = function(url, method)
        updateStmt:bind_values(url, method)
        updateStmt:step()
        updateStmt:reset()
        local result
        selectStmt:bind_values(url, method)
        for response, httpCode, headers, status in selectStmt:urows() do
            result = { response, httpCode, load(headers)(), status }
        end
        selectStmt:reset()
        return result
    end
end

-- A map from url to the locally edited version of the file
local urlToLocallyEditedFile = {}

local function getEditedFile(url)
    if CASTLE_INITIAL_DATA and CASTLE_INITIAL_DATA.editedFiles and CASTLE_INITIAL_DATA.editedFiles[url] then
        return CASTLE_INITIAL_DATA.editedFiles[url]
    end
    return nil
end

-- The cache of `network.fetch` responses
local fetchEntries = { GET = {}, HEAD = {} }

-- Fetch a resource with default caching semantics. If `skipCache` is true, skip looking in the
-- persistent cache (still saves it to the cache after).
function network.fetch(url, method, skipCache)
    -- Ensure we're in a network coroutine
    ensureCoro(url)

    method = (method or 'GET'):upper()
    assert(method == 'GET' or method == 'HEAD', "`network.fetch` only supports 'GET' or 'HEAD'")

    -- Find or create entry
    local entry = (not skipCache) and fetchEntries[method][url]
    if not entry then -- No entry yet
        -- Store a pending entry that will collect others waiting on this
        entry = { waiters = {} }
        fetchEntries[method][url] = entry

        -- 'castle://' is just 'https://'
        url = url:gsub('^castle://', 'https://')

        -- Apply mappings
        url = mapToCacheable(url)

        if getEditedFile(url) then
            if method == 'GET' then
                response = getEditedFile(url)
            else
                response = 1
            end
            httpCode = 200
            headers = {}
            status = '200 ok'
            entry.result = { response, httpCode, headers, status }
        else
            -- Use persisted result if found
            local persistedResult = (not skipCache) and findPersistedFetchResult(url, method)
            if persistedResult then
                entry.result = persistedResult
            else -- Else actually fetch then persist it
                local response, httpCode, headers, status, err
                if url:match('^https?://') then
                    -- Handle 'localhost' and '0.0.0.0'
                    url = url:gsub('^http://localhost', 'http://127.0.0.1')
                    url = url:gsub('^https://localhost', 'https://127.0.0.1')
                    url = url:gsub('^http://0.0.0.0', 'http://127.0.0.1')
                    url = url:gsub('^https://0.0.0.0', 'https://127.0.0.1')

                    -- Handle spaces
                    url = url:gsub(' ', '%%20')

                    if method == 'GET' then
                        response, httpCode, headers, status = network.request(url)
                        if response == nil or httpCode ~= 200 then
                            err = "error fetching '" .. url .. "': " .. tostring(status or httpCode)
                        end
                    else
                        response, httpCode, headers, status = network.request {
                            url = url,
                            method = method,
                        }
                    end
                elseif url:match('^file://') then
                    local filePath = url:gsub('^file://', ''):gsub('%%25', '%%')
                    local file = io.open(filePath, 'rb')
                    if file ~= nil then
                        if method == 'GET' then
                            response = file:read('*all')
                        else
                            response = 1
                        end
                        httpCode = 200
                        headers = {}
                        status = '200 ok'
                        file:close()
                    elseif method == 'GET' then
                        err = "error opening '" .. url .. "'"
                    else
                        response = nil
                        httpCode = 404
                        headers = {}
                        status = '404 not found'
                    end
                end
                if err then
                    entry.err = err
                else
                    entry.result = { response, httpCode, headers, status }
                    persistFetchResult(url, method, entry.result)
                end
            end
        end

        -- Wake waiters
        for _, waiter in ipairs(entry.waiters) do
            copas.wakeup(waiter)
        end
        entry.waiters = nil
        if entry.err then error(entry.err) end

        if method == 'GET' then --and url:sub(-#'.lua') == '.lua'
            urlToLocallyEditedFile[url] = entry.result[1]
            --bridge.js.setEditableFiles {
            --    files = urlToLocallyEditedFile
            --}
        end

        return unpack(entry.result)
    elseif entry.result then -- Already have an entry with `result`, just return it
        return unpack(entry.result)
    elseif entry.err then -- Already have an entry with `err`, throw the error
        error(entry.err)
    else -- Entry with no `result` or `err` yet -- need to await it
        table.insert(entry.waiters, coroutine.running())
        copas.sleep(-1) -- Sleep till explicitly woken
        if not (entry.result or entry.err) then
            error("error fetching '" .. url .. "': coroutine awoken without `result` or `err` set")
        end
        if entry.err then error(entry.err) end
        return unpack(entry.result)
    end
end

-- Start fetching many resources so that their next fetch is faster. Every URL given must return a
-- 200 response. `baseUrl .. '/'` is prepended to non-absolute URLs.
local prefetched = {}
function network.prefetch(urls, baseUrl)
    for _, url in ipairs(urls) do
        if baseUrl and not network.isAbsolute(url) then
            url = baseUrl .. '/' .. url
        end
        prefetched[url] = true
        network.async(function()
            network.fetch(url)
        end)
    end
end

-- Flush the `network.fetch` cache for all URLs matching a given filter function
function network.flush(filter)
    for method, entries in pairs(fetchEntries) do
        if not filter then
            fetchEntries[method] = {}
        else
            for url in pairs(entries) do
                if filter(url) then
                    entries[url] = nil
                end
            end
        end
    end
end

-- Whether a given string represents an absolute URL
function network.isAbsolute(url)
    return url:match('^castle://') or url:match('^https?://') or url:match('^file://')
end

-- Whether a given URL points to something that exists. If `skipCache` is true, skip looking in the
-- persistent cache (still saves it to the cache after). Also assumes any `network.prefetch`'d URLs
-- exist.
function network.exists(url, skipCache)
    if prefetched[url] then
        return true
    end
    local _, httpCode = network.fetch(url, 'HEAD', skipCache)
    return httpCode == 200
end

-- Return the `network.fetch` status for a given `url` and `method` combination. `method` defaults
-- to `'GET'` if not given. Returns `'none'` if not cached (either never fetched or flushed from
-- cache), `'fetching'` if currently being fetched (poasynchronously), or `'fetched'` if fetched
-- and cached.
function network.status(url, method)
    method = (method or 'GET'):upper()
    assert(method == 'GET' or method == 'HEAD', "`network.fetch` only supports 'GET' or 'HEAD'")

    local entry = fetchEntries[method][url]
    if entry ~= nil then
        if entry.result then
            return 'fetched'
        else
            return 'fetching'
        end
    else
        return 'none'
    end
end

-- Perform any updates the network system has to do -- this is run by base automatically and you
-- shouldn't have to call it...
function network.update(dt)
    if network.resumed then
        network.resumed()
    end
    copas.step(0)
    if network.paused then
        network.paused()
    end
end

-- Expose `fetchEntries` for use in soft-reloading in `'main'`
network.fetchEntries = fetchEntries

return network

