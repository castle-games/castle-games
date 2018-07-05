-- Love settings

local defaultW, defaultH = 736, 414
love.window.setMode(defaultW, defaultH, {
    msaa = 4,
    resizable = true,
    borderless = love.system.getOS() == 'iOS',
    highdpi = true,
})


-- Built-ins

tui = require 'tui'
network = require 'network'
require = require 'require'
entity = require 'entity'
portal = require 'portal'


-- Top-level Love callbacks

local app -- Save our app portal here when loaded

function love.load(arg)
    tui.love.load()
end

function love.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    if app then app:update(dt) end

    local uris = {
        ["localhost"] = 'http://0.0.0.0:8000/main.lua',
        ["evan's"] = 'https://raw.githubusercontent.com/EvanBacon/love-game/master/main.lua',
        ["ccheever's"] = 'https://raw.githubusercontent.com/ccheever/tetris-ghost/master/main.lua',
        ["nikki's"] = 'https://raw.githubusercontent.com/nikki93/ghost-home/master/main.lua',
    }

    tui.inWindow('welcome to ghost!', function()
        for name, uri in pairs(uris) do
            if tui.button(name) then
                network.async(function()
                    app = portal:newChild(uri)
                end)
            end
        end
    end)

    tui.love.postupdate()
end

function love.draw()
    if app then
        app:draw()
    end

    -- Overlay showing ongoing network requests
    do
        local fontH = love.graphics.getFont():getHeight()
        local yStep = 1.2 * fontH
        local y = love.graphics.getHeight()
        for _, req in ipairs(network.requests) do
            y = y - yStep
            local ms = math.floor(1000 * req.time)
            love.graphics.print(req.url .. '    ' .. req.method .. '     ' .. tostring(ms),
                yStep - fontH + 4, y)
        end
    end

    tui.love.draw()
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
        if tui.love[k] then
            tui.love[k](...)
        end

        if app then app[k](app, ...) end
    end
end

