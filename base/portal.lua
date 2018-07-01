-- Manage loading, lifetime management and event forwarding for entries

local copas = require 'copas'

local entries = {}

local portal = {}

-- Listing of Love callbacks. Keep in sync with https://love2d.org/wiki/love#Callbacks.
local loveCallbacks = {
    directorydropped = true,
    draw = true,
    -- TODO(nikki): Figure out what to do for these
    --    errhand = true,
    --    errorhandler = true,
    filedropped = true,
    focus = true,
    keypressed = true,
    keyreleased = true,
    load = true,
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

-- Forward a Love callback event from the system to relevant entries
local function forwardLoveCallback(cb, ...)
    for name, entry in pairs(entries) do
        local found = entry.globals.love[cb]
        if found then found(...) end
    end
end

-- Override Love callbacks to forward them.
for cb in pairs(loveCallbacks) do
    love[cb] = function(...)
        forwardLoveCallback(cb, ...)
    end
end

-- To identify entries
local nextEntryId = 0
local function newEntryId()
    local id = nextEntryId
    nextEntryId = nextEntryId + 1
    return id
end

-- Enter the portal at the given `require`-able `path`
function portal.enter(path, args)
    local id = newEntryId()

    -- Make a copy of the `portal` table that scopes functions
    local newPortal = setmetatable({}, { __index = portal })
    newPortal.args = args
    function newPortal.exit()
        entries[id] = nil
    end

    -- Make a copy of the `love` table that skips the callbacks and some other stuff and scopes some
    -- functions
    local newLove = {}
    for k, v in pairs(love) do
        if loveCallbacks[k] == nil then
            newLove[k] = v
        end
    end
    newLove.event = nil

    -- Require it, with a new globals table that inherits from our root one
    local newGlobals = setmetatable({
        portal = newPortal,
        love = newLove,
    }, { __index = _G })
    copas.addthread(function()
        require(path, { env = newGlobals })
    end)

    -- Add a `entries` entry
    entries[id] = {
        globals = newGlobals,
    }
end

return portal
