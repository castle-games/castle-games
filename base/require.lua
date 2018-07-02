-- scoped + async + network `require`

-- We need to write a new Lua function rather than change `package.loaders` because the default
-- `require` is a C function and coroutines can't yield through it.

-- Useful reference implementation of default `require` at:
-- https://github.com/hoelzro/lua-procure/blob/5abd3d30987bf3f0984d1e452cdb7db5e0b50a1c/procure/init.lua

local defaultRequire = require

local http = require 'copas.http'

-- Our `http.request` wrapper -- currently `print`s time taken + method + url
local function request(firstArg, ...)
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

-- Quick utility to check if given path writtens a '200 ok' response
local function exists(path)
    local r, httpCode, headers, status = request {
        url = path,
        method = 'HEAD',
    }
    return httpCode == 200
end

local function envWrap(delta, baseEnv)
    return setmetatable(delta, { __index = baseEnv, __newindex = baseEnv })
end

local function explicitRequire(path, parentEnv, childEnv, basePath, saveCache)
    -- Built-in?
    if path ~= 'main' then
        local builtin = _G.package.loaded[path]
        if builtin then return builtin end
        pcall(function() builtin = defaultRequire(path) end)
        if builtin then return builtin end
    end

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
        local oldChildRequire = childEnv.require
        childEnv.require = function(path, newParentEnv, ...)
            return oldChildRequire(path, childEnv or newParentEnv, ...)
        end
    end

    local isAbsolute = false
    local absolute

    if path:match('^https?://') then -- Already absolute?
        isAbsolute = true
        absolute = path
    elseif basePath then
        absolute = basePath .. '/' .. path:gsub('%.', '/')
    else
        error("'" .. path .. "' is not absolute but no base path is known")
    end

    -- Deal with '.lua' or '/init.lua' appending
    local url
    absolute = absolute:gsub('%.lua$', '')
    if exists(absolute .. '.lua') then
        url = absolute .. '.lua'
    elseif exists(absolute .. '/init.lua') then
        url = absolute .. '/init.lua'
    else
        error("no `url` found for '" .. path .. "'")
    end

    -- Update `basePath` for sub-`require`s -- do it here after we've figured out `url` with
    -- potential '/init.lua' on the end etc.
    if isAbsolute then
        local newBasePath = url:gsub('(.*)/(.*)', '%1')
        local oldChildEnv = childEnv
        local oldChildRequire = childEnv.require
        childEnv = setmetatable({
            require = function(path, p, c, override, ...)
                return oldChildRequire(path, p, c, override or newBasePath, ...)
            end,
        }, { __index = oldChildEnv, __newIndex = oldChildEnv })

        if parentEnv ~= oldChildEnv then
            oldChildEnv.require = childEnv.require
        end
    end

    -- Fetch
    local response, httpCode, headers, status = request(url)
    if response == nil or httpCode ~= 200 then
        error("error fetching '" .. url .. "': " .. status)
    end

    -- Parse
    local chunk, err = load(response, url, 'bt', childEnv)
    if chunk == nil then
        error("error parsing '" .. url .. "': " .. err)
    end

    -- Figure out the short alias if absolute
    local alias = path
    if isAbsolute then
        alias = path:gsub('(.*)/(.*)', '%2'):gsub('%.lua$', ''):gsub('/init%.lua$', '')
    end

    -- Run
    local result = chunk(alias)

    -- Save to cache
    if saveCache ~= false then
        print(path)
        if result ~= nil then
            assert(not package.loaded[alias],
                "alias '" .. alias .. "' for path '" .. path .. "' will cause a collision")
            package.loaded[path] = result
            package.loaded[alias] = result
        elseif package.loaded[path] == nil then
            assert(not package.loaded[alias],
                "alias '" .. alias .. "' for path '" .. path .. "' will cause a collision")
            package.loaded[path] = true
            package.loaded[alias] = true
        end
    end

    return result == nil and true or result
end

return explicitRequire