-- Based on Copas:
--     http://keplerproject.github.io/copas/reference.html
--   which is based on LuaSocket:
--     http://w3.impa.br/~diego/software/luasocket/reference.html

local copas = require 'copas'
local http = require 'copas.http'

local network = {}

network.requests = {}

-- Run this function asynchronously with the caller. Runs it as a coroutine, so that network
-- requests inside it will appear to 'block' inside that coroutine, while code outside the
-- coroutine still runs.
function network.async(foo)
    copas.addthread(function()
        copas.setErrorHandler(function(msg, co, skt)
            print(msg, co, skt)
            print(debug.traceback(co))
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

-- Fetch a resource with default caching semantics
local fetchCache = { GET = {}, HEAD = {} }
function network.fetch(url, method)
    method = (method or 'GET'):upper()
    assert(method == 'GET' or method == 'HEAD', "`network.fetch` only supports 'GET' or 'HEAD'")

    do -- Cached?
        local found = fetchCache[method][url]
        if found then return unpack(found) end
    end

    local response, httpCode, headers, status
    if method == 'GET' then
        response, httpCode, headers, status = network.request(url)
        if httpCode ~= 200 then
            error("error fetching '" .. url .. "': " .. status)
        end
    else
        response, httpCode, headers, status = network.request { url = url, method = method }
    end

    fetchCache[method][url] = { response, httpCode, headers, status }
    return unpack(fetchCache[method][url])
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

