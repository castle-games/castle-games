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


-- App management

local lastUrl
local currentApp

local function loadApp(url)
    lastUrl = url
    network.async(function()
        currentApp = portal:newChild(url)
    end)
end

local function reloadApp()
    loadApp(lastUrl)
end

local function forwardAppEvent(eventName, ...)
    if currentApp then
        currentApp[eventName](currentApp, ...)
    end
end


-- Error management

local currentError

function portal.onError(err, descendant)
    currentError = "portal to '" .. descendant.path .. "' was closed due to error:\n" .. err
    network.flush(function() return true end) -- Flush entire `network.fetch` cache
end

local function showErrorWindow()
    if currentError ~= nil then
        tui.setNextWindowSize(480, 120)
        tui.inWindow('error', true, function(open)
            if not open then
                currentError = nil
                return
            end
            tui.textWrapped(currentError)
        end)
    end
end


-- Top-level callbacks

function love.load(arg)
    tui.love.load()
end

function love.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    forwardAppEvent('update', dt)

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
                loadApp(url)
            end
        end
        tui.text('fps: ' .. tostring(love.timer.getFPS()))
    end)

    showErrorWindow()

    tui.love.postupdate()
end

function love.draw()
    forwardAppEvent('draw')

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
        if k == 'keypressed' then
            local key = select(1, ...)
            if key == 'f5' or (love.keyboard.isDown('lgui') and key == 'r') then
                network.async(function()
                    -- Reload!
                    network.flush(function() return true end) -- Flush entire `network.fetch` cache
                    reloadApp()

                    -- GC and print memory usage
                    collectgarbage()
                    print(math.floor(collectgarbage('count')) .. 'KB', 'mem usage')
                end)
                return
            end
        end

        if tui.love[k] then
            tui.love[k](...)
        end

        forwardAppEvent(k, ...)
    end
end

