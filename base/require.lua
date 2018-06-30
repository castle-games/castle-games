-- `require` but also over the network

-- Useful reference implementation of default `require` at:
-- https://github.com/hoelzro/lua-procure/blob/5abd3d30987bf3f0984d1e452cdb7db5e0b50a1c/procure/init.lua

local defaultRequire = require

local http = require 'copas.http'

local function require(path)
    -- Cached?
    local found = package.loaded[path]
    if found ~= nil then return found end

    if path:match('^https?') then
        local response, httpCode, headers, status = http.request(path)
        if response == nil then
            error("error fetching '" .. path .. "': " .. httpCode)
        end

        print("fetched '" .. path .. "'")
        print('\theaders:')
        for k, v in pairs(headers) do
            print('\t\t' .. k, v)
        end

        local chunk, err = load(response, path)
        if chunk == nil then
            error("error parsing '" .. path .. "': " .. err)
        end

        local result = chunk(path)
        if result ~= nil then
            package.loaded[path] = result
        elseif package.loaded[path] == nil then
            package.loaded[path] = true
        end
        return package.loaded[path]
    else
        return defaultRequire(path)
    end
end

return require