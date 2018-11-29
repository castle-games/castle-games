local ig = require 'imgui'

local float = 0
local str = 'hello'

return function()
    ig.pushStyleColor('TitleBgActive', 1, 0, 0, 1)

    ig.setNextWindowSizeConstraints({
        sizeMinX = 100,
        sizeMinY = 100,
        sizeMaxX = 400,
        sizeMaxY = 400,
    })

    ig.beginWindow('Hello World!')

    local editedStr, edited = ig.inputText('Edit me', str, {
        flags = { EnterReturnsTrue = true },
    })
    if edited then
        str = editedStr
    end
    ig.text(str)

    for i = 1, 100 do
        ig.text('Hello, world! :O')

        float = ig.inputInt('Float!##' .. i, {
            v = float,
            step = 2,
            extraFlags = { AutoSelectAll = true }
        })
    end

    ig.endWindow()

    ig.popStyleColor(1)
end

