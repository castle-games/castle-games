print('main', _G)
local t = require 'https://7859de82.ngrok.io/sub.lua'

local x = portal.args.x
local y = portal.args.y

local children = {}

function love.draw()
    love.graphics.push('all')
    love.graphics.setColor(1, 0, 0)
    love.graphics.ellipse('fill', x, y, 20, 20)
    love.graphics.pop()

    for _, child in pairs(children) do
        child:draw()
    end
end

function love.mousepressed()
    if portal.args.spawnChildren then
        table.insert(children, portal:newChild('https://7859de82.ngrok.io/main.lua', {
            x = love.graphics.getWidth() * math.random(),
            y = love.graphics.getHeight() * math.random(),
        }))
    end
end
