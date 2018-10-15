splash = {
   _timer = 1,
   _value = 0,
   _valueGoal = 1,
}

function splash:draw()
   local width, height = love.window.getMode()
   love.graphics.push('all')
   love.graphics.translate(width * 0.5, height * 0.5)
   love.graphics.scale(2.0)
   local x, y = -width * 0.22, -height * 0.22
   love.graphics.setColor(1, 1, 1, self._value)
   love.graphics.print('Loading...', x, y)
   love.graphics.pop()
end

function splash:update(dt)
   self._value = self._value + (self._valueGoal - self._value) * 0.15
   self._timer = self._timer - dt
   if self._timer <= 0 then
      self._valueGoal = 1.0 - self._valueGoal
      if self._valueGoal == 0 then
         self._timer = 0.4
      else
         self._timer = 1
      end
   end
end

return splash
