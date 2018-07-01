-- Bootstrap

require = require 'require'


-- Main events

local copas = require 'copas'

function love.update(dt)
    copas.step(0)
end


-- Start!

copas.addthread(function()
    require 'http://0.0.0.0:8000/main.lua'
end)