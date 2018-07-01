function love.draw()
    love.graphics.push('all')
    love.graphics.ellipse('fill', portal.args.x, portal.args.y, 20, 20)
    love.graphics.pop()

    if love.keyboard.isDown(portal.args.quitKey) then
        portal.exit()
    end
end
