-- async + network `require`

-- We need to write a new Lua function rather than change `package.loaders` because the default
-- `require` is a C function and coroutines can't yield through it.

-- Useful reference implementation of default `require` at:
-- https://github.com/hoelzro/lua-procure/blob/5abd3d30987bf3f0984d1e452cdb7db5e0b50a1c/procure/init.lua

local defaultRequire = require

local http = require 'copas.http'

local function explicitRequire(path, parentEnv, childEnv)
    -- By default use a new `parentEnv` inheriting from `_G`
    assert(parentEnv, '`explicitRequire` needs `parentEnv`')

    -- Make sure we use `package` from `parentEnv` to handle `package.loaded` correctly
    local package = parentEnv.package

    -- Cached?
    local found = package.loaded[path]
    if found ~= nil then return found end

    -- Use the `parentEnv` by default for the new module, but if a new `childEnv` is given, make
    -- that the `parentEnv` for sub-`require`s by default
    childEnv = childEnv or parentEnv
    if childEnv ~= parentEnv then
        childEnv.require = function(path, newParentEnv, ...)
            return explicitRequire(path, childEnv or newParentEnv, ...)
        end
    end

    if path:match('^https?') then
        -- Fetch
        local response, httpCode, headers, status = http.request(path)
        if response == nil or httpCode ~= 200 then
            error("error fetching '" .. path .. "': " .. status)
        end

        -- Parse
        local chunk, err = load(response, path, 'bt', childEnv)
        if chunk == nil then
            error("error parsing '" .. path .. "': " .. err)
        end

        -- Run and save
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

return explicitRequire