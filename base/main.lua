-- Love settings

local defaultW, defaultH = love.graphics.getDimensions()
love.window.setMode(defaultW, defaultH, {
    msaa = 4,
    resizable = true,
    borderless = love.system.getOS() == 'iOS',
    highdpi = true,
})


-- Load built-in libraries

network = require 'network'


-- Bootstrap remote-`require` based on `_G`, then load the `portal` library

local explicitRequire = require 'require'
require = function(path, p, ...)
    return explicitRequire(path, p or _G, ...)
end

portal = require 'portal'


-- Top-level Love callbacks

function love.update(dt)
    network.update(dt)
end


-- Start!

local homeUrl = 'https://raw.githubusercontent.com/nikki93/ghost-home/master/main.lua'
--local homeUrl = 'https://ecdd2004.ngrok.io/main.lua'

local home = portal:newChild(homeUrl, {
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
