-- scoped + async + network `require`

-- We need to write a new Lua function rather than change `package.loaders` because the default
-- `require` is a C function and coroutines can't yield through it.

-- Useful reference implementation of default `require` at:
-- https://github.com/hoelzro/lua-procure/blob/5abd3d30987bf3f0984d1e452cdb7db5e0b50a1c/procure/init.lua

local defaultRequire = require

-- Quick utility to check if given path returns a '200 ok' response
local function exists(path)
    local r, httpCode, headers, status = network.request {
        url = path,
        method = 'HEAD',
    }
    return httpCode == 200
end

-- New table based on `a` with `b` providing defaults
local function defaultOpts(a, b)
    local o = {}
    if type(b) == 'table' then for k, v in pairs(b) do o[k] = v end end
    if type(a) == 'table' then for k, v in pairs(a) do o[k] = v end end
    return o
end

local function explicitRequire(path, opts)
    -- Built-in?
    if path ~= 'main' then
        local builtin = _G.package.loaded[path]
        if builtin then return builtin end
        pcall(function() builtin = defaultRequire(path) end)
        if builtin then return builtin end
    end

    local opts = opts or {}
    local basePath = opts.basePath
    local parentEnv = assert(opts.parentEnv, '`explicitRequire` needs `parentEnv`')
    local childEnv = opts.childEnv
    local saveCache = opts.saveCache

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
        childEnv.require = function(path, opts)
            return oldChildRequire(path, defaultOpts(opts, {
                parentEnv = childEnv,
            }))
        end
    end

    path = path:gsub('%.lua$', '')

    local isAbsolute = false
    local absolute

    if path:match('^https?://') then -- Already absolute?
        isAbsolute = true
        absolute = path
    elseif basePath then
        path = path:gsub('^%.*', ''):gsub('%.*$', '') -- Remove leading or trailing '.'s
        absolute = basePath .. '/' .. path:gsub('%.', '/')
    else
        error("'" .. path .. "' is not absolute but no base path is known")
    end

    -- Deal with '.lua' or '/init.lua' appending
    local url
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
            require = function(path, opts)
                return oldChildRequire(path, defaultOpts(opts, {
                    basePath = newBasePath,
                }))
            end,
        }, { __index = oldChildEnv, __newIndex = oldChildEnv })

        -- TODO(nikki): In process of using below to fix `portal.newPortal` with relative paths
        if parentEnv ~= oldChildEnv then
            oldChildEnv.require = childEnv.require
        end
    end

    -- Fetch
    local response, httpCode, headers, status = network.request(url)
    if response == nil or httpCode ~= 200 then
        error("error fetching '" .. url .. "': " .. status)
    end

    -- Parse
    local chunk, err = load(response, path:gsub('(.*)/(.*)', '%2'), 'bt', childEnv)
    if chunk == nil then
        error("error parsing '" .. url .. "': " .. err)
    end

    -- Figure out the short alias if absolute
    local alias = path
    if isAbsolute then
        alias = path:gsub('(.*)/(.*)', '%2') -- Remove everything till last '/'
    end
    alias = alias:gsub('/?init%.lua$', ''):gsub('%.lua$', '')

    -- Run
    local result = chunk(alias)

    -- Save to cache
    if saveCache ~= false then
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

local function require(path, opts)
    return explicitRequire(path, defaultOpts(opts, {
        parentEnv = _G,
    }))
end

return require