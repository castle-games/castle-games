-- Manage loading, lifetime management and event forwarding for entries

local copas = require 'copas'

-- Listing of Love callbacks. Keep in sync with https://love2d.org/wiki/love#Callbacks.
local loveCallbacks = {
    directorydropped = true,
    draw = true,
    -- TODO(nikki): Figure out what to do for these
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

-- Metatable of portal instances
local portalMeta = {}

-- Create a basic unpopulated portal instance
local function createInstance()
    return setmetatable({}, { __index = portalMeta })
end

-- Load a portal to given `require`-able `path`
local baseGlobals = _G
function portalMeta.newChild(self, path, args)
    -- Create the portal instance
    local child = createInstance()
    child.args = args or {}

    -- Create a new globals table `__index`ing to the base one
    child.globals = setmetatable({}, { __index = baseGlobals })
    child.globals._G = child.globals
    child.globals.portal = child

    -- Make a copy of the `package` table that resets the loaded modules
    child.globals.package = setmetatable({}, { __index = baseGlobals.package })
    child.globals.package.loaded = {}

    -- Make a copy of the `love` table that skips the callbacks and some other stuff and scopes some
    -- functions
    child.globals.love = {}
    for k, v in pairs(baseGlobals.love) do
        if loveCallbacks[k] == nil then
            child.globals.love[k] = v
        end
    end
    child.globals.love.event = nil

    -- The `require` is async so do it in a new coroutine
    copas.addthread(function()
        require(path, { env = child.globals })
        package.loaded[path] = nil -- Force loading a new instance next time
        if child.globals.love.load then child.globals.love.load() end -- Call `load` callback if set
        child.loaded = true
    end)

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
return createInstance()
