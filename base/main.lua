-- Love settings

local defaultW, defaultH = love.graphics.getDimensions()
love.window.setMode(defaultW, defaultH, {
    msaa = 4,
    resizable = true,
    borderless = love.system.getOS() == 'iOS',
    highdpi = true,
})


-- Bootstrap with a `require` based on `_G`

local explicitRequire = require 'require'
require = function(path, p, ...)
    return explicitRequire(path, p or _G, ...)
end


-- Base globals

portal = require 'portal'


-- Main events

local copas = require 'copas'

function love.update(dt)
    copas.step(0)
end


-- Start!

local home = portal:newChild('https://7859de82.ngrok.io/main.lua', {
    x = 20,
    y = 20,
    spawnChildren = true,
})

function love.draw()
    if home then home:draw() end
end

function love.mousepressed(...)
    if home then home:mousepressed(...) end
end
