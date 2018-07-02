-- Love settings

local defaultW, defaultH = love.graphics.getDimensions()
love.window.setMode(defaultW, defaultH, {
    msaa = 4,
    resizable = true,
    borderless = love.system.getOS() == 'iOS',
    highdpi = true,
})


-- Load built-in libraries

network = require 'network'


-- Bootstrap remote-`require` based on `_G`, then load the `portal` library

local explicitRequire = require 'require'
require = function(path, p, ...)
    return explicitRequire(path, p or _G, ...)
end

portal = require 'portal'


-- Top-level Love callbacks

local home

function love.update(dt)
    network.update(dt)
    if home then home:update(dt) end
end

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
        if home then home[k](home, ...) end
    end
end

function love.draw()
    if home then home:draw() end

    do -- Overlay showing ongoing network requests
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


-- Start!

function love.load(arg)
    --local homeUrl = 'https://raw.githubusercontent.com/nikki93/ghost-home/master/main.lua'
    --local homeUrl = 'https://ecdd2004.ngrok.io/main.lua'
    --local homeUrl = 'http://0.0.0.0:8000/main.lua'
    local homeUrl = arg[1] or 'https://raw.githubusercontent.com/EvanBacon/love-game/master/main.lua'

    network.async(function()
        home = portal:newChild(homeUrl, {
            x = 20,
            y = 20,
            spawnChildren = true,
        })
    end)
end

