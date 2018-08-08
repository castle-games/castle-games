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


-- Forward declaratoins

local app, errors


-- App management

app = {}

function app.load(url)
    app.lastUrl = url
    network.async(function()
        app.portal = portal:newChild(url)
        app.loadTime = love.timer.getTime()
        print("loaded '" .. url .. "'")
        errors.clear()
    end)
end

function app.reload()
    if app.lastUrl then
        network.flush(function() return true end) -- Flush entire `network.fetch` cache
        app.load(app.lastUrl)
    end
end

function app.close()
    app.portal = nil
end

function app.forwardEvent(eventName, ...)
    if app.portal and app.portal[eventName] then
        app.portal[eventName](app.portal, ...)
    end
end

function app.drawLoadedIndicator()
    if app.portal and love.timer.getTime() - app.loadTime < 2 then
        love.graphics.push('all')
        love.graphics.setColor(0.8, 0.5, 0.1)
        local fontH = love.graphics.getFont():getHeight()
        local yStep = 1.2 * fontH
        love.graphics.print("loaded '" .. app.lastUrl .. "'",
            yStep - fontH + 4,
            love.graphics.getHeight() - yStep)
        love.graphics.pop('all')
    end
end


-- Error management

errors = {}

function portal.onError(err, descendant)
    app.close()
    errors.lastError = "portal to '" .. descendant.path .. "' was closed due to error:\n" .. err
    print('error: ' .. errors.lastError)
    network.flush(function() return true end) -- Flush entire `network.fetch` cache
end

function errors.clear()
    errors.lastError = nil
end

function errors.update()
    if errors.lastError ~= nil then
        tui.setNextWindowPos(
            0.5 * love.graphics.getWidth(), 0.5 * love.graphics.getHeight(),
            'FirstUseEver',
            0.5, 0.5)
        tui.setNextWindowSize(480, 120, 'FirstUseEver')
        tui.inWindow('error', true, function(open)
            if not open then
                errors.clear()
                return
            end

            if tui.button('reload') then
                app.reload()
            end
            tui.sameLine()
            if love.system.getClipboardText() ~= errors.lastError then
                if tui.button('copy message') then
                    love.system.setClipboardText(errors.lastError)
                end
            else
                tui.alignTextToFramePadding()
                tui.text('message copied!')
            end

            tui.inChild('error message', function()
                tui.textWrapped(errors.lastError)
            end)
        end)
    end
end


-- Launcher window

local launcher = {}

function launcher.update()
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

    tui.setNextWindowPos(40, 40, 'FirstUseEver')
    tui.setNextWindowSize(480, 320, 'FirstUseEver')
    tui.inWindow('welcome to ghost!', function()
        for name, url in pairs(urls) do
            if tui.button(name) then
                app.load(url)
            end
        end
        tui.text('fps: ' .. tostring(love.timer.getFPS()))
    end)
end


-- Development window

local development = {}

development.visible = false
development.consoleMessages = {}
development.scrollToBottom = true

function development.toggle()
    development.visible = not development.visible
end

function development.update()
    if not development.visible then
        return
    end

    tui.setNextWindowPos(40, love.graphics.getHeight() - 240 - 40, 'FirstUseEver')
    tui.setNextWindowSize(480, 240, 'FirstUseEver')
    tui.inWindow('development', function()
        if tui.button('reload portal') then
            app.reload()
        end
        tui.sameLine()
        if tui.button('clear console') then
            development.consoleMessages = {}
        end

        tui.inChild('console', function()
            for _, message in ipairs(development.consoleMessages) do
                tui.textWrapped(message)
            end
            if development.scrollToBottom then
                tui.setScrollHere()
                development.scrollToBottom = false
            end
        end)
    end)
end

function development.print(...)
    local message = select(1, ...)
    for i = 2, select('#', ...) do
        message = message .. '    ' .. select(i, ...)
    end
    table.insert(development.consoleMessages, message)
    development.scrollToBottom = true
end

local oldPrint = print
function print(...) -- Replace global `print`, but stil call original
    oldPrint(...)
    development.print(...)
end


-- Top-level Love callbacks

local main = {}

function main.load(arg)
    tui.love.load()
end

function main.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    app.forwardEvent('update', dt)

    launcher.update()
    errors.update()
    development.update()

    tui.love.postupdate()
end

function main.draw()
    app.forwardEvent('draw')

    app.drawLoadedIndicator()

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

function main.keypressed(key, ...)
    -- F5 or cmd + r: reload
    if key == 'f5' or (love.keyboard.isDown('lgui') and key == 'r') then
        network.async(function()
            app.reload()

            -- GC and print memory usage
            collectgarbage()
            print(math.floor(collectgarbage('count')) .. 'KB', 'mem usage')
        end)
        return
    end

    -- F4 or cmd + d: development
    if key == 'f4' or (love.keyboard.isDown('lgui') and key == 'd') then
        development.toggle()
        return
    end

    tui.love.keypressed(key, ...)

    app.forwardEvent('keypressed', key, ...)
end

for k in pairs({
    load = true,
    update = true,
    draw = true,
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
        if main[k] then
            main[k](...)
        else -- Default behavior if we didn't define it in `main`
            if tui.love[k] then
                tui.love[k](...)
            end

            app.forwardEvent(k, ...)
        end
    end
end

