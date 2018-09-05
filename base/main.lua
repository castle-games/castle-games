math.randomseed(10000 * require('socket').gettime())


-- Built-in libraries

--if not love.system.getOS() ~= 'iOS' then
--    tui = require 'tui'
--end
network = require 'network'
require = require 'require'
root = require 'portal'
splash = require 'splash'


-- Top-level Love callbacks

local initialFileDropped -- In case a `love.filedropped` before home experience is loaded
local homeUrl
local homeVersion = 'e0909a90e9d04a895531cd1013bdb39c9b18cdc4' -- Git branch, tag or commit hash of home experience to show
local home -- Portal to the home experience

local main = {}

function main.load(arg)
    if tui then
        tui.love.load()
    end

    network.async(function()
        local localUrl = 'http://0.0.0.0:8032/main.lua'
        local remoteUrl = 'https://raw.githubusercontent.com/nikki93/ghost-home2/' .. homeVersion .. '/main.lua'

        if love.system.getOS() ~= 'Windows' then -- Failed 'http://0.0.0.0' requests hang indefinitely on Windows...
            -- If local version is being served, use that, else use remote
            if network.exists(localUrl) then
                homeUrl = localUrl
            else
                homeUrl = remoteUrl
            end
        end
        home = root:newChild(homeUrl, { noConf = true })
        if initialFileDropped then
            home:filedropped(initialFileDropped)
            initialFileDropped = nil
        end
    end)
end

function main.update(dt)
    network.update(dt)

    if tui then
        tui.love.preupdate(dt)
    end

    if home then
        home:update(dt)
    else
        splash:update(dt)
    end

    if tui then
        tui.love.postupdate()
    end
end

local debugFont = love.graphics.newFont()

function main.draw()
    if home then
        home:draw()
    else
        splash:draw()
    end

    do -- Debug overlay
        love.graphics.push('all')
        love.graphics.setFont(debugFont)
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

    if tui then
        tui.love.draw()
    end
end

function main.keypressed(key, ...)
    -- F12: reload home
    if key == 'f12' then
        if homeUrl then
            network.async(function()
                network.flush()
                home = root:newChild(home.path)
            end)
        end
        return
    end

    if tui then
        tui.love.keypressed(key)
    end

    if home then
        home:keypressed(key, ...)
    end
end

function main.filedropped(file)
    if home then
        home:filedropped(file)
    else
        initialFileDropped = file
    end
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
    focus = true,
    filedropped = true,
    visible = true,
}) do
    love[k] = function(...)
        if main[k] then
            main[k](...)
        else -- Default behavior if we didn't define it in `main`
            if tui and tui.love[k] then
                tui.love[k](...)
            end

            if home and home[k] then
                home[k](home, ...)
            end
        end
    end
end

