splash = {
   _shineTimer = 2,
   _shineX = 0,
   _shineVelocity = 800,
   _textY = 0,
   _textYTimer = 0,
   _imgMaskRooks = nil,
   _imgMaskText = nil,
   _imgSize = nil,
}

function splash:loadImg()
   if self._imgMaskRooks == nil then
      self._imgMaskRooks = love.graphics.newImage('assets/loading-mask-rooks.png')
      self._imgMaskText = love.graphics.newImage('assets/loading-mask-text.png')
      self._imgSize = { width = 500, height = 250 }
   end
end

function splash:draw()
   self:loadImg()

   local width, height = love.window.getMode()
   love.graphics.push('all')
   love.graphics.translate(width * 0.5, height * 0.5)
   love.graphics.scale(0.5, 0.5)
   love.graphics.translate(-self._imgSize.width * 0.5, -self._imgSize.height * 0.5)
   love.graphics.setColor(1, 1, 1, 0.7)
   love.graphics.rectangle('fill', 0, 0, self._imgSize.width, self._imgSize.height)
   if self._shineX > 18 and self._shineX < self._imgSize.width - 18 then
      love.graphics.push('all')
      love.graphics.setBlendMode('add')
      love.graphics.setColor(1, 1, 1, 0.3)
      love.graphics.rectangle('fill', self._shineX - 18, 0, 36, self._imgSize.height)
      love.graphics.rectangle('fill', self._shineX - 6, 0, 12, self._imgSize.height)
      love.graphics.pop()
   end
   love.graphics.setColor(1, 1, 1, 1)
   love.graphics.draw(
      self._imgMaskText,
      0, 4 + self._textY,
      0,
      1, 1,
      0, 0
   )
   love.graphics.draw(
      self._imgMaskRooks,
      0, 0,
      0,
      1, 1,
      0, 0
   )
   love.graphics.pop()
end

function splash:update(dt)
   self:loadImg()

   self._shineTimer = self._shineTimer - dt
   if self._shineTimer <= 0 then
      self._shineX = 0
      self._shineVelocity = 800
      self._shineTimer = 1.75
   end
   
   if self._shineX < self._imgSize.width then
      self._shineX = self._shineX + self._shineVelocity * dt
      self._shineVelocity = self._shineVelocity - 100 * dt
   end

   self._textYTimer = self._textYTimer + dt
   self._textY = math.sin(self._textYTimer * 4.0) * 4
end

return splash
