math.randomseed(10000 * require('socket').gettime())


-- Love settings

--local defaultW, defaultH = 736, 414 -- iPhone 6s Plus
local defaultW, defaultH = 1112, 834 -- iPad Pro 10.2"
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
portal = require 'portal'


-- Top-level Love callbacks

local app -- Save our app portal here when loaded
local appUrl -- Save the URL of the app here

function love.load(arg)
    tui.love.load()
end

function love.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    if app then app:update(dt) end

    local clipboard = love.system.getClipboardText()
    local urls = {
        ["localhost"] = 'http://0.0.0.0:8000/main.lua',
        ["clipboard (" .. clipboard .. ")"] = clipboard,
        ["evan's"] = 'https://raw.githubusercontent.com/EvanBacon/love-game/master/main.lua',
        ["ccheever's"] = 'https://raw.githubusercontent.com/ccheever/tetris-ghost/master/main.lua',
        ["nikki's"] = 'https://raw.githubusercontent.com/nikki93/ghost-home/ee1950fbfb2266f17719b7cf50f36ffe3bcb7f40/main.lua',
    }

    tui.inWindow('welcome to ghost!', function()
        for name, url in pairs(urls) do
            if tui.button(name) then
                network.async(function()
                    appUrl = url
                    app = portal:newChild(url)
                end)
            end
        end
        tui.text('fps: ' .. tostring(love.timer.getFPS()))
    end)

    tui.love.postupdate()
end

function love.draw()
    if app then
        app:draw()
    end

    do -- Debug overlay
        love.graphics.push('all')
        love.graphics.setColor(0.8, 0.5, 0.1)
        -- Ongoing network requests on bottom of screen
        local fontH = love.graphics.getFont():getHeight()
        local yStep = 1.2 * fontH
        local y = love.graphics.getHeight()
        for _, req in ipairs(network.requests) do
            y = y - yStep
            local ms = math.floor(1000 * req.time)
            love.graphics.print(req.url .. '    ' .. req.method .. '     ' .. tostring(ms),
                yStep - fontH + 4, y)
        end
        love.graphics.pop('all')
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
        if k == 'keypressed' and select(1, ...) == 'r' and love.keyboard.isDown('lgui') then
            -- Reload!
            network.flush(function(url)
                return url:match('^' .. app.basePath)
            end)
            app = portal:newChild(appUrl)
            return
        end

        if tui.love[k] then
            tui.love[k](...)
        end

        if app then app[k](app, ...) end
    end
end

