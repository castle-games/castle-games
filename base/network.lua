-- Based on Copas:
--     http://keplerproject.github.io/copas/reference.html
--   which is based on LuaSocket:
--     http://w3.impa.br/~diego/software/luasocket/reference.html

local copas = require 'copas'
local http = require 'copas.http'
local limit = require 'copas.limit'

local network = {}

network.requests = {}

local tasks = limit.new(10)

-- Run `foo` asynchronously with the caller. Runs it as a coroutine, so that
-- network requests inside it will appear to 'block' inside that coroutine,
-- while code outside the coroutine still runs. If `onError` is given, calls it
-- with the error as the only argument when an error occurs during the
-- asynchronous call.
function network.async(foo, onError)
    local outerPortal = getfenv(2).portal
    tasks:addthread(function()
        copas.setErrorHandler(function(msg, co, skt)
            if onError then
                onError(msg)
            elseif outerPortal then
                outerPortal:handleError(msg)
            else
                print('uncaught async error:', msg, co, skt, debug.traceback(co))
            end
        end)
        foo()
    end)
end

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

    -- Add entry in `network.requests` table
    local id = {} -- Cheap UUID ^_^
    table.insert(network.requests, {
        id = id,
        url = url,
        method = method,
        time = 0,
    })

    -- Function that will run after -- log time taken and remove from `network.requests`. We use a
    -- function so that we can use '...' parameters to forward all return values
    local startTime = love.timer.getTime()
    function after(...)
        local ms = math.floor(1000 * (love.timer.getTime() - startTime))
        print(ms .. 'ms', method, url)

        for i = 1, #network.requests do
            if network.requests[i].id == id then
                table.remove(network.requests, i)
                break
            end
        end

        return ...
    end

    return after(http.request(firstArg, ...))
end

-- The cache of `network.fetch` responses
local fetchEntries = { GET = {}, HEAD = {} }

-- Fetch a resource with default caching semantics
function network.fetch(url, method)
    method = (method or 'GET'):upper()
    assert(method == 'GET' or method == 'HEAD', "`network.fetch` only supports 'GET' or 'HEAD'")

    -- Find or create entry
    local entry = fetchEntries[method][url]
    if not entry then -- No entry yet
        -- Store a pending entry that will collect others waiting on this
        entry = { waiters = {} }
        fetchEntries[method][url] = entry

        -- Actually perform the request, blocks coroutine till done
        local response, httpCode, headers, status
        if url:match('^ghost://') then
            url = url:gsub('^ghost://', 'https://')
        end
        if url:match('^https?://') then
            if method == 'GET' then
                response, httpCode, headers, status = network.request(url)
                if httpCode ~= 200 then
                    error("error fetching '" .. url .. "': " .. status)
                end
            else
                response, httpCode, headers, status = network.request { url = url, method = method }
            end
        elseif url:match('^file://') then
            local filePath = url:gsub('^file://', ''):gsub('%%25', '%%')
            local file = io.open(filePath, 'r')
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
                error("error opening '" .. url .. "'")
            else
                response = nil
                httpCode = 404
                headers = {}
                status = '404 not found'
            end
        end

        -- Save result, wake waiters
        entry.result = { response, httpCode, headers, status }
        for _, waiter in ipairs(entry.waiters) do
            copas.wakeup(waiter)
        end
        entry.waiters = nil
        return unpack(entry.result)
    elseif entry.result then -- Already have an entry with `result`, just return it
        return unpack(entry.result)
    else -- Entry with no `result` yet -- need to await it
        table.insert(entry.waiters, coroutine.running())
        copas.sleep(-1) -- Sleep till explicitly woken
        if not entry.result then
            error("error fetching '" .. url .. "': coroutine awoken without `result` set")
        end
        return unpack(entry.result)
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
    return url:match('^ghost://') or url:match('^https?://') or url:match('^file://')
end

-- Whether a given URL points to something that exists
function network.exists(url)
    local _, httpCode = network.fetch(url, 'HEAD')
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
    for _, req in ipairs(network.requests) do
        req.time = req.time + dt
    end

    copas.step(0)
end

return network

