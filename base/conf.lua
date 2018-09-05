local system = require 'love.system'

function love.conf(t)
    local theOS = system.getOS()
    local mobile = theOS == 'iOS' or theOS == 'Android'

    t.window.title = 'ghost-player'
    t.window.msaa = 4
    t.window.highdpi = true

    if mobile then
        t.window.borderless = true
    end

    if not mobile then
        t.window.width = 1112
        t.window.height = 834
        t.window.resizable = true
    end
end
