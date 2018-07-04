## Main

#### `getIO()`
Returns `struct ImGuiIO *`

#### `getStyle()`
Returns `struct ImGuiStyle *`

#### `getDrawData()`
Returns `struct ImDrawData *`

#### `newFrame()`
Returns nothing

#### `render()`
Returns nothing

#### `endFrame()`
Returns nothing

#### `shutdown()`
Returns nothing


## Demo / debug/ info

#### `showDemoWindow(opened)`
Returns `opened`

#### `showMetricsWindow(opened)`
Returns `opened`

#### `showStyleEditor([ref])`
Returns `ref`

#### `showStyleSelector(label)`
Returns nothing

#### `showFontSelector(label)`
Returns nothing

#### `showUserGuide()`
Returns nothing


## Window

#### `begin(name, [open], [flags = 0])`
Returns `open, bool`

#### `end()`
Returns nothing

#### `beginChild([strId], [sizeX, sizeY = 0, 0], [border = true], [extraFlags = 0])`
Returns `bool`

#### `beginChildEx([id], [sizeX, sizeY = 0, 0], [border = true], [extraFlags = 0])`
Returns `bool`

#### `endChild()`
Returns nothing

#### `getContentRegionMax()`
Returns `x, y`

#### `getContentRegionAvail()`
Returns `x, y`

#### `getContentRegionAvailWidth()`
Returns `float`

#### `getWindowContentRegionMin()`
Returns `x, y`

#### `getWindowContentRegionMax()`
Returns `x, y`

#### `getWindowContentRegionWidth()`
Returns `float`

#### `getWindowDrawList()`
Returns `struct ImDrawList *`

#### `getWindowPos()`
Returns `x, y`

#### `getWindowSize()`
Returns `x, y`

#### `getWindowWidth()`
Returns `float`

#### `getWindowHeight()`
Returns `float`

#### `isWindowCollapsed()`
Returns `bool`

#### `isWindowAppearing()`
Returns `bool`

#### `setWindowFontScale(scale)`
Returns nothing

#### `setNextWindowPos(posX, posY, [cond = 0], [pivotX, pivotY = 0, 0])`
Returns nothing

#### `setNextWindowSize([sizeX, sizeY = 0, 0], [cond = 0])`
Returns nothing

#### `setNextWindowSizeConstraints(sizeMinX, sizeMinY, sizeMaxX, sizeMaxY, [customCallback], [customCallbackData])`
Returns `customCallbackData`

#### `setNextWindowContentSize([sizeX, sizeY = 0, 0])`
Returns nothing

#### `setNextWindowCollapsed(collapsed, [cond = 0])`
Returns nothing

#### `setNextWindowFocus()`
Returns nothing

#### `setWindowPos(posX, posY, [cond = 0])`
Returns nothing

#### `setWindowSize([sizeX, sizeY = 0, 0], [cond = 0])`
Returns nothing

#### `setWindowCollapsed(collapsed, [cond = 0])`
Returns nothing

#### `setWindowFocus()`
Returns nothing

#### `setWindowPosByName(name, posX, posY, [cond = 0])`
Returns nothing

#### `setWindowSize2(name, [sizeX, sizeY = 0, 0], [cond = 0])`
Returns nothing

#### `setWindowCollapsed2(name, collapsed, [cond = 0])`
Returns nothing

#### `setWindowFocus2(name)`
Returns nothing

#### `getScrollX()`
Returns `float`

#### `getScrollY()`
Returns `float`

#### `getScrollMaxX()`
Returns `float`

#### `getScrollMaxY()`
Returns `float`

#### `setScrollX(scrollX)`
Returns nothing

#### `setScrollY(scrollY)`
Returns nothing

#### `setScrollHere([centerYRatio = 0.5])`
Returns nothing

#### `setScrollFromPosY(posY, [centerYRatio = 0.5])`
Returns nothing

#### `setStateStorage(tree)`
Returns `tree`

#### `getStateStorage()`
Returns `struct ImGuiStorage *`


## Parameter stacks (shared)

#### `pushFont(font)`
Returns `font`

#### `popFont()`
Returns nothing

#### `pushStyleColorU32(idx, col)`
Returns nothing

#### `pushStyleColor(idx, colX, colY, colZ, colW)`
Returns nothing

#### `popStyleColor([count = 1])`
Returns nothing

#### `pushStyleVar(idx, val)`
Returns nothing

#### `pushStyleVarVec(idx, valX, valY)`
Returns nothing

#### `popStyleVar([count = 1])`
Returns nothing

#### `getStyleColorVec4(idx)`
Returns `x, y, z, w`

#### `getFont()`
Returns `struct ImFont *`

#### `getFontSize()`
Returns `float`

#### `getFontTexUvWhitePixel()`
Returns `x, y`

#### `getColorU32(idx, [alphaMul = 1])`
Returns `ImU32`

#### `getColorU32Vec(colX, colY, colZ, colW)`
Returns `colX, colY, colZ, colW, ImU32`

#### `getColorU32U32(col)`
Returns `ImU32`


## Parameter stacks (current window)

#### `pushItemWidth(itemWidth)`
Returns nothing

#### `popItemWidth()`
Returns nothing

#### `calcItemWidth()`
Returns `float`

#### `pushTextWrapPos([wrapPosX = 0])`
Returns nothing

#### `popTextWrapPos()`
Returns nothing

#### `pushAllowKeyboardFocus(v)`
Returns nothing

#### `popAllowKeyboardFocus()`
Returns nothing

#### `pushButtonRepeat(setRepeat)`
Returns nothing

#### `popButtonRepeat()`
Returns nothing


## Cursor / layout

#### `separator()`
Returns nothing

#### `sameLine([posX = 0], [spacingW = -1])`
Returns nothing

#### `newLine()`
Returns nothing

#### `spacing()`
Returns nothing

#### `dummy([sizeX, sizeY = 0, 0])`
Returns `sizeX, sizeY`

#### `indent([indentW = 0])`
Returns nothing

#### `unindent([indentW = 0])`
Returns nothing

#### `beginGroup()`
Returns nothing

#### `endGroup()`
Returns nothing

#### `getCursorPos()`
Returns `x, y`

#### `getCursorPosX()`
Returns `float`

#### `getCursorPosY()`
Returns `float`

#### `setCursorPos(localPosX, localPosY)`
Returns nothing

#### `setCursorPosX(x)`
Returns nothing

#### `setCursorPosY(y)`
Returns nothing

#### `getCursorStartPos()`
Returns `x, y`

#### `getCursorScreenPos()`
Returns `x, y`

#### `setCursorScreenPos(posX, posY)`
Returns nothing

#### `alignTextToFramePadding()`
Returns nothing

#### `getTextLineHeight()`
Returns `float`

#### `getTextLineHeightWithSpacing()`
Returns `float`

#### `getFrameHeight()`
Returns `float`

#### `getFrameHeightWithSpacing()`
Returns `float`


## Columns

#### `columns([count = 1], [id], [border = true])`
Returns nothing

#### `nextColumn()`
Returns nothing

#### `getColumnIndex()`
Returns `int`

#### `getColumnWidth([columnIndex = -1])`
Returns `float`

#### `setColumnWidth([columnIndex = -1], width)`
Returns nothing

#### `getColumnOffset([columnIndex = -1])`
Returns `float`

#### `setColumnOffset([columnIndex = -1], offsetX)`
Returns nothing

#### `getColumnsCount()`
Returns `int`


## ID scopes

#### `pushIDStr([strId])`
Returns nothing

#### `pushIDStrRange(strBegin, strEnd)`
Returns nothing

#### `pushIDPtr([ptrId])`
Returns `ptrId`

#### `pushIDInt(intId)`
Returns nothing

#### `popID()`
Returns nothing

#### `getIDStr([strId])`
Returns `ImGuiID`

#### `getIDStrRange(strBegin, strEnd)`
Returns `ImGuiID`

#### `getIDPtr([ptrId])`
Returns `ptrId, ImGuiID`


## Widgets: text

#### `textUnformatted(text, [textEnd])`
Returns nothing

#### `text(fmt)`
Returns nothing

#### `textV(fmt, args)`
Returns nothing

#### `textColored(colX, colY, colZ, colW, fmt)`
Returns nothing

#### `textColoredV(colX, colY, colZ, colW, fmt, args)`
Returns nothing

#### `textDisabled(fmt)`
Returns nothing

#### `textDisabledV(fmt, args)`
Returns nothing

#### `textWrapped(fmt)`
Returns nothing

#### `textWrappedV(fmt, args)`
Returns nothing

#### `labelText(label, fmt)`
Returns nothing

#### `labelTextV(label, fmt, args)`
Returns nothing

#### `bulletText(fmt)`
Returns nothing

#### `bulletTextV(fmt, args)`
Returns nothing

#### `bullet()`
Returns nothing


## Widgets: main

#### `button(label, [sizeX, sizeY = 0, 0])`
Returns `bool`

#### `smallButton(label)`
Returns `bool`

#### `invisibleButton([strId], [sizeX, sizeY = 0, 0])`
Returns `bool`

#### `image(userTextureId, [sizeX, sizeY = 0, 0], [uv0X, uv0Y = 0, 0], [uv1X, uv1Y = 1, 1], [tintColX, tintColY, tintColZ, tintColW = 1, 1, 1, 1], [borderColX, borderColY, borderColZ, borderColW = 0, 0, 0, 0])`
Returns nothing

#### `imageButton(userTextureId, [sizeX, sizeY = 0, 0], [uv0X, uv0Y = 0, 0], [uv1X, uv1Y = 1, 1], [framePadding = -1], [bgColX, bgColY, bgColZ, bgColW = 0, 0, 0, 0], [tintColX, tintColY, tintColZ, tintColW = 1, 1, 1, 1])`
Returns `bool`

#### `checkbox(label, v)`
Returns `v, bool`

#### `checkboxFlags(label, [flags = 0], flagsValue)`
Returns `flags, bool`

#### `radioButtonBool(label, active)`
Returns `bool`

#### `radioButton(label, v, vButton)`
Returns `v, bool`

#### `plotLines(label, values, valuesCount, [valuesOffset = 0], [overlayText], [scaleMin = math.huge], [scaleMax = math.huge], [graphSizeX, graphSizeY = 0, 0], stride)`
Returns `values`

#### `plotHistogram(label, values, valuesCount, [valuesOffset = 0], [overlayText], [scaleMin = math.huge], [scaleMax = math.huge], [graphSizeX, graphSizeY = 0, 0], stride)`
Returns `values`

#### `progressBar(fraction, [sizeArgX, sizeArgY = -1, 0], [overlay])`
Returns `sizeArgX, sizeArgY`

#### `beginCombo(label, previewValue, [flags = 0])`
Returns `bool`

#### `endCombo()`
Returns nothing

#### `combo(label, currentItem, items, itemsCount, [popupMaxHeightInItems = -1])`
Returns `currentItem, items, bool`

#### `combo2(label, currentItem, itemsSeparatedByZeros, [popupMaxHeightInItems = -1])`
Returns `currentItem, bool`


## Widgets: drags

#### `dragFloat(label, v, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v, bool`

#### `dragFloat2(label, v1, v2, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, bool`

#### `dragFloat3(label, v1, v2, v3, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, v3, bool`

#### `dragFloat4(label, v1, v2, v3, v4, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, v3, v4, bool`

#### `dragFloatRange2(label, vCurrentMin, vCurrentMax, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [displayFormatMax], [power = 1])`
Returns `vCurrentMin, vCurrentMax, bool`

#### `dragInt(label, v, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v, bool`

#### `dragInt2(label, v1, v2, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, bool`

#### `dragInt3(label, v1, v2, v3, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, v3, bool`

#### `dragInt4(label, v1, v2, v3, v4, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, v3, v4, bool`

#### `dragIntRange2(label, vCurrentMin, vCurrentMax, [vSpeed = 1], [vMin = 0], [vMax = 0], [displayFormat], [displayFormatMax])`
Returns `vCurrentMin, vCurrentMax, bool`


## Widgets: input with keyboard

#### `inputText(label, contents, [flags = 0], [callback = nil], [userData = nil])`
Returns `contents, bool`

#### `inputTextMultiline(label, contents, [sizeX, sizeY = 0, 0], [flags = 0], [callback = nil], [userData = nil]))`
Returns `contents, bool`

#### `inputFloat(label, v, [step = 0], [stepFast = 0], [decimalPrecision = -1], [extraFlags = 0])`
Returns `v, bool`

#### `inputFloat2(label, v1, v2, [decimalPrecision = -1], [extraFlags = 0])`
Returns `v1, v2, bool`

#### `inputFloat3(label, v1, v2, v3, [decimalPrecision = -1], [extraFlags = 0])`
Returns `v1, v2, v3, bool`

#### `inputFloat4(label, v1, v2, v3, v4, [decimalPrecision = -1], [extraFlags = 0])`
Returns `v1, v2, v3, v4, bool`

#### `inputInt(label, v, [step = 0], [stepFast = 0], [extraFlags = 0])`
Returns `v, bool`

#### `inputInt2(label, v1, v2, [extraFlags = 0])`
Returns `v1, v2, bool`

#### `inputInt3(label, v1, v2, v3, [extraFlags = 0])`
Returns `v1, v2, v3, bool`

#### `inputInt4(label, v1, v2, v3, v4, [extraFlags = 0])`
Returns `v1, v2, v3, v4, bool`


## Widgets: sliders

#### `sliderFloat(label, v, [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v, bool`

#### `sliderFloat2(label, v1, v2, [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, bool`

#### `sliderFloat3(label, v1, v2, v3, [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, v3, bool`

#### `sliderFloat4(label, v1, v2, v3, v4, [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v1, v2, v3, v4, bool`

#### `sliderAngle(label, vRad, [vDegreesMin = -360], [vDegreesMax = 360])`
Returns `vRad, bool`

#### `sliderInt(label, v, [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v, bool`

#### `sliderInt2(label, v1, v2, [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, bool`

#### `sliderInt3(label, v1, v2, v3, [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, v3, bool`

#### `sliderInt4(label, v1, v2, v3, v4, [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v1, v2, v3, v4, bool`

#### `vSliderFloat(label, [sizeX, sizeY = 0, 0], v, [vMin = 0], [vMax = 0], [displayFormat], [power = 1])`
Returns `v, bool`

#### `vSliderInt(label, [sizeX, sizeY = 0, 0], v, [vMin = 0], [vMax = 0], [displayFormat])`
Returns `v, bool`


## Widgets: color editor / picker

#### `colorEdit3(label, col1, col2, col3, [flags = 0])`
Returns `col1, col2, col3, bool`

#### `colorEdit4(label, col1, col2, col3, col4, [flags = 0])`
Returns `col1, col2, col3, col4, bool`

#### `colorPicker3(label, col1, col2, col3, [flags = 0])`
Returns `col1, col2, col3, bool`

#### `colorPicker4(label, col1, col2, col3, col4, [flags = 0], [refCol])`
Returns `col1, col2, col3, col4, refCol, bool`

#### `colorButton(descId, colX, colY, colZ, colW, [flags = 0], [sizeX, sizeY = 0, 0])`
Returns `bool`

#### `setColorEditOptions([flags = 0])`
Returns nothing


## Widgets: trees

#### `treeNode(label)`
Returns `bool`

#### `treeNodeStr([strId], fmt)`
Returns `bool`

#### `treeNodePtr([ptrId], fmt)`
Returns `ptrId, bool`

#### `treeNodeStrV([strId], fmt, args)`
Returns `bool`

#### `treeNodePtrV([ptrId], fmt, args)`
Returns `ptrId, bool`

#### `treeNodeEx(label, [flags = 0])`
Returns `bool`

#### `treeNodeExStr([strId], [flags = 0], fmt)`
Returns `bool`

#### `treeNodeExPtr([ptrId], [flags = 0], fmt)`
Returns `ptrId, bool`

#### `treeNodeExV([strId], [flags = 0], fmt, args)`
Returns `bool`

#### `treeNodeExVPtr([ptrId], [flags = 0], fmt, args)`
Returns `ptrId, bool`

#### `treePushStr([strId])`
Returns nothing

#### `treePushPtr([ptrId])`
Returns `ptrId`

#### `treePop()`
Returns nothing

#### `treeAdvanceToLabelPos()`
Returns nothing

#### `getTreeNodeToLabelSpacing()`
Returns `float`

#### `setNextTreeNodeOpen(opened, [cond = 0])`
Returns nothing

#### `collapsingHeader(label, [flags = 0])`
Returns `bool`

#### `collapsingHeaderEx(label, [open], [flags = 0])`
Returns `open, bool`


## Widgets: selectable / lists

#### `selectable(label, [selected = false], [flags = 0], [sizeX, sizeY = 0, 0])`
Returns `bool`

#### `selectableEx(label, selected, [flags = 0], [sizeX, sizeY = 0, 0])`
Returns `selected, bool`

#### `listBox(label, currentItem, items, itemsCount, [heightInItems = -1])`
Returns `currentItem, items, bool`

#### `listBoxHeader(label, [sizeX, sizeY = 0, 0])`
Returns `bool`

#### `listBoxHeader2(label, itemsCount, [heightInItems = -1])`
Returns `bool`

#### `listBoxFooter()`
Returns nothing


## Widgets: value helpers

#### `valueBool(prefix, b)`
Returns nothing

#### `valueInt(prefix, v)`
Returns nothing

#### `valueUInt(prefix, v)`
Returns nothing

#### `valueFloat(prefix, v, [floatFormat])`
Returns nothing


## Tooltip

#### `setTooltip(fmt)`
Returns nothing

#### `setTooltipV(fmt, args)`
Returns nothing

#### `beginTooltip()`
Returns nothing

#### `endTooltip()`
Returns nothing


## Widgets: menus

#### `beginMainMenuBar()`
Returns `bool`

#### `endMainMenuBar()`
Returns nothing

#### `beginMenuBar()`
Returns `bool`

#### `endMenuBar()`
Returns nothing

#### `beginMenu(label, [enabled = true])`
Returns `bool`

#### `endMenu()`
Returns nothing

#### `menuItem(label, [shortcut], [selected = false], [enabled = true])`
Returns `bool`

#### `menuItemPtr(label, [shortcut], selected, [enabled = true])`
Returns `selected, bool`


## Popup

#### `openPopup([strId])`
Returns nothing

#### `openPopupOnItemClick([strId], [mouseButton = 0])`
Returns `bool`

#### `beginPopup([strId])`
Returns `bool`

#### `beginPopupModal(name, [open], [extraFlags = 0])`
Returns `open, bool`

#### `beginPopupContextItem([strId], [mouseButton = 0])`
Returns `bool`

#### `beginPopupContextWindow([strId], [mouseButton = 0], [alsoOverItems = true])`
Returns `bool`

#### `beginPopupContextVoid([strId], [mouseButton = 0])`
Returns `bool`

#### `endPopup()`
Returns nothing

#### `isPopupOpen([strId])`
Returns `bool`

#### `closeCurrentPopup()`
Returns nothing


## Logging

#### `logToTTY([maxDepth = -1])`
Returns nothing

#### `logToFile([maxDepth = -1], [filename])`
Returns nothing

#### `logToClipboard([maxDepth = -1])`
Returns nothing

#### `logFinish()`
Returns nothing

#### `logButtons()`
Returns nothing

#### `logText(fmt)`
Returns nothing


## Drag and drop

#### `beginDragDropSource([flags = 0], [mouseButton = 0])`
Returns `bool`

#### `setDragDropPayload(type, data, [size = 0, 0], [cond = 0])`
Returns `data, bool`

#### `endDragDropSource()`
Returns nothing

#### `beginDragDropTarget()`
Returns `bool`

#### `acceptDragDropPayload(type, [flags = 0])`
Returns `const struct ImGuiPayload *`

#### `endDragDropTarget()`
Returns nothing


## Clipping

#### `pushClipRect(clipRectMinX, clipRectMinY, clipRectMaxX, clipRectMaxY, intersectWithCurrentClipRect)`
Returns nothing

#### `popClipRect()`
Returns nothing


## Styles

#### `styleColorsClassic([dst])`
Returns `dst`

#### `styleColorsDark([dst])`
Returns `dst`

#### `styleColorsLight([dst])`
Returns `dst`

#### `setItemDefaultFocus()`
Returns nothing

#### `setKeyboardFocusHere([offset = 0])`
Returns nothing


## Utilities

#### `isItemHovered([flags = 0])`
Returns `bool`

#### `isItemActive()`
Returns `bool`

#### `isItemClicked([mouseButton = 0])`
Returns `bool`

#### `isItemVisible()`
Returns `bool`

#### `isAnyItemHovered()`
Returns `bool`

#### `isAnyItemActive()`
Returns `bool`

#### `getItemRectMin()`
Returns `x, y`

#### `getItemRectMax()`
Returns `x, y`

#### `getItemRectSize()`
Returns `x, y`

#### `setItemAllowOverlap()`
Returns nothing

#### `isWindowFocused([flags = 0])`
Returns `bool`

#### `isWindowHovered(falgs)`
Returns `bool`

#### `isAnyWindowFocused()`
Returns `bool`

#### `isAnyWindowHovered()`
Returns `bool`

#### `isRectVisible(itemSizeX, itemSizeY)`
Returns `bool`

#### `isRectVisible2(rectMinX, rectMinY, rectMaxX, rectMaxY)`
Returns `rectMinX, rectMinY, rectMaxX, rectMaxY, bool`

#### `getTime()`
Returns `float`

#### `getFrameCount()`
Returns `int`

#### `getOverlayDrawList()`
Returns `struct ImDrawList *`

#### `getDrawListSharedData()`
Returns `struct ImDrawListSharedData *`

#### `getStyleColorName(idx)`
Returns `const char *`

#### `calcItemRectClosestPoint(posX, posY, [onEdge = false], [outward = 0])`
Returns `x, y`

#### `calcTextSize(text, [textEnd], [hideTextAfterDoubleHash = false], [wrapWidth = -1])`
Returns `x, y`

#### `calcListClipping(itemsCount, itemsHeight)`
Returns `itemsDisplayStart, itemsDisplayEnd`

#### `beginChildFrame([id], [sizeX, sizeY = 0, 0], [extraFlags = 0])`
Returns `bool`

#### `endChildFrame()`
Returns nothing

#### `colorConvertU32ToFloat4(setIn)`
Returns `x, y, z, w`

#### `colorConvertFloat4ToU32(setInX, setInY, setInZ, setInW)`
Returns `ImU32`

#### `colorConvertRGBtoHSV(r, g, b)`
Returns `h, s, v`

#### `colorConvertHSVtoRGB(h, s, v)`
Returns `r, g, b`


## Inputs

#### `getKeyIndex(imguiKey)`
Returns `int`

#### `isKeyDown(userKeyIndex)`
Returns `bool`

#### `isKeyPressed(userKeyIndex, setRepeat)`
Returns `bool`

#### `isKeyReleased(userKeyIndex)`
Returns `bool`

#### `getKeyPressedAmount(keyIndex, repeatDelay, rate)`
Returns `int`

#### `isMouseDown([button = 0])`
Returns `bool`

#### `isMouseClicked([button = 0], setRepeat)`
Returns `bool`

#### `isMouseDoubleClicked([button = 0])`
Returns `bool`

#### `isMouseReleased([button = 0])`
Returns `bool`

#### `isMouseDragging([button = 0], [lockThreshold = -1])`
Returns `bool`

#### `isMouseHoveringRect(rMinX, rMinY, rMaxX, rMaxY, [clip = true])`
Returns `bool`

#### `isMousePosValid([mousePosX, mousePosY])`
Returns `mousePosX, mousePosY, bool`

#### `getMousePos()`
Returns `x, y`

#### `getMousePosOnOpeningCurrentPopup()`
Returns `x, y`

#### `getMouseDragDelta([button = 0], [lockThreshold = -1])`
Returns `x, y`

#### `resetMouseDragDelta([button = 0])`
Returns nothing

#### `getMouseCursor()`
Returns `ImGuiMouseCursor`

#### `setMouseCursor(type)`
Returns nothing

#### `captureKeyboardFromApp([capture = true])`
Returns nothing

#### `captureMouseFromApp([capture = true])`
Returns nothing


## Clipboard

#### `getClipboardText()`
Returns `const char *`

#### `setClipboardText(text)`
Returns nothing


## Context

#### `getVersion()`
Returns `const char *`
