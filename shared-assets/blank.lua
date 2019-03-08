-- Welcome to your new Castle project!
-- https://castle.games/get-started
-- Castle uses Love2D 11.1 for rendering and input: https://love2d.org/
-- See here for some useful Love2D documentation:
-- https://love2d-community.github.io/love-api/

local total_time_elapsed = 0

function love.draw()
  local y_offset = 8 * math.sin(total_time_elapsed * 3)
  love.graphics.print('Edit main.lua to get started!', 400, 300 + y_offset)
  love.graphics.print('Press Cmd/Ctrl + R to reload.', 400, 316 + y_offset)
end

function love.update(dt)
  total_time_elapsed = total_time_elapsed + dt
end
