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

-- Set up `love` global for a portal. Currently performs the following:
--     - Wraps Love functions to load resources from the network given a base path
local function setupLove(newPortal)
    local basePath = newPortal.basePath

    local newLove = {}
    newPortal.globals.love = newLove

    -- Make all sub-libraries new tables that inherit from the originals
    for k, v in pairs(love) do
        if type(v) == 'table' then
            newLove[k] = setmetatable({}, { __index = love[k] })
        elseif not loveCallbacks[k] then
            newLove[k] = v
        end
    end

    -- Libraries to remove
    newLove.event = nil

    -- Fetch as string
    local function fetch(path)
        local url = newPortal.basePath .. '/' .. path
        local response, httpCode, headers, status = network.request(url)
        if httpCode ~= 200 then
            error("error fetching '" .. url .. "': " .. status)
        end
        return response
    end

    -- Fetch as `FileData`
    local function fetchFileData(path)
        return love.filesystem.newFileData(fetch(path), path)
    end

    function newLove.filesystem.load(path)
        return function()
            return newPortal.globals.require(path)
        end
    end

    function newLove.graphics.newFont(...)
        local nArgs = select('#', ...)
        if nArgs == 0 then return love.graphics.newFont() end
        local path = select(1, ...)
        if type(path) == 'string' then
            return love.graphics.newFont(love.font.newRasterizer(fetchFileData(path)), ...)
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
    child.globals._G = child.globals
    child.globals.portal = child

    -- Make a copy of the `package` table that resets the loaded modules
    child.globals.package = setmetatable({}, { __index = package })
    child.globals.package.loaded = {}

    -- Set up the `love` global
    setupLove(child)

    -- `require` it!
    self.globals.require(path, self.globals, child.globals, nil, false)

    -- Call `love.load` callback and set as loaded
    if child.globals.love.load then
        child.globals.love.load()
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
