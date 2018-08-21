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
love.window.setTitle('ghost-player')


-- Built-ins

cef = require 'cef'
tui = require 'tui'
network = require 'network'
require = require 'require'
root = require 'portal'
splash = require 'splash'


local ffi = require 'ffi'
local C = ffi.C


-- Top-level Love callbacks

local initialFileDropped -- In case a `love.filedropped` before home experience is loaded
local tryLocalHome = true
local homeUrl
local homeVersion = '3f0ba667c89299a879c41e73808b8c1fe008d842' -- Git branch, tag or commit hash of home experience to show
local home -- Portal to the home experience

local main = {}

function main.load(arg)
    tui.love.load()

    network.async(function()
        local localUrl = 'http://0.0.0.0:8032/main.lua'
        local remoteUrl = 'https://raw.githubusercontent.com/nikki93/ghost-home2/' .. homeVersion .. '/main.lua'

        -- If local version is being served, use that, else use remote
        if tryLocalHome and network.exists(localUrl) then
            homeUrl = localUrl
        else
            homeUrl = remoteUrl
        end
        home = root:newChild(homeUrl, { noConf = true })
        if initialFileDropped then
            home:filedropped(initialFileDropped)
            initialFileDropped = nil
        end
    end)

    do
        local app = ffi.new('cef_app_t[1]')
        app[0].base.size = ffi.sizeof(app)
        app[0].base.add_ref = function() end
        app[0].base.release = function() return 1 end
        app[0].base.has_one_ref = function() return 1 end
        app[0].on_before_command_line_processing = function() end
        app[0].on_register_custom_schemes = function() end
        app[0].get_resource_bundle_handler = function() end
        app[0].get_browser_process_handler = function() end
        app[0].get_render_process_handler = function() end

        local main_args = ffi.new('cef_main_args_t[1]')
        main_args[0].argc = 0

        -- local ret = C.cef_execute_process(main_args, app, nil)

        local settings = ffi.new('cef_settings_t[1]')
        settings[0].size = ffi.sizeof(settings)
        settings[0].windowless_rendering_enabled = true
        settings[0].log_severity = C.LOGSEVERITY_VERBOSE

        C.cef_initialize(main_args, settings, app, nil)

        local client = ffi.new('cef_client_t[1]')
    end
end

function main.update(dt)
    network.update(dt)

    tui.love.preupdate(dt)

    if home then
        home:update(dt)
    else
        splash:update(dt)
    end

    tui.love.postupdate()
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

    tui.love.draw()
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

    tui.love.keypressed(key)

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
            if tui.love[k] then
                tui.love[k](...)
            end

            if home and home[k] then
                home[k](home, ...)
            end
        end
    end
end

