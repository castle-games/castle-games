-- A user interface library based on ImGui with our own additions

local ui = {}


local bit = require 'bit'
local ffi = require 'ffi'
local C = ffi.C


-- Inherit ImGui's stuff

local imgui = require 'imgui'
setmetatable(ui, { __index = imgui })


-- Style

ui.style = {}

function ui.style.base()
    local uiStyle = ui.getStyle()
    uiStyle.FrameRounding = 7
    uiStyle.GrabRounding = 7
    uiStyle.WindowBorderSize = 1
    uiStyle.PopupBorderSize = 1
    local whichOS = love.system.getOS()
    if whichOS == 'iOS' or whichOS == 'Android' then
        uiStyle.TouchExtraPadding = { 4, 4 }
    end
end

function ui.style.dark()
    ui.style.base()
    ui.styleColorsDark(nil)
    love.graphics.setBackgroundColor(0, 0, 0)
end

function ui.style.light()
    ui.style.base()
    ui.styleColorsLight(nil)
    ui.getStyle().FrameBorderSize = 1 -- Light style looks better with frame borders
    love.graphics.setBackgroundColor(1, 1, 1)
end

function ui.style.black()
    local style = ui.getStyle()
    style.WindowPadding = { 15, 15 }
    style.WindowRounding = 5
    style.FramePadding = { 5, 5 }
    style.FrameRounding = 4
    style.ItemSpacing = { 12, 8 }
    style.ItemInnerSpacing = { 8, 6 }
    style.IndentSpacing = 25
    style.ScrollbarSize = 15
    style.ScrollbarRounding = 9
    style.GrabMinSize = 5
    style.GrabRounding = 3

    style.Colors[C.ImGuiCol_Text] = { 0.80, 0.80, 0.83, 1.00 }
    style.Colors[C.ImGuiCol_TextDisabled] = { 0.24, 0.23, 0.29, 1.00 }
    style.Colors[C.ImGuiCol_WindowBg] = { 0.06, 0.05, 0.07, 1.00 }
    style.Colors[C.ImGuiCol_ChildBg] = { 0.07, 0.07, 0.09, 1.00 }
    style.Colors[C.ImGuiCol_PopupBg] = { 0.07, 0.07, 0.09, 1.00 }
    style.Colors[C.ImGuiCol_Border] = { 0.80, 0.80, 0.83, 0.88 }
    style.Colors[C.ImGuiCol_BorderShadow] = { 0.92, 0.91, 0.88, 0.00 }
    style.Colors[C.ImGuiCol_FrameBg] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_FrameBgHovered] = { 0.24, 0.23, 0.29, 1.00 }
    style.Colors[C.ImGuiCol_FrameBgActive] = { 0.56, 0.56, 0.58, 1.00 }
    style.Colors[C.ImGuiCol_TitleBg] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_TitleBgCollapsed] = { 1.00, 0.98, 0.95, 0.75 }
    style.Colors[C.ImGuiCol_TitleBgActive] = { 0.07, 0.07, 0.09, 1.00 }
    style.Colors[C.ImGuiCol_MenuBarBg] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_ScrollbarBg] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_ScrollbarGrab] = { 0.80, 0.80, 0.83, 0.31 }
    style.Colors[C.ImGuiCol_ScrollbarGrabHovered] = { 0.56, 0.56, 0.58, 1.00 }
    style.Colors[C.ImGuiCol_ScrollbarGrabActive] = { 0.06, 0.05, 0.07, 1.00 }
    style.Colors[C.ImGuiCol_CheckMark] = { 0.80, 0.80, 0.83, 0.31 }
    style.Colors[C.ImGuiCol_SliderGrab] = { 0.80, 0.80, 0.83, 0.31 }
    style.Colors[C.ImGuiCol_SliderGrabActive] = { 0.06, 0.05, 0.07, 1.00 }
    style.Colors[C.ImGuiCol_Button] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_ButtonHovered] = { 0.24, 0.23, 0.29, 1.00 }
    style.Colors[C.ImGuiCol_ButtonActive] = { 0.56, 0.56, 0.58, 1.00 }
    style.Colors[C.ImGuiCol_Header] = { 0.10, 0.09, 0.12, 1.00 }
    style.Colors[C.ImGuiCol_HeaderHovered] = { 0.56, 0.56, 0.58, 1.00 }
    style.Colors[C.ImGuiCol_HeaderActive] = { 0.06, 0.05, 0.07, 1.00 }
    style.Colors[C.ImGuiCol_ResizeGrip] = { 0.00, 0.00, 0.00, 0.00 }
    style.Colors[C.ImGuiCol_ResizeGripHovered] = { 0.56, 0.56, 0.58, 1.00 }
    style.Colors[C.ImGuiCol_ResizeGripActive] = { 0.06, 0.05, 0.07, 1.00 }
    style.Colors[C.ImGuiCol_CloseButton] = { 0.40, 0.39, 0.38, 0.16 }
    style.Colors[C.ImGuiCol_CloseButtonHovered] = { 0.40, 0.39, 0.38, 0.39 }
    style.Colors[C.ImGuiCol_CloseButtonActive] = { 0.40, 0.39, 0.38, 1.00 }
    style.Colors[C.ImGuiCol_PlotLines] = { 0.40, 0.39, 0.38, 0.63 }
    style.Colors[C.ImGuiCol_PlotLinesHovered] = { 0.25, 1.00, 0.00, 1.00 }
    style.Colors[C.ImGuiCol_PlotHistogram] = { 0.40, 0.39, 0.38, 0.63 }
    style.Colors[C.ImGuiCol_PlotHistogramHovered] = { 0.25, 1.00, 0.00, 1.00 }
    style.Colors[C.ImGuiCol_TextSelectedBg] = { 0.25, 1.00, 0.00, 0.43 }
    style.Colors[C.ImGuiCol_ModalWindowDarkening] = { 1.00, 0.98, 0.95, 0.73 }

    -- Deprecated
    --style.Colors[C.ImGuiCol_ComboBg] = { 0.19, 0.18, 0.21, 1.00 }
    --style.Colors[C.ImGuiCol_Column] = { 0.56, 0.56, 0.58, 1.00 }
    --style.Colors[C.ImGuiCol_ColumnHovered] = { 0.24, 0.23, 0.29, 1.00 }
    --style.Colors[C.ImGuiCol_ColumnActive] = { 0.56, 0.56, 0.58, 1.00 }
end

ui.style.dark()


-- Fonts -- load a regular font and an icon font
-- TODO: Use a nicer common font-loading utility for this...

local dpiScale = love.window.getDPIScale()
local fontScale = 1
while fontScale < dpiScale do fontScale = fontScale * 2 end

do
    local ttfPath = 'assets/fonts/Inconsolata-Regular.ttf'
    local ttfBytes = love.filesystem.getInfo(ttfPath).size
    local ttfStr = love.filesystem.read(ttfPath, ttfBytes)
    local ttfPtr = ffi.new('char[?]', ttfBytes, ttfStr)
    local fontConfig = ffi.new('struct ImFontConfig')
    C.ImFontConfig_DefaultConstructor(fontConfig)
    fontConfig.FontDataOwnedByAtlas = false
    fontConfig.OversampleH = fontScale
    fontConfig.OversampleV = fontScale
    fontConfig.GlyphOffset.y = -0.5
    C.ImFontAtlas_AddFontFromMemoryTTF(ui.getIO().Fonts, ttfPtr, ttfBytes, 14, fontConfig, nil)
end

do
    local ttfPath = 'assets/fonts/fontawesome-webfont.ttf'
    local ttfBytes = love.filesystem.getInfo(ttfPath).size
    local ttfStr = love.filesystem.read(ttfPath, ttfBytes)
    local ttfPtr = ffi.new('char[?]', ttfBytes, ttfStr)
    local fontConfig = ffi.new('struct ImFontConfig')
    C.ImFontConfig_DefaultConstructor(fontConfig)
    fontConfig.OversampleH = fontScale
    fontConfig.OversampleV = fontScale
    fontConfig.FontDataOwnedByAtlas = false
    fontConfig.MergeMode = true
    fontConfig.PixelSnapH = true
    fontConfig.GlyphOffset.x = -0.5
    _G.__fontAwesomeRanges = ffi.new(-- Passed by non-owning reference, keep alive
        'ImWchar[3]', { 0xf000, 0xf2e0, 0 })
    C.ImFontAtlas_AddFontFromMemoryTTF(ui.getIO().Fonts, ttfPtr, ttfBytes, 13,
        fontConfig, _G.__fontAwesomeRanges)
    ui.icons = require 'tui.font_awesome' -- Expose codepoints for easy access
end


-- Based on https://github.com/ocornut/imgui/issues/319#issuecomment-345795629
ffi.cdef [[
bool uiSplitter(const char *sub_id, bool splitVertically, float thickness,
    float *size1, float *size2, float minSize1, float minSize2,
    float splitterLongAxisSize);
]]
function ui.splitter(id, opts)
    opts = opts or {}

    local size1 = ffi.new('float[1]', opts.size1 or 300)
    local size2 = ffi.new('float[1]', opts.size2 or 300)

    local splitVertically
    if opts.splitVertically ~= nil then
        splitVertically = opts.splitVertically
    else
        splitVertically = false
    end

    local r = C.uiSplitter(id, splitVertically, opts.thickness or 1.2,
        size1, size2,
        opts.minSize1 or 2 * ui.getTextLineHeight(),
        opts.minSize2 or 2 * ui.getTextLineHeight(),
        opts.splitterLongAxisSize or -1)
    return size1[0], size2[0], r
end


-- Create a child window with resizable height. Use like `.beginChild(...)` and `.endChild()`.
-- `.beginChildResizable(label, opts)` takes an `opts` table with additional `defaultHeight`
-- (height to start at) and `minHeight` (don't allow resizing below this height) parameters
-- along with the usual `extraFlags` parameter.

function ui.beginChildResizable(label, opts)
    local id = label .. '##splitter'
    local cache = ui.cache(id)

    opts = opts or {}
    local height = cache.height or opts.defaultHeight or 8 * ui.getTextLineHeight()
    height = ui.splitter(id, {
        size1 = height,
        minSize1 = opts.minHeight or 2 * ui.getTextLineHeight()
    })
    cache.height = height
    return ui.beginChild(label, -1, height - ui.getStyle().ItemSpacing.y - 1, opts)
end

function ui.endChildResizable()
    ui.endChild()
    ui.spacing()
    ui.spacing()
end


-- `ui.{in,with}Foo(..., function() ... end)` wrappers

local function firstNArgs(n, a, ...)
    if n == 0 then return end
    return a, firstNArgs(n - 1, ...)
end

local function lastArg(...)
    local nArgs = select('#', ...)
    return select(nArgs, ...)
end

local function allButLastArg(...)
    local nArgs = select('#', ...)
    return firstNArgs(nArgs - 1, ...)
end

function ui.inWindow(...)
    local open = ui.beginWindow(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...), open)
    ui.endWindow()
    if not succeeded then error(err, 0) end
end

function ui.inChild(...)
    local open = ui.beginChild(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...), open)
    ui.endChild()
    if not succeeded then error(err, 0) end
end

function ui.inChildResizable(...)
    local open = ui.beginChildResizable(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...), open)
    ui.endChildResizable()
    if not succeeded then error(err, 0) end
end

function ui.inPopup(...)
    if ui.beginPopup(allButLastArg(...)) then
        local succeeded, err = pcall(lastArg(...))
        ui.endPopup()
        if not succeeded then error(err, 0) end
    end
end

function ui.withStyleColor(...)
    ui.pushStyleColor(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...))
    ui.popStyleColor(1)
    if not succeeded then error(err, 0) end
end

function ui.withItemWidth(...)
    ui.pushItemWidth(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...))
    ui.popItemWidth()
    if not succeeded then error(err, 0) end
end

function ui.withID(...)
    ui.pushIDStr(allButLastArg(...))
    local succeeded, err = pcall(lastArg(...))
    ui.popID()
    if not succeeded then error(err, 0) end
end

function ui.inDragDropSource(...)
    if ui.beginDragDropSource(allButLastArg(...)) then
        local succeeded, err = pcall(lastArg(...))
        ui.endDragDropSource()
        if not succeeded then error(err, 0) end
    end
end

function ui.inDragDropTarget(...)
    if ui.beginDragDropTarget(allButLastArg(...)) then
        local succeeded, err = pcall(lastArg(...))
        ui.endDragDropTarget()
        if not succeeded then error(err, 0) end
    end
end


-- Expose `Want*` from `ImGuiIO` in a nicer way

function ui.wantMouse() return ui.getIO().WantCaptureMouse end

function ui.wantKeyboard() return ui.getIO().WantCaptureKeyboard end

function ui.wantTextInput() return ui.getIO().WantTextInput end


-- `ui.selectable(...)` but without spanning the whole width
function ui.smallSelectable(label, selected, flags)
    local sizeX, sizeY = ui.calcTextSize(label)
    return ui.selectable(label, selected, flags, { sizeX = sizeX, sizeY = sizeY })
end


-- Width of a single character
local charWidth
function ui.charWidth()
    if charWidth then return charWidth end
    charWidth = (ui.calcTextSize(('.'):rep(20)) - ui.calcTextSize(('.'):rep(10))) / 10
    return charWidth
end

-- Height of a single character
local charHeight
function ui.charHeight()
    if charHeight then return charHeight end
    local _, h = ui.calcTextSize('A')
    charHeight = h
    return charHeight
end


-- ID-scoped ephemeral store. Unique for the enclosing stack of UI IDs. Use only for ephemeral
-- UI state (text entered in edit boxes but not confirmed, size of resizable children, etc.).
-- `prefix` is optional and can be used for further differentiation of caches. Returned table is
-- empty by default.
--
-- This is especially useful for free-standing UI functions that don't have a clear place to store
-- state and could be used anywhere.
local caches = {}
function ui.cache(prefix)
    local id = ui.getIDStr(prefix or '__')
    local cache = caches[id]
    if cache then return cache end
    cache = {}
    caches[id] = cache
    return cache
end


-- Code editor!

local codeBaseColors = {
    black = 0xFF000000,
    white = 0xFFFFFFFF,
    almostWhite = 0xFFEEEEEE,
    almostBlack = 0xFF111111,
    middleDarkGrey = 0xFF777777,
    middleLightGrey = 0xFF999999,
    lightGrey = 0xFFBBBBBB,
    darkGrey = 0xFF444444,
    darkPink = 0xFF63001C,
    middleDarkPink = 0xFFFF0055,
    middleLightPink = 0xFFD65E76,
    lightPink = 0xFFFFAFAF,
    darkBlue = 0xFF005F87,
    middleDarkBlue = 0xFF538192,
    middleLightBlue = 0xFF9FD3E6,
    lightBlue = 0xFFCBE4EE,
    darkGreen = 0xFF5F5F00,
    middleDarkGreen = 0xFF739200,
    middleLightGreen = 0xFFB1D631,
    lightGreen = 0xFFBBFFAA,
    darkTan = 0xFF503D15,
    lightTan = 0xFFECE1C8,
}

local codeDarkColors = {
    bg = codeBaseColors.black,
    norm = codeBaseColors.almostWhite,
    comment = codeBaseColors.middleDarkGrey,
    dimmed = codeBaseColors.middleLightGrey,
    subtle = codeBaseColors.darkGrey,
    faint = codeBaseColors.almostBlack,
    accent1 = codeBaseColors.middleLightBlue,
    accent2 = codeBaseColors.middleLightGreen,
    accent3 = codeBaseColors.lightGreen,
    accent4 = codeBaseColors.lightTan,
    normRed = codeBaseColors.middleLightPink,
    normGreen = codeBaseColors.middleLightGreen,
    normBlue = codeBaseColors.middleLightBlue,
    faintRed = codeBaseColors.darkPink,
    faintGreen = codeBaseColors.darkGreen,
    faintBlue = codeBaseColors.darkBlue,
}

local codeLightColors = {
    bg = codeBaseColors.white,
    norm = codeBaseColors.almostBlack,
    comment = codeBaseColors.middleLightGrey,
    dimmed = codeBaseColors.middleDarkGrey,
    subtle = codeBaseColors.lightGrey,
    faint = codeBaseColors.almostWhite,
    accent1 = codeBaseColors.middleDarkBlue,
    accent2 = codeBaseColors.middleDarkGreen,
    accent3 = codeBaseColors.middleDarkPink,
    accent4 = codeBaseColors.darkTan,
    normRed = codeBaseColors.middleDarkPink,
    normGreen = codeBaseColors.middleDarkGreen,
    normBlue = codeBaseColors.middleDarkBlue,
    faintRed = codeBaseColors.lightPink,
    faintGreen = codeBaseColors.lightGreen,
    faintBlue = codeBaseColors.lightBlue,
}

local codeColors = codeDarkColors

local codeStyle = setmetatable({
    nothing = 0xff0000ff,
    whitespace = 0xff0000ff,
    comment = codeColors.comment,
    string = codeColors.normRed,
    longstring = codeColors.normRed,
    number = codeColors.accent1,
    keyword = codeColors.accent2,
    identifier = codeColors.norm,
    operator = codeColors.dimmed,
    error = codeColors.faintRed,
    preprocessor = codeColors.accent2,
    constant = codeColors.accent2,
    variable = codeColors.accent3,
    ['function'] = codeColors.accent4,
    class = codeColors.normGreen,
    type = codeColors.normGreen,
    default = codeColors.norm,
    library = codeColors.normBlue,
}, {
    __index = function(t, k)
        -- Warn, then use a random color with full alpha
        if not k:match('_whitespace$') then
            print("warning: no explicit styling for lexer token type '" .. k .. "'")
        end
        local col = bit.bor(math.floor(math.random(0xffffffff)), 0x606060ff)
        t[k] = col
        return col
    end
})

function ui.inputCode(code)
    --    local sizeX, sizeY = ui.getContentRegionAvailWidth(), 80
    --    local frameBg = ui.getStyle().Colors[C.ImGuiCol_FrameBg]
    --    ui.withStyleColor('ChildBg', frameBg.x, frameBg.y, frameBg.z, frameBg.w, function()
--    ui.inChildResizable('code', { flags = { HorizontalScrollbar = true } }, function()
        local baseX, baseY = ui.getCursorScreenPos() -- Top-left ('base') position of editor
        local drawList = C.igGetWindowDrawList()
        local charAdvanceX, charAdvanceY = ui.charWidth(), ui.charHeight()
        local contentSizeX, contentSizeY = 0, 0 -- Full size of scrollable content

        -- Clip everything we draw by our bounding box
        local clipX, clipY = baseX + ui.getScrollX(), baseY + ui.getScrollY()
        local clipSizeX, clipSizeY = ui.getContentRegionAvail()
        C.ImDrawList_PushClipRect(drawList,
            { clipX, clipY }, { clipX + clipSizeX, clipY + clipSizeY }, false)
        local success, err = pcall(function()
            -- Lex the code and initialize the lexer walk
            local lexed = lexers.lua:lex(code)
            local lexI = 1

            -- For now render character-by-character
            local charPos = { x = baseX, y = baseY }
            for i = 1, #code do
                local char = code:sub(i, i)

                -- Advance to the next section in the lexer output
                while i >= lexed[lexI + 1] do
                    lexI = lexI + 2
                end
                local lexType = lexed[lexI]

                -- Draw the character
                C.ImDrawList_AddText(drawList, charPos, codeStyle[lexType], char, nil)
                contentSizeX = math.max(contentSizeX, charPos.x + charAdvanceX)

                -- Update next character position
                if char == '\t' then
                    charPos.x = charPos.x + 4 * charAdvanceX
                elseif char == '\n' then
                    charPos.x = baseX
                    charPos.y = charPos.y + charAdvanceY
                    contentSizeY = charPos.y
                else
                    charPos.x = charPos.x + charAdvanceX
                end
            end
        end)
        C.ImDrawList_PopClipRect(drawList)
        if not success then error(err, 0) end

        -- Make a dummy widget to take up layout space
        ui.dummy({
            contentSizeX - baseX,
            contentSizeY + 2 * charAdvanceY - baseY,
        })
--    end)
end


return ui
