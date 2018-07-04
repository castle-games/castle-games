-- Love settings

local defaultW, defaultH = 736, 414
love.window.setMode(defaultW, defaultH, {
    msaa = 4,
    resizable = true,
    borderless = love.system.getOS() == 'iOS',
    highdpi = true,
})


-- Built-ins

network = require 'network'
require = require 'require'
portal = require 'portal'


-- Top-level Love callbacks

local app -- Save our app portal here when loaded

function love.load(arg)
    local url = arg[1] or 'https://raw.githubusercontent.com/nikki93/ghost-home/master/main.lua'
    network.async(function()
        app = portal:newChild(url)
    end)
end

function love.update(dt)
    network.update(dt)
    if app then app:update(dt) end
end

function love.draw()
    if app then
        app:draw()
    else
        love.graphics.print([[
loading home...
        ]], 20, 20)
    end

    -- Overlay showing ongoing network requests
    do
        local fontH = love.graphics.getFont():getHeight()
        local yStep = 1.2 * fontH
        local y = love.graphics.getHeight()
        for _, req in ipairs(network.requests) do
            y = y - yStep
            local ms = math.floor(1000 * req.time)
            love.graphics.print(
                req.url .. '    ' .. req.method .. '     ' .. tostring(ms),
                yStep - fontH + 4, y)
        end
    end
end

-- Forward the rest of the callbacks directly
for k in pairs({
    keypressed = true,
    keyreleased = true,
    mousefocus = true,
    mousemoved = true,
    mousepressed = true,
    mousereleased = true,
    resize = true,
    textedited = true,
    textinput = true,
    touchmoved = true,
    touchpressed = true,
    touchreleased = true,
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
}) do
    love[k] = function(...)
        if app then app[k](app, ...) end
    end
end

