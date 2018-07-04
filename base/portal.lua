-- Manage loading, lifetime management and event forwarding for entries

-- The root `_G`
local GG = _G

-- Listing of Love callbacks. Keep in sync with https://love2d.org/wiki/love#Callbacks.
local loveCallbacks = {
    directorydropped = true,
    draw = true,
    -- Skip these and just use the default error handler everywhere
    --    errhand = true,
    --    errorhandler = true,
    filedropped = true,
    focus = true,
    keypressed = true,
    keyreleased = true,
    lowmemory = true,
    mousefocus = true,
    mousemoved = true,
    mousepressed = true,
    mousereleased = true,
    quit = true,
    resize = true,
    --    run = true,
    textedited = true,
    textinput = true,
    threaderror = true,
    touchmoved = true,
    touchpressed = true,
    touchreleased = true,
    update = true,
    visible = true,
    wheelmoved = true,
    gamepadaxis = true,
    gamepadpressed = true,
    gamepadreleased = true,
    joystickadded = true,
    joystickaxis = true,
    joystickhat = true,
    joystickpressed = true,
    joystickreleased = true,
    joystickremoved = true,
}

-- Set up `love` global for a portal. Various scoping and network fixes.
local function setupLove(newPortal)
    local basePath = newPortal.basePath

    local newLove = {}
    newPortal.globals.love = newLove

    -- Whitelisted top-level functions
    newLove.getVersion = love.getVersion
    newLove.hasDeprecationOutput = love.hasDeprecationOutput
    newLove.setDeprecationOutput = love.setDeprecationOutput

    -- Make all sub-libraries new tables that inherit from the originals
    for k, v in pairs(love) do
        if type(v) == 'table' then
            newLove[k] = setmetatable({}, { __index = love[k] })
        end
    end

    -- Libraries to remove
    newLove.event = nil

    -- Fetch asset contents as string, given relative path under portal's `basePath`
    local function fetchAsset(path)
        local response = network.fetch(newPortal.basePath .. '/' .. path)
        return response
    end

    -- Fetch as `FileData`
    local function fetchFileData(path)
        return love.filesystem.newFileData(fetchAsset(path), path)
    end

    function newLove.filesystem.load(path)
        return function()
            return newPortal.globals.require(path, { saveCache = false })
        end
    end

    function newLove.filesystem.lines(path)
        return fetchAsset(path):gmatch("[^\r\n]+")
    end

    function newLove.graphics.newFont(...)
        local nArgs = select('#', ...)
        if nArgs == 0 then return love.graphics.newFont() end
        local path = select(1, ...)
        if type(path) == 'string' then
            return love.graphics.newFont(love.font.newRasterizer(fetchFileData(path)))
        elseif nArgs == 1 then -- Need to do it this way for some reason...
            return love.graphics.newFont(path)
        else
            return love.graphics.newFont(path, ...)
        end
    end

    function newLove.graphics.newImage(path, ...)
        if type(path) == 'string' then
            return love.graphics.newImage(love.image.newImageData(fetchFileData(path)))
        else
            return love.graphics.newImage(path, ...)
        end
    end

    function newLove.image.newImageData(path, ...)
        if type(path) == 'string' then
            return love.image.newImageData(fetchFileData(path))
        else
            return love.image.newImageData(path, ...)
        end
    end

    function newLove.audio.newSource(path, ...)
        if type(path) == 'string' then
            return love.audio.newSource(fetchFileData(path), ...)
        else
            return love.audio.newSource(path, ...)
        end
    end

    function newLove.graphics.newShader(path, ...)
        if type(path) == 'string' and not path:match('\n') then
            return love.graphics.newShader(fetchFileData(path), ...)
        else
            return love.graphics.newShader(path, ...)
        end
    end
end

-- Metatable of portal instances
local portalMeta = {}

-- Create a basic unpopulated portal instance
local function createInstance()
    return setmetatable({}, { __index = portalMeta })
end

-- Load a portal to given `require`-able `path`
function portalMeta.newChild(self, path, args)
    -- Create the portal instance
    local child = createInstance()
    child.args = args or {}
    child.path = path

    -- Figure out base path
    if path:match('^https?://') then
        child.basePath = path:gsub('(.*)/(.*)', '%1')
    else
        child.basePath = self.basePath
    end

    -- Create a new globals table `__index`ing to the base one
    child.globals = setmetatable({}, { __index = GG })
    child.globals.portal = child

    -- Make a copy of the `package` table that resets the loaded modules
    child.globals.package = setmetatable({}, { __index = package })
    child.globals.package.loaded = {}

    -- Set up the `love` global
    setupLove(child)

    -- `require` it!
    self.globals.require(path, {
        parentEnv = self.globals,
        childEnv = child.globals,
        saveCache = false, -- Always reload portals
        -- Add a preamble that loads 'conf.lua' often present alongside 'main.lua':
        -- https://love2d.org/wiki/Config_Files
        -- The associated `love.conf(...)` is ignored, but 'conf.lua' may have some other side
        -- effects that matter (eg., setting some global variables).
        preamble = [[
            pcall(require, 'conf')
        ]]
    })

    -- Call `love.load` callback and set as loaded
    if child.globals.love.load then
        child.globals.love.load({ child.basePath })
    end
    child.loaded = true

    return child
end

-- Add all of the callbacks as methods
for cbName in pairs(loveCallbacks) do
    portalMeta[cbName] = function(self, ...)
        local found = self.globals.love[cbName]
        if found then found(...) end
    end
end

-- Return a root portal instance
local root = createInstance()
root.globals = setmetatable({}, { __index = GG })
root.loaded = true
return root
