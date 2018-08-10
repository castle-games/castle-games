splash = {
   _timer = 2,
   _index = 3,
   _MAX_INDEX = 16,
}

function splash:draw()
   local width, height = love.window.getMode()
   love.graphics.push('all')
   love.graphics.translate(width * 0.5, height * 0.5)
   love.graphics.scale(1.5)
   local x, y = -width * 0.2, -256
   for index = 1, self._MAX_INDEX do
      if index == self._index then
         love.graphics.setColor(1, 1, 1, 1)
      else
         love.graphics.setColor(1, 1, 1, 0.5)
      end
      love.graphics.print('ghost-player is loading...', x, y)
      y = y + 32
   end
   love.graphics.pop()
end

function splash:update(dt)
   self._timer = self._timer - dt
   if self._timer <= 0 then
      self._timer = 0.2 -- start animating if it's taking too long.
      self._index = self._index + 1
      if self._index > self._MAX_INDEX then
         self._index = 1
      end
   end
end

return splash
