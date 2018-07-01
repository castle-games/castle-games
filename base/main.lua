-- Bootstrap

require = require 'require'
portal = require 'portal'


-- Main events

local copas = require 'copas'

function love.update(dt)
    copas.step(0)
end


-- Start!

portal.enter 'http://0.0.0.0:8000/main.lua'
