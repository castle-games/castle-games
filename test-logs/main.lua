local manyLogsIncrement = 100
local manyLogsCounter = 0
local manyLogsOn = false

function love.draw()
    love.graphics.print([[
    press M to toggle 'many logging' -- logs ]] .. manyLogsIncrement .. [[ lines per frame
        to test what happens when you log a lot
    press UP or DOWN to increase or decrease the number of lines logged by 'many logging'
        per frame in increments or decrements of 100

    press N to log an ASCII art 'N' immediately
        to test the responsiveness of logging
    ]], 20, 20)
end

function love.update()
    if manyLogsOn then
        for i = 1, manyLogsIncrement do
            manyLogsCounter = manyLogsCounter + 1
        end
    end
end

function love.keypressed(k)
    if k == 'm' then
        manyLogsOn = not manyLogsOn
    end
    if k == 'up' then
        manyLogsIncrement = manyLogsIncrement + 100
    end
    if k == 'down' then
        manyLogsIncrement = manyLogsIncrement - 100
        manyLogsIncrement = math.max(manyLogsIncrement, 0)
    end

    if k == 'n' then
        print("'||\\   ||` ")
        print(" ||\\\\  ||")
        print(" || \\\\ ||")
        print(" ||  \\\\||")
        print(".||   \\||.")
    end
end