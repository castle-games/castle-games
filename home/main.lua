function love.draw()
    love.graphics.push('all')
    love.graphics.ellipse('fill', 0, 0, 20, 20)
    love.graphics.pop()

    if love.keyboard.isDown('q') then
        portal.exit()
    end
end
