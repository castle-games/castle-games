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
root = require 'portal'


-- Top-level Love callbacks

local homeVersion = 'master' -- Git branch, tag or commit hash of home experience to show
local home -- Portal to the home experience

local main = {}

function main.load(arg)
    tui.love.load()

    network.async(function()
        local localUrl = 'http://0.0.0.0:8032/main.lua'
        local remoteUrl = 'https://raw.githubusercontent.com/nikki93/ghost-home2/' .. homeVersion .. '/main.lua'

        -- If local version is being served, use that, else use remote
        local _, localHttpCode = network.fetch(localUrl, 'HEAD')
        if localHttpCode == 200 then
            home = root:newChild(localUrl)
        else
            home = root:newChild(remoteUrl)
        end
    end)
end

function main.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    if home then
        home:update(dt)
    end

    tui.love.postupdate()
end

function main.draw()
    if home then
        home:draw()
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

            if home and home[k] then
                home[k](home, ...)
            end
        end
    end
end

