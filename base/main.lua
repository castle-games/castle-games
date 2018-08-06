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


-- Top-level callbacks

local app -- Save our app portal here when loaded

local errorMessage

function portal.onError(err, descendant)
    errorMessage = "portal to '" .. descendant.path .. "' was closed due to error:\n" .. err
    app = nil
    network.flush(function() return true end) -- Flush entire `network.fetch` cache
end

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
        ["@wwwjim's"] = 'https://raw.githubusercontent.com/jimmylee/lua-examples/master/basic-5/main.lua',
        ["evan's"] = 'https://raw.githubusercontent.com/EvanBacon/love-game/master/main.lua',
        ["ccheever's"] = 'https://raw.githubusercontent.com/ccheever/tetris-ghost/master/main.lua',
        ["nikki's"] = 'https://raw.githubusercontent.com/nikki93/ghost-home/ee1950fbfb2266f17719b7cf50f36ffe3bcb7f40/main.lua',
        ["jason's"] = 'https://raw.githubusercontent.com/schazers/ghost-playground/master/main.lua',
        ["CIRCLOID"] = 'https://raw.githubusercontent.com/terribleben/circloid/release/main.lua',
    }

    tui.inWindow('welcome to ghost!', function()
        for name, url in pairs(urls) do
            if tui.button(name) then
                network.async(function()
                    app = portal:newChild(url)
                end)
            end
        end
        tui.text('fps: ' .. tostring(love.timer.getFPS()))
    end)

    if errorMessage ~= nil then
        tui.setNextWindowSize(480, 120)
        tui.inWindow('error', true, function(open)
            if not open then
                errorMessage = nil
                return
            end
            tui.textWrapped(errorMessage)
        end)
    end

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
            network.async(function()
                -- Reload!
                network.flush(function() return true end) -- Flush entire `network.fetch` cache
                app = portal:newChild(app.path)

                -- GC and print memory usage
                collectgarbage()
                print(math.floor(collectgarbage('count')) .. 'KB', 'mem usage')
            end)
            return
        end

        if tui.love[k] then
            tui.love[k](...)
        end

        if app then app[k](app, ...) end
    end
end

