-- Love settings

local defaultW, defaultH = love.graphics.getDimensions()
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

local defaultAppUrl = 'https://raw.githubusercontent.com/EvanBacon/love-game/master/main.lua'
local app = {}

function love.update(dt)
    network.update(dt)
    if app[1] then app[1]:update(dt) end
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
        if k == 'keypressed' then
            local key = ...
            if key == '0' then
                table.remove(app, 1)
            elseif key == '1' then
                network.async(function()
                    table.insert(app, 1, portal:newChild(defaultAppUrl))
                end)
            elseif key == '2' then
                network.async(function()
                    table.insert(app, 1, portal:newChild('https://raw.githubusercontent.com/ccheever/tetris-ghost/master/main.lua'))
                end)
            elseif key == '3' then
                network.async(function()
                    table.insert(app, 1, portal:newChild('https://raw.githubusercontent.com/M-Mabrouk/Breakout/master/main.lua'))
                end)
            end
        end
        if app[1] then app[1][k](app[1], ...) end
    end
end

function love.draw()
    if app[1] then app[1]:draw() end

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
    defaultAppUrl = arg[1]
end

