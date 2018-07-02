-- Based on Copas:
--     http://keplerproject.github.io/copas/reference.html
--   which is based on LuaSocket:
--     http://w3.impa.br/~diego/software/luasocket/reference.html

local copas = require 'copas'
local http = require 'copas.http'

local network = {}

-- Run this function asynchronously with the caller. Runs it as a coroutine, so that network
-- requests inside it will
function network.async(foo)
    copas.addthread(foo)
end

-- Same interface as http://w3.impa.br/~diego/software/luasocket/http.html#request
function network.request(firstArg, ...)
    local url, method
    if type(firstArg) == 'table' then
        url = firstArg.url
        method = firstArg.method or 'GET'
    else
        url = firstArg
        method = select('#', ...) == 0 and 'GET' or 'POST'
    end

    local startTime = love.timer.getTime()
    local function done(...)
        local ms = math.floor(1000 * (love.timer.getTime() - startTime))
        print(ms .. 'ms', method, url)
        return ...
    end

    return done(http.request(firstArg, ...))
end

-- Perform any updates the network system has to do -- this is run by base automatically and you
-- shouldn't have to call it...
function network.update(dt)
    copas.step(0)
end

return network

