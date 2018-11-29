local ig = {}


--
-- C definitions ('cimgui.h' slightly modified to parse with `ffi.cdef`)
--

local cDefs = [[
// #include <stdio.h>

// #if defined _WIN32 || defined __CYGWIN__
// #ifdef CIMGUI_NO_EXPORT
// #define API
// #else
// #define API __declspec(dllexport)
// #endif
// #ifndef __GNUC__
// #define snprintf sprintf_s
// #endif
// #else
// #define API
// #endif

// #if defined __cplusplus
// #define EXTERN extern "C"
// #else
// #include <stdarg.h>
// #include <stdbool.h>
// #define EXTERN extern
// #endif

// #define CIMGUI_API EXTERN API
// #define CONST const

struct ImGuiIO;
struct ImGuiStyle;
struct ImDrawData;
struct ImVec2;
struct ImVec4;
struct ImGuiTextEditCallbackData;
struct ImGuiSizeConstraintCallbackData;
struct ImDrawList;
struct ImGuiStorage;
struct ImFont;
struct ImFontConfig;
struct ImFontAtlas;
struct ImDrawCmd;
struct ImGuiListClipper;
struct ImGuiTextFilter;
struct ImGuiPayload;

// #if defined __cplusplus
// #define IMFONTGLYPH ImFontGlyph
// #else
// struct Glyph;
// #define IMFONTGLYPH Glyph
// #endif

typedef unsigned short ImDrawIdx;
typedef unsigned int ImU32;
typedef unsigned short ImWchar;
typedef void *ImTextureID;
typedef ImU32 ImGuiID;
typedef int ImGuiCol;
typedef int ImGuiStyleVar;
typedef int ImGuiKey;
typedef int ImGuiColorEditFlags;
typedef int ImGuiMouseCursor;
typedef int ImGuiWindowFlags;
typedef int ImGuiCond;
typedef int ImGuiColumnsFlags;
typedef int ImGuiInputTextFlags;
typedef int ImGuiSelectableFlags;
typedef int ImGuiTreeNodeFlags;
typedef int ImGuiHoveredFlags;
typedef int ImGuiComboFlags;
typedef int ImGuiDragDropFlags;
typedef int ImGuiFocusedFlags;
typedef int ImDrawCornerFlags;
typedef int ImDrawListFlags;
typedef int (*ImGuiTextEditCallback)(struct ImGuiTextEditCallbackData *data);
typedef void (*ImGuiSizeConstraintCallback)(struct ImGuiSizeConstraintCallbackData *data);
typedef void (*ImDrawCallback)(const struct ImDrawList *parent_list, const struct ImDrawCmd *cmd);
// #ifdef _MSC_VER
// typedef unsigned __int64 ImU64;
// #else
typedef unsigned long long ImU64;
// #endif

// #ifdef CIMGUI_DEFINE_ENUMS_AND_STRUCTS
struct ImVec2
{
    float x, y;
};

struct ImVec4
{
    float x, y, z, w;
};

enum
{
    ImGuiWindowFlags_NoTitleBar = 1 << 0,
    ImGuiWindowFlags_NoResize = 1 << 1,
    ImGuiWindowFlags_NoMove = 1 << 2,
    ImGuiWindowFlags_NoScrollbar = 1 << 3,
    ImGuiWindowFlags_NoScrollWithMouse = 1 << 4,
    ImGuiWindowFlags_NoCollapse = 1 << 5,
    ImGuiWindowFlags_AlwaysAutoResize = 1 << 6,
    //ImGuiWindowFlags_ShowBorders = 1 << 7,
    ImGuiWindowFlags_NoSavedSettings = 1 << 8,
    ImGuiWindowFlags_NoInputs = 1 << 9,
    ImGuiWindowFlags_MenuBar = 1 << 10,
    ImGuiWindowFlags_HorizontalScrollbar = 1 << 11,
    ImGuiWindowFlags_NoFocusOnAppearing = 1 << 12,
    ImGuiWindowFlags_NoBringToFrontOnFocus = 1 << 13,
    ImGuiWindowFlags_AlwaysVerticalScrollbar = 1 << 14,
    ImGuiWindowFlags_AlwaysHorizontalScrollbar = 1 << 15,
    ImGuiWindowFlags_AlwaysUseWindowPadding = 1 << 16,
    ImGuiWindowFlags_ResizeFromAnySide = 1 << 17,
};

enum
{
    ImGuiInputTextFlags_CharsDecimal = 1 << 0,
    ImGuiInputTextFlags_CharsHexadecimal = 1 << 1,
    ImGuiInputTextFlags_CharsUppercase = 1 << 2,
    ImGuiInputTextFlags_CharsNoBlank = 1 << 3,
    ImGuiInputTextFlags_AutoSelectAll = 1 << 4,
    ImGuiInputTextFlags_EnterReturnsTrue = 1 << 5,
    ImGuiInputTextFlags_CallbackCompletion = 1 << 6,
    ImGuiInputTextFlags_CallbackHistory = 1 << 7,
    ImGuiInputTextFlags_CallbackAlways = 1 << 8,
    ImGuiInputTextFlags_CallbackCharFilter = 1 << 9,
    ImGuiInputTextFlags_AllowTabInput = 1 << 10,
    ImGuiInputTextFlags_CtrlEnterForNewLine = 1 << 11,
    ImGuiInputTextFlags_NoHorizontalScroll = 1 << 12,
    ImGuiInputTextFlags_AlwaysInsertMode = 1 << 13,
    ImGuiInputTextFlags_ReadOnly = 1 << 14,
    ImGuiInputTextFlags_Password = 1 << 15,
    ImGuiInputTextFlags_NoUndoRedo = 1 << 16,
};

enum
{
    ImGuiTreeNodeFlags_Selected = 1 << 0,
    ImGuiTreeNodeFlags_Framed = 1 << 1,
    ImGuiTreeNodeFlags_AllowItemOverlap = 1 << 2,
    ImGuiTreeNodeFlags_NoTreePushOnOpen = 1 << 3,
    ImGuiTreeNodeFlags_NoAutoOpenOnLog = 1 << 4,
    ImGuiTreeNodeFlags_DefaultOpen = 1 << 5,
    ImGuiTreeNodeFlags_OpenOnDoubleClick = 1 << 6,
    ImGuiTreeNodeFlags_OpenOnArrow = 1 << 7,
    ImGuiTreeNodeFlags_Leaf = 1 << 8,
    ImGuiTreeNodeFlags_Bullet = 1 << 9,
    ImGuiTreeNodeFlags_FramePadding = 1 << 10,
    ImGuiTreeNodeFlags_CollapsingHeader = ImGuiTreeNodeFlags_Framed | ImGuiTreeNodeFlags_NoAutoOpenOnLog
};

enum
{
    ImGuiSelectableFlags_DontClosePopups = 1 << 0,
    ImGuiSelectableFlags_SpanAllColumns = 1 << 1,
    ImGuiSelectableFlags_AllowDoubleClick = 1 << 2
};

enum ImGuiComboFlags_
{
    ImGuiComboFlags_PopupAlignLeft = 1 << 0,
    ImGuiComboFlags_HeightSmall = 1 << 1,
    ImGuiComboFlags_HeightRegular = 1 << 2,
    ImGuiComboFlags_HeightLarge = 1 << 3,
    ImGuiComboFlags_HeightLargest = 1 << 4,
    ImGuiComboFlags_HeightMask_ = ImGuiComboFlags_HeightSmall | ImGuiComboFlags_HeightRegular | ImGuiComboFlags_HeightLarge | ImGuiComboFlags_HeightLargest
};

enum ImGuiFocusedFlags_
{
    ImGuiFocusedFlags_ChildWindows = 1 << 0,
    ImGuiFocusedFlags_RootWindow = 1 << 1,
    ImGuiFocusedFlags_RootAndChildWindows = ImGuiFocusedFlags_RootWindow | ImGuiFocusedFlags_ChildWindows
};

enum ImGuiHoveredFlags_
{
    ImGuiHoveredFlags_ChildWindows = 1 << 0,
    ImGuiHoveredFlags_RootWindow = 1 << 1,
    ImGuiHoveredFlags_AllowWhenBlockedByPopup = 1 << 2,
    //ImGuiHoveredFlags_AllowWhenBlockedByModal     = 1 << 3,
    ImGuiHoveredFlags_AllowWhenBlockedByActiveItem = 1 << 4,
    ImGuiHoveredFlags_AllowWhenOverlapped = 1 << 5,
    ImGuiHoveredFlags_RectOnly = ImGuiHoveredFlags_AllowWhenBlockedByPopup | ImGuiHoveredFlags_AllowWhenBlockedByActiveItem | ImGuiHoveredFlags_AllowWhenOverlapped,
    ImGuiHoveredFlags_RootAndChildWindows = ImGuiHoveredFlags_RootWindow | ImGuiHoveredFlags_ChildWindows
};

enum ImGuiDragDropFlags_
{
    ImGuiDragDropFlags_SourceNoPreviewTooltip = 1 << 0,
    ImGuiDragDropFlags_SourceNoDisableHover = 1 << 1,
    ImGuiDragDropFlags_SourceNoHoldToOpenOthers = 1 << 2,
    ImGuiDragDropFlags_SourceAllowNullID = 1 << 3,
    ImGuiDragDropFlags_SourceExtern = 1 << 4,
    ImGuiDragDropFlags_AcceptBeforeDelivery = 1 << 10,
    ImGuiDragDropFlags_AcceptNoDrawDefaultRect = 1 << 11,
    ImGuiDragDropFlags_AcceptPeekOnly = ImGuiDragDropFlags_AcceptBeforeDelivery | ImGuiDragDropFlags_AcceptNoDrawDefaultRect
};

enum
{
    ImGuiKey_Tab,
    ImGuiKey_LeftArrow,
    ImGuiKey_RightArrow,
    ImGuiKey_UpArrow,
    ImGuiKey_DownArrow,
    ImGuiKey_PageUp,
    ImGuiKey_PageDown,
    ImGuiKey_Home,
    ImGuiKey_End,
    ImGuiKey_Delete,
    ImGuiKey_Backspace,
    ImGuiKey_Enter,
    ImGuiKey_Escape,
    ImGuiKey_A,
    ImGuiKey_C,
    ImGuiKey_V,
    ImGuiKey_X,
    ImGuiKey_Y,
    ImGuiKey_Z,
    ImGuiKey_COUNT
};

enum
{
    ImGuiCol_Text,
    ImGuiCol_TextDisabled,
    ImGuiCol_WindowBg,
    ImGuiCol_ChildBg,
    ImGuiCol_PopupBg,
    ImGuiCol_Border,
    ImGuiCol_BorderShadow,
    ImGuiCol_FrameBg,
    ImGuiCol_FrameBgHovered,
    ImGuiCol_FrameBgActive,
    ImGuiCol_TitleBg,
    ImGuiCol_TitleBgActive,
    ImGuiCol_TitleBgCollapsed,
    ImGuiCol_MenuBarBg,
    ImGuiCol_ScrollbarBg,
    ImGuiCol_ScrollbarGrab,
    ImGuiCol_ScrollbarGrabHovered,
    ImGuiCol_ScrollbarGrabActive,
    ImGuiCol_CheckMark,
    ImGuiCol_SliderGrab,
    ImGuiCol_SliderGrabActive,
    ImGuiCol_Button,
    ImGuiCol_ButtonHovered,
    ImGuiCol_ButtonActive,
    ImGuiCol_Header,
    ImGuiCol_HeaderHovered,
    ImGuiCol_HeaderActive,
    ImGuiCol_Separator,
    ImGuiCol_SeparatorHovered,
    ImGuiCol_SeparatorActive,
    ImGuiCol_ResizeGrip,
    ImGuiCol_ResizeGripHovered,
    ImGuiCol_ResizeGripActive,
    ImGuiCol_CloseButton,
    ImGuiCol_CloseButtonHovered,
    ImGuiCol_CloseButtonActive,
    ImGuiCol_PlotLines,
    ImGuiCol_PlotLinesHovered,
    ImGuiCol_PlotHistogram,
    ImGuiCol_PlotHistogramHovered,
    ImGuiCol_TextSelectedBg,
    ImGuiCol_ModalWindowDarkening,
    ImGuiCol_DragDropTarget,
    ImGuiCol_COUNT
};

enum
{
    ImGuiStyleVar_Alpha,
    ImGuiStyleVar_WindowPadding,
    ImGuiStyleVar_WindowRounding,
    ImGuiStyleVar_WindowBorderSize,
    ImGuiStyleVar_WindowMinSize,
    ImGuiStyleVar_ChildRounding,
    ImGuiStyleVar_ChildBorderSize,
    ImGuiStyleVar_PopupRounding,
    ImGuiStyleVar_PopupBorderSize,
    ImGuiStyleVar_FramePadding,
    ImGuiStyleVar_FrameRounding,
    ImGuiStyleVar_FrameBorderSize,
    ImGuiStyleVar_ItemSpacing,
    ImGuiStyleVar_ItemInnerSpacing,
    ImGuiStyleVar_IndentSpacing,
    ImGuiStyleVar_GrabMinSize,
    ImGuiStyleVar_ButtonTextAlign,
    ImGuiStyleVar_Count_
};

enum
{
    ImGuiColorEditFlags_NoAlpha = 1 << 1,
    ImGuiColorEditFlags_NoPicker = 1 << 2,
    ImGuiColorEditFlags_NoOptions = 1 << 3,
    ImGuiColorEditFlags_NoSmallPreview = 1 << 4,
    ImGuiColorEditFlags_NoInputs = 1 << 5,
    ImGuiColorEditFlags_NoTooltip = 1 << 6,
    ImGuiColorEditFlags_NoLabel = 1 << 7,
    ImGuiColorEditFlags_NoSidePreview = 1 << 8,
    ImGuiColorEditFlags_AlphaBar = 1 << 9,
    ImGuiColorEditFlags_AlphaPreview = 1 << 10,
    ImGuiColorEditFlags_AlphaPreviewHalf = 1 << 11,
    ImGuiColorEditFlags_HDR = 1 << 12,
    ImGuiColorEditFlags_RGB = 1 << 13,
    ImGuiColorEditFlags_HSV = 1 << 14,
    ImGuiColorEditFlags_HEX = 1 << 15,
    ImGuiColorEditFlags_Uint8 = 1 << 16,
    ImGuiColorEditFlags_Float = 1 << 17,
    ImGuiColorEditFlags_PickerHueBar = 1 << 18,
    ImGuiColorEditFlags_PickerHueWheel = 1 << 19
};

enum
{
    ImGuiMouseCursor_None = -1,
    ImGuiMouseCursor_Arrow = 0,
    ImGuiMouseCursor_TextInput,
    ImGuiMouseCursor_Move,
    ImGuiMouseCursor_ResizeNS,
    ImGuiMouseCursor_ResizeEW,
    ImGuiMouseCursor_ResizeNESW,
    ImGuiMouseCursor_ResizeNWSE,
    ImGuiMouseCursor_Count_
};

enum
{
    ImGuiCond_Always = 1 << 0,
    ImGuiCond_Once = 1 << 1,
    ImGuiCond_FirstUseEver = 1 << 2,
    ImGuiCond_Appearing = 1 << 3
};

enum ImDrawCornerFlags_
{
    ImDrawCornerFlags_TopLeft = 1 << 0,
    ImDrawCornerFlags_TopRight = 1 << 1,
    ImDrawCornerFlags_BotLeft = 1 << 2,
    ImDrawCornerFlags_BotRight = 1 << 3,
    ImDrawCornerFlags_Top = ImDrawCornerFlags_TopLeft | ImDrawCornerFlags_TopRight,
    ImDrawCornerFlags_Bot = ImDrawCornerFlags_BotLeft | ImDrawCornerFlags_BotRight,
    ImDrawCornerFlags_Left = ImDrawCornerFlags_TopLeft | ImDrawCornerFlags_BotLeft,
    ImDrawCornerFlags_Right = ImDrawCornerFlags_TopRight | ImDrawCornerFlags_BotRight,
    ImDrawCornerFlags_All = 0xF
};

enum ImDrawListFlags_
{
    ImDrawListFlags_AntiAliasedLines = 1 << 0,
    ImDrawListFlags_AntiAliasedFill = 1 << 1
};

struct ImGuiStyle
{
    float Alpha;
    struct ImVec2 WindowPadding;
    float WindowRounding;
    float WindowBorderSize;
    struct ImVec2 WindowMinSize;
    struct ImVec2 WindowTitleAlign;
    float ChildRounding;
    float ChildBorderSize;
    float PopupRounding;
    float PopupBorderSize;
    struct ImVec2 FramePadding;
    float FrameRounding;
    float FrameBorderSize;
    struct ImVec2 ItemSpacing;
    struct ImVec2 ItemInnerSpacing;
    struct ImVec2 TouchExtraPadding;
    float IndentSpacing;
    float ColumnsMinSpacing;
    float ScrollbarSize;
    float ScrollbarRounding;
    float GrabMinSize;
    float GrabRounding;
    struct ImVec2 ButtonTextAlign;
    struct ImVec2 DisplayWindowPadding;
    struct ImVec2 DisplaySafeAreaPadding;
    bool AntiAliasedLines;
    bool AntiAliasedFill;
    float CurveTessellationTol;
    struct ImVec4 Colors[ImGuiCol_COUNT];
};

struct ImGuiIO
{
    struct ImVec2 DisplaySize;
    float DeltaTime;
    float IniSavingRate;
    const char *IniFilename;
    const char *LogFilename;
    float MouseDoubleClickTime;
    float MouseDoubleClickMaxDist;
    float MouseDragThreshold;
    int KeyMap[ImGuiKey_COUNT];
    float KeyRepeatDelay;
    float KeyRepeatRate;
    void *UserData;
    struct ImFontAtlas *Fonts;
    float FontGlobalScale;
    bool FontAllowUserScaling;
    struct ImFont *FontDefault;
    struct ImVec2 DisplayFramebufferScale;
    struct ImVec2 DisplayVisibleMin;
    struct ImVec2 DisplayVisibleMax;
    bool OptMacOSXBehaviors;
    bool OptCursorBlink;
    void (*RenderDrawListsFn)(struct ImDrawData *data);
    const char *(*GetClipboardTextFn)(void *user_data);
    void (*SetClipboardTextFn)(void *user_data, const char *text);
    void *ClipboardUserData;
    void *(*MemAllocFn)(size_t sz);
    void (*MemFreeFn)(void *ptr);
    void (*ImeSetInputScreenPosFn)(int x, int y);
    void *ImeWindowHandle;
    struct ImVec2 MousePos;
    bool MouseDown[5];
    float MouseWheel;
    bool MouseDrawCursor;
    bool KeyCtrl;
    bool KeyShift;
    bool KeyAlt;
    bool KeySuper;
    bool KeysDown[512];
    ImWchar InputCharacters[16 + 1];
    bool WantCaptureMouse;
    bool WantCaptureKeyboard;
    bool WantTextInput;
    float Framerate;
    int MetricsAllocs;
    int MetricsRenderVertices;
    int MetricsRenderIndices;
    int MetricsActiveWindows;
    struct ImVec2 MouseDelta;
    struct ImVec2 MousePosPrev;
    bool MouseClicked[5];
    struct ImVec2 MouseClickedPos[5];
    float MouseClickedTime[5];
    bool MouseDoubleClicked[5];
    bool MouseReleased[5];
    bool MouseDownOwned[5];
    float MouseDownDuration[5];
    float MouseDownDurationPrev[5];
    struct ImVec2 MouseDragMaxDistanceAbs[5];
    float MouseDragMaxDistanceSqr[5];
    float KeysDownDuration[512];
    float KeysDownDurationPrev[512];
};

struct ImGuiTextEditCallbackData
{
    ImGuiInputTextFlags EventFlag;
    ImGuiInputTextFlags Flags;
    void *UserData;
    bool ReadOnly;
    ImWchar EventChar;
    ImGuiKey EventKey;
    char *Buf;
    int BufTextLen;
    int BufSize;
    bool BufDirty;
    int CursorPos;
    int SelectionStart;
    int SelectionEnd;
};

struct ImGuiSizeConstraintCallbackData
{
    void *UserData;
    struct ImVec2 Pos;
    struct ImVec2 CurrentSize;
    struct ImVec2 DesiredSize;
};

struct ImDrawCmd
{
    unsigned int ElemCount;
    struct ImVec4 ClipRect;
    ImTextureID TextureId;
    ImDrawCallback UserCallback;
    void *UserCallbackData;
};

struct ImDrawData
{
    bool Valid;
    struct ImDrawList **CmdLists;
    int CmdListsCount;
    int TotalVtxCount;
    int TotalIdxCount;
};

struct ImDrawVert
{
    struct ImVec2 pos;
    struct ImVec2 uv;
    ImU32 col;
};

struct ImFontConfig
{
    void *FontData;
    int FontDataSize;
    bool FontDataOwnedByAtlas;
    int FontNo;
    float SizePixels;
    int OversampleH, OversampleV;
    bool PixelSnapH;
    struct ImVec2 GlyphExtraSpacing;
    struct ImVec2 GlyphOffset;
    const ImWchar *GlyphRanges;
    bool MergeMode;
    unsigned int RasterizerFlags;
    float RasterizerMultiply;
    char Name[32];
    struct ImFont *DstFont;
};

struct ImGuiListClipper
{
    float StartPosY;
    float ItemsHeight;
    int ItemsCount, StepNo, DisplayStart, DisplayEnd;
};

struct ImGuiPayload
{
    const void *Data;
    int DataSize;

    ImGuiID SourceId;
    ImGuiID SourceParentId;
    int DataFrameCount;
    char DataType[8 + 1];
    bool Preview;
    bool Delivery;
};
// #endif // CIMGUI_DEFINE_ENUMS_AND_STRUCTS

// Main
extern struct ImGuiIO *igGetIO();
extern struct ImGuiStyle *igGetStyle();
extern struct ImDrawData *igGetDrawData();
extern void igNewFrame();
extern void igRender();
extern void igEndFrame();
extern void igShutdown();

// Demo/Debug/Info
extern void igShowDemoWindow(bool *opened);
extern void igShowMetricsWindow(bool *opened);
extern void igShowStyleEditor(struct ImGuiStyle *ref);
extern void igShowStyleSelector(const char *label);
extern void igShowFontSelector(const char *label);
extern void igShowUserGuide();

// Window
extern bool igBegin(const char *name, bool *p_open, ImGuiWindowFlags flags);
//Is going to be obsolete,
//extern bool             igBegin2(const char* name, bool* p_open, const struct ImVec2 size_on_first_use, float bg_alpha, ImGuiWindowFlags flags);
extern void igEnd();
extern bool igBeginChild(const char *str_id, const struct ImVec2 size, bool border, ImGuiWindowFlags extra_flags);
extern bool igBeginChildEx(ImGuiID id, const struct ImVec2 size, bool border, ImGuiWindowFlags extra_flags);
extern void igEndChild();
extern void igGetContentRegionMax(struct ImVec2 *out);
extern void igGetContentRegionAvail(struct ImVec2 *out);
extern float igGetContentRegionAvailWidth();
extern void igGetWindowContentRegionMin(struct ImVec2 *out);
extern void igGetWindowContentRegionMax(struct ImVec2 *out);
extern float igGetWindowContentRegionWidth();
extern struct ImDrawList *igGetWindowDrawList();
extern void igGetWindowPos(struct ImVec2 *out);
extern void igGetWindowSize(struct ImVec2 *out);
extern float igGetWindowWidth();
extern float igGetWindowHeight();
extern bool igIsWindowCollapsed();
extern bool igIsWindowAppearing();
extern void igSetWindowFontScale(float scale);

extern void igSetNextWindowPos(const struct ImVec2 pos, ImGuiCond cond, const struct ImVec2 pivot);
extern void igSetNextWindowSize(const struct ImVec2 size, ImGuiCond cond);
extern void igSetNextWindowSizeConstraints(const struct ImVec2 size_min, const struct ImVec2 size_max, ImGuiSizeConstraintCallback custom_callback, void *custom_callback_data);
extern void igSetNextWindowContentSize(const struct ImVec2 size);
extern void igSetNextWindowCollapsed(bool collapsed, ImGuiCond cond);
extern void igSetNextWindowFocus();
extern void igSetWindowPos(const struct ImVec2 pos, ImGuiCond cond);
extern void igSetWindowSize(const struct ImVec2 size, ImGuiCond cond);
extern void igSetWindowCollapsed(bool collapsed, ImGuiCond cond);
extern void igSetWindowFocus();
extern void igSetWindowPosByName(const char *name, const struct ImVec2 pos, ImGuiCond cond);
extern void igSetWindowSize2(const char *name, const struct ImVec2 size, ImGuiCond cond);
extern void igSetWindowCollapsed2(const char *name, bool collapsed, ImGuiCond cond);
extern void igSetWindowFocus2(const char *name);

extern float igGetScrollX();
extern float igGetScrollY();
extern float igGetScrollMaxX();
extern float igGetScrollMaxY();
extern void igSetScrollX(float scroll_x);
extern void igSetScrollY(float scroll_y);
extern void igSetScrollHere(float center_y_ratio);
extern void igSetScrollFromPosY(float pos_y, float center_y_ratio);
extern void igSetStateStorage(struct ImGuiStorage *tree);
extern struct ImGuiStorage *igGetStateStorage();

// Parameters stacks (shared)
extern void igPushFont(struct ImFont *font);
extern void igPopFont();
extern void igPushStyleColorU32(ImGuiCol idx, ImU32 col);
extern void igPushStyleColor(ImGuiCol idx, const struct ImVec4 col);
extern void igPopStyleColor(int count);
extern void igPushStyleVar(ImGuiStyleVar idx, float val);
extern void igPushStyleVarVec(ImGuiStyleVar idx, const struct ImVec2 val);
extern void igPopStyleVar(int count);
extern void igGetStyleColorVec4(struct ImVec4 *pOut, ImGuiCol idx);
extern struct ImFont *igGetFont();
extern float igGetFontSize();
extern void igGetFontTexUvWhitePixel(struct ImVec2 *pOut);
extern ImU32 igGetColorU32(ImGuiCol idx, float alpha_mul);
extern ImU32 igGetColorU32Vec(const struct ImVec4 *col);
extern ImU32 igGetColorU32U32(ImU32 col);

// Parameters stacks (current window)
extern void igPushItemWidth(float item_width);
extern void igPopItemWidth();
extern float igCalcItemWidth();
extern void igPushTextWrapPos(float wrap_pos_x);
extern void igPopTextWrapPos();
extern void igPushAllowKeyboardFocus(bool v);
extern void igPopAllowKeyboardFocus();
extern void igPushButtonRepeat(bool repeat);
extern void igPopButtonRepeat();

// Cursor / Layout
extern void igSeparator();
extern void igSameLine(float pos_x, float spacing_w);
extern void igNewLine();
extern void igSpacing();
extern void igDummy(const struct ImVec2 *size);
extern void igIndent(float indent_w);
extern void igUnindent(float indent_w);
extern void igBeginGroup();
extern void igEndGroup();
extern void igGetCursorPos(struct ImVec2 *pOut);
extern float igGetCursorPosX();
extern float igGetCursorPosY();
extern void igSetCursorPos(const struct ImVec2 local_pos);
extern void igSetCursorPosX(float x);
extern void igSetCursorPosY(float y);
extern void igGetCursorStartPos(struct ImVec2 *pOut);
extern void igGetCursorScreenPos(struct ImVec2 *pOut);
extern void igSetCursorScreenPos(const struct ImVec2 pos);
extern void igAlignTextToFramePadding();
extern float igGetTextLineHeight();
extern float igGetTextLineHeightWithSpacing();
extern float igGetFrameHeight();
extern float igGetFrameHeightWithSpacing();

//Columns
extern void igColumns(int count, const char *id, bool border);
extern void igNextColumn();
extern int igGetColumnIndex();
extern float igGetColumnWidth(int column_index); // get column width (in pixels). pass -1 to use current column
extern void igSetColumnWidth(int column_index, float width);
extern float igGetColumnOffset(int column_index);
extern void igSetColumnOffset(int column_index, float offset_x);
extern int igGetColumnsCount();

// ID scopes
// If you are creating widgets in a loop you most likely want to push a unique identifier so ImGui can differentiate them
// You can also use "##extra" within your widget name to distinguish them from each others (see 'Programmer Guide')
extern void igPushIDStr(const char *str_id);
extern void igPushIDStrRange(const char *str_begin, const char *str_end);
extern void igPushIDPtr(const void *ptr_id);
extern void igPushIDInt(int int_id);
extern void igPopID();
extern ImGuiID igGetIDStr(const char *str_id);
extern ImGuiID igGetIDStrRange(const char *str_begin, const char *str_end);
extern ImGuiID igGetIDPtr(const void *ptr_id);

// Widgets: Text
extern void igTextUnformatted(const char *text, const char *text_end);
extern void igText(const char *fmt, ...);
extern void igTextV(const char *fmt, va_list args);
extern void igTextColored(const struct ImVec4 col, const char *fmt, ...);
extern void igTextColoredV(const struct ImVec4 col, const char *fmt, va_list args);
extern void igTextDisabled(const char *fmt, ...);
extern void igTextDisabledV(const char *fmt, va_list args);
extern void igTextWrapped(const char *fmt, ...);
extern void igTextWrappedV(const char *fmt, va_list args);
extern void igLabelText(const char *label, const char *fmt, ...);
extern void igLabelTextV(const char *label, const char *fmt, va_list args);
extern void igBulletText(const char *fmt, ...);
extern void igBulletTextV(const char *fmt, va_list args);
extern void igBullet();

// Widgets: Main
extern bool igButton(const char *label, const struct ImVec2 size);
extern bool igSmallButton(const char *label);
extern bool igInvisibleButton(const char *str_id, const struct ImVec2 size);
extern void igImage(ImTextureID user_texture_id, const struct ImVec2 size, const struct ImVec2 uv0, const struct ImVec2 uv1, const struct ImVec4 tint_col, const struct ImVec4 border_col);
extern bool igImageButton(ImTextureID user_texture_id, const struct ImVec2 size, const struct ImVec2 uv0, const struct ImVec2 uv1, int frame_padding, const struct ImVec4 bg_col, const struct ImVec4 tint_col);
extern bool igCheckbox(const char *label, bool *v);
extern bool igCheckboxFlags(const char *label, unsigned int *flags, unsigned int flags_value);
extern bool igRadioButtonBool(const char *label, bool active);
extern bool igRadioButton(const char *label, int *v, int v_button);
extern void igPlotLines(const char *label, const float *values, int values_count, int values_offset, const char *overlay_text, float scale_min, float scale_max, struct ImVec2 graph_size, int stride);
extern void igPlotLines2(const char *label, float (*values_getter)(void *data, int idx), void *data, int values_count, int values_offset, const char *overlay_text, float scale_min, float scale_max, struct ImVec2 graph_size);
extern void igPlotHistogram(const char *label, const float *values, int values_count, int values_offset, const char *overlay_text, float scale_min, float scale_max, struct ImVec2 graph_size, int stride);
extern void igPlotHistogram2(const char *label, float (*values_getter)(void *data, int idx), void *data, int values_count, int values_offset, const char *overlay_text, float scale_min, float scale_max, struct ImVec2 graph_size);
extern void igProgressBar(float fraction, const struct ImVec2 *size_arg, const char *overlay);

extern bool igBeginCombo(const char *label, const char *preview_value, ImGuiComboFlags flags);
extern void igEndCombo();
extern bool igCombo(const char *label, int *current_item, const char *const *items, int items_count, int popup_max_height_in_items);
extern bool igCombo2(const char *label, int *current_item, const char *items_separated_by_zeros, int popup_max_height_in_items);
extern bool igCombo3(const char *label, int *current_item, bool (*items_getter)(void *data, int idx, const char **out_text), void *data, int items_count, int popup_max_height_in_items);

// Widgets: Drags (tip: ctrl+click on a drag box to input with keyboard. manually input values aren't clamped, can go off-bounds)
// For all the Float2/Float3/Float4/Int2/Int3/Int4 versions of every functions, note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can pass address of your first element out of a contiguous set, e.g. &myvector.x
extern bool igDragFloat(const char *label, float *v, float v_speed, float v_min, float v_max, const char *display_format, float power); // If v_max >= v_max we have no bound
extern bool igDragFloat2(const char *label, float v[2], float v_speed, float v_min, float v_max, const char *display_format, float power);
extern bool igDragFloat3(const char *label, float v[3], float v_speed, float v_min, float v_max, const char *display_format, float power);
extern bool igDragFloat4(const char *label, float v[4], float v_speed, float v_min, float v_max, const char *display_format, float power);
extern bool igDragFloatRange2(const char *label, float *v_current_min, float *v_current_max, float v_speed, float v_min, float v_max, const char *display_format, const char *display_format_max, float power);
extern bool igDragInt(const char *label, int *v, float v_speed, int v_min, int v_max, const char *display_format); // If v_max >= v_max we have no bound
extern bool igDragInt2(const char *label, int v[2], float v_speed, int v_min, int v_max, const char *display_format);
extern bool igDragInt3(const char *label, int v[3], float v_speed, int v_min, int v_max, const char *display_format);
extern bool igDragInt4(const char *label, int v[4], float v_speed, int v_min, int v_max, const char *display_format);
extern bool igDragIntRange2(const char *label, int *v_current_min, int *v_current_max, float v_speed, int v_min, int v_max, const char *display_format, const char *display_format_max);

// Widgets: Input with Keyboard
extern bool igInputText(const char *label, char *buf, size_t buf_size, ImGuiInputTextFlags flags, ImGuiTextEditCallback callback, void *user_data);
extern bool igInputTextMultiline(const char *label, char *buf, size_t buf_size, const struct ImVec2 size, ImGuiInputTextFlags flags, ImGuiTextEditCallback callback, void *user_data);
extern bool igInputFloat(const char *label, float *v, float step, float step_fast, int decimal_precision, ImGuiInputTextFlags extra_flags);
extern bool igInputFloat2(const char *label, float v[2], int decimal_precision, ImGuiInputTextFlags extra_flags);
extern bool igInputFloat3(const char *label, float v[3], int decimal_precision, ImGuiInputTextFlags extra_flags);
extern bool igInputFloat4(const char *label, float v[4], int decimal_precision, ImGuiInputTextFlags extra_flags);
extern bool igInputInt(const char *label, int *v, int step, int step_fast, ImGuiInputTextFlags extra_flags);
extern bool igInputInt2(const char *label, int v[2], ImGuiInputTextFlags extra_flags);
extern bool igInputInt3(const char *label, int v[3], ImGuiInputTextFlags extra_flags);
extern bool igInputInt4(const char *label, int v[4], ImGuiInputTextFlags extra_flags);

// Widgets: Sliders (tip: ctrl+click on a slider to input with keyboard. manually input values aren't clamped, can go off-bounds)
extern bool igSliderFloat(const char *label, float *v, float v_min, float v_max, const char *display_format, float power);
extern bool igSliderFloat2(const char *label, float v[2], float v_min, float v_max, const char *display_format, float power);
extern bool igSliderFloat3(const char *label, float v[3], float v_min, float v_max, const char *display_format, float power);
extern bool igSliderFloat4(const char *label, float v[4], float v_min, float v_max, const char *display_format, float power);
extern bool igSliderAngle(const char *label, float *v_rad, float v_degrees_min, float v_degrees_max);
extern bool igSliderInt(const char *label, int *v, int v_min, int v_max, const char *display_format);
extern bool igSliderInt2(const char *label, int v[2], int v_min, int v_max, const char *display_format);
extern bool igSliderInt3(const char *label, int v[3], int v_min, int v_max, const char *display_format);
extern bool igSliderInt4(const char *label, int v[4], int v_min, int v_max, const char *display_format);
extern bool igVSliderFloat(const char *label, const struct ImVec2 size, float *v, float v_min, float v_max, const char *display_format, float power);
extern bool igVSliderInt(const char *label, const struct ImVec2 size, int *v, int v_min, int v_max, const char *display_format);

// Widgets: Color Editor/Picker (tip: the ColorEdit* functions have a little colored preview square that can be left-clicked to open a picker, and right-clicked to open an option menu.)
// Note that a 'float v[X]' function argument is the same as 'float* v', the array syntax is just a way to document the number of elements that are expected to be accessible. You can the pass the address of a first float element out of a contiguous structure, e.g. &myvector.x
extern bool igColorEdit3(const char *label, float col[3], ImGuiColorEditFlags flags);
extern bool igColorEdit4(const char *label, float col[4], ImGuiColorEditFlags flags);
extern bool igColorPicker3(const char *label, float col[3], ImGuiColorEditFlags flags);
extern bool igColorPicker4(const char *label, float col[4], ImGuiColorEditFlags flags, const float *ref_col);
extern bool igColorButton(const char *desc_id, const struct ImVec4 col, ImGuiColorEditFlags flags, const struct ImVec2 size);
extern void igSetColorEditOptions(ImGuiColorEditFlags flags);

// Widgets: Trees
extern bool igTreeNode(const char *label);
extern bool igTreeNodeStr(const char *str_id, const char *fmt, ...);
extern bool igTreeNodePtr(const void *ptr_id, const char *fmt, ...);
extern bool igTreeNodeStrV(const char *str_id, const char *fmt, va_list args);
extern bool igTreeNodePtrV(const void *ptr_id, const char *fmt, va_list args);
extern bool igTreeNodeEx(const char *label, ImGuiTreeNodeFlags flags);
extern bool igTreeNodeExStr(const char *str_id, ImGuiTreeNodeFlags flags, const char *fmt, ...);
extern bool igTreeNodeExPtr(const void *ptr_id, ImGuiTreeNodeFlags flags, const char *fmt, ...);
extern bool igTreeNodeExV(const char *str_id, ImGuiTreeNodeFlags flags, const char *fmt, va_list args);
extern bool igTreeNodeExVPtr(const void *ptr_id, ImGuiTreeNodeFlags flags, const char *fmt, va_list args);
extern void igTreePushStr(const char *str_id);
extern void igTreePushPtr(const void *ptr_id);
extern void igTreePop();
extern void igTreeAdvanceToLabelPos();
extern float igGetTreeNodeToLabelSpacing();
extern void igSetNextTreeNodeOpen(bool opened, ImGuiCond cond);
extern bool igCollapsingHeader(const char *label, ImGuiTreeNodeFlags flags);
extern bool igCollapsingHeaderEx(const char *label, bool *p_open, ImGuiTreeNodeFlags flags);

// Widgets: Selectable / Lists
extern bool igSelectable(const char *label, bool selected, ImGuiSelectableFlags flags, const struct ImVec2 size);
extern bool igSelectableEx(const char *label, bool *p_selected, ImGuiSelectableFlags flags, const struct ImVec2 size);
extern bool igListBox(const char *label, int *current_item, const char *const *items, int items_count, int height_in_items);
extern bool igListBox2(const char *label, int *current_item, bool (*items_getter)(void *data, int idx, const char **out_text), void *data, int items_count, int height_in_items);
extern bool igListBoxHeader(const char *label, const struct ImVec2 size);
extern bool igListBoxHeader2(const char *label, int items_count, int height_in_items);
extern void igListBoxFooter();

// Widgets: Value() Helpers. Output single value in "name: value" format (tip: freely declare your own within the ImGui namespace!)
extern void igValueBool(const char *prefix, bool b);
extern void igValueInt(const char *prefix, int v);
extern void igValueUInt(const char *prefix, unsigned int v);
extern void igValueFloat(const char *prefix, float v, const char *float_format);

// Tooltip
extern void igSetTooltip(const char *fmt, ...);
extern void igSetTooltipV(const char *fmt, va_list args);
extern void igBeginTooltip();
extern void igEndTooltip();

// Widgets: Menus
extern bool igBeginMainMenuBar();
extern void igEndMainMenuBar();
extern bool igBeginMenuBar();
extern void igEndMenuBar();
extern bool igBeginMenu(const char *label, bool enabled);
extern void igEndMenu();
extern bool igMenuItem(const char *label, const char *shortcut, bool selected, bool enabled);
extern bool igMenuItemPtr(const char *label, const char *shortcut, bool *p_selected, bool enabled);

// Popup
extern void igOpenPopup(const char *str_id);
extern bool igOpenPopupOnItemClick(const char *str_id, int mouse_button);
extern bool igBeginPopup(const char *str_id);
extern bool igBeginPopupModal(const char *name, bool *p_open, ImGuiWindowFlags extra_flags);
extern bool igBeginPopupContextItem(const char *str_id, int mouse_button);
extern bool igBeginPopupContextWindow(const char *str_id, int mouse_button, bool also_over_items);
extern bool igBeginPopupContextVoid(const char *str_id, int mouse_button);
extern void igEndPopup();
extern bool igIsPopupOpen(const char *str_id);
extern void igCloseCurrentPopup();

// Logging: all text output from interface is redirected to tty/file/clipboard. Tree nodes are automatically opened.
extern void igLogToTTY(int max_depth);
extern void igLogToFile(int max_depth, const char *filename);
extern void igLogToClipboard(int max_depth);
extern void igLogFinish();
extern void igLogButtons();
extern void igLogText(const char *fmt, ...);

extern bool igBeginDragDropSource(ImGuiDragDropFlags flags, int mouse_button);
extern bool igSetDragDropPayload(const char *type, const void *data, size_t size, ImGuiCond cond);
extern void igEndDragDropSource();
extern bool igBeginDragDropTarget();
extern const struct ImGuiPayload *igAcceptDragDropPayload(const char *type, ImGuiDragDropFlags flags);
extern void igEndDragDropTarget();

// Clipping
extern void igPushClipRect(const struct ImVec2 clip_rect_min, const struct ImVec2 clip_rect_max, bool intersect_with_current_clip_rect);
extern void igPopClipRect();

// Styles
extern void igStyleColorsClassic(struct ImGuiStyle *dst);
extern void igStyleColorsDark(struct ImGuiStyle *dst);
extern void igStyleColorsLight(struct ImGuiStyle *dst);

extern void igSetItemDefaultFocus();
extern void igSetKeyboardFocusHere(int offset);

// Utilities
extern bool igIsItemHovered(ImGuiHoveredFlags flags);
extern bool igIsItemActive();
extern bool igIsItemClicked(int mouse_button);
extern bool igIsItemVisible();
extern bool igIsAnyItemHovered();
extern bool igIsAnyItemActive();
extern void igGetItemRectMin(struct ImVec2 *pOut);
extern void igGetItemRectMax(struct ImVec2 *pOut);
extern void igGetItemRectSize(struct ImVec2 *pOut);
extern void igSetItemAllowOverlap();
extern bool igIsWindowFocused(ImGuiFocusedFlags flags);
extern bool igIsWindowHovered(ImGuiHoveredFlags falgs);
extern bool igIsAnyWindowFocused();
extern bool igIsAnyWindowHovered();
extern bool igIsRectVisible(const struct ImVec2 item_size);
extern bool igIsRectVisible2(const struct ImVec2 *rect_min, const struct ImVec2 *rect_max);
extern float igGetTime();
extern int igGetFrameCount();

extern struct ImDrawList *igGetOverlayDrawList();
extern struct ImDrawListSharedData *igGetDrawListSharedData();

extern const char *igGetStyleColorName(ImGuiCol idx);
extern void igCalcItemRectClosestPoint(struct ImVec2 *pOut, const struct ImVec2 pos, bool on_edge, float outward);
extern void igCalcTextSize(struct ImVec2 *pOut, const char *text, const char *text_end, bool hide_text_after_double_hash, float wrap_width);
extern void igCalcListClipping(int items_count, float items_height, int *out_items_display_start, int *out_items_display_end);

extern bool igBeginChildFrame(ImGuiID id, const struct ImVec2 size, ImGuiWindowFlags extra_flags);
extern void igEndChildFrame();

extern void igColorConvertU32ToFloat4(struct ImVec4 *pOut, ImU32 in);
extern ImU32 igColorConvertFloat4ToU32(const struct ImVec4 in);
extern void igColorConvertRGBtoHSV(float r, float g, float b, float *out_h, float *out_s, float *out_v);
extern void igColorConvertHSVtoRGB(float h, float s, float v, float *out_r, float *out_g, float *out_b);

// Inputs
extern int igGetKeyIndex(ImGuiKey imgui_key);
extern bool igIsKeyDown(int user_key_index);
extern bool igIsKeyPressed(int user_key_index, bool repeat);
extern bool igIsKeyReleased(int user_key_index);
extern int igGetKeyPressedAmount(int key_index, float repeat_delay, float rate);
extern bool igIsMouseDown(int button);
extern bool igIsMouseClicked(int button, bool repeat);
extern bool igIsMouseDoubleClicked(int button);
extern bool igIsMouseReleased(int button);
extern bool igIsMouseDragging(int button, float lock_threshold);
extern bool igIsMouseHoveringRect(const struct ImVec2 r_min, const struct ImVec2 r_max, bool clip);
extern bool igIsMousePosValid(const struct ImVec2 *mouse_pos);
;
extern void igGetMousePos(struct ImVec2 *pOut);
extern void igGetMousePosOnOpeningCurrentPopup(struct ImVec2 *pOut);
extern void igGetMouseDragDelta(struct ImVec2 *pOut, int button, float lock_threshold);
extern void igResetMouseDragDelta(int button);
extern ImGuiMouseCursor igGetMouseCursor();
extern void igSetMouseCursor(ImGuiMouseCursor type);
extern void igCaptureKeyboardFromApp(bool capture);
extern void igCaptureMouseFromApp(bool capture);

// Helpers functions to access functions pointers in ImGui::GetIO()
extern void *igMemAlloc(size_t sz);
extern void igMemFree(void *ptr);
extern const char *igGetClipboardText();
extern void igSetClipboardText(const char *text);

// Internal state access - if you want to share ImGui state between modules (e.g. DLL) or allocate it yourself
extern const char *igGetVersion();
extern struct ImGuiContext *igCreateContext(void *(*malloc_fn)(size_t), void (*free_fn)(void *));
extern void igDestroyContext(struct ImGuiContext *ctx);
extern struct ImGuiContext *igGetCurrentContext();
extern void igSetCurrentContext(struct ImGuiContext *ctx);

extern void ImFontConfig_DefaultConstructor(struct ImFontConfig *config);

// ImGuiIO
extern void ImGuiIO_AddInputCharacter(unsigned short c);
extern void ImGuiIO_AddInputCharactersUTF8(const char *utf8_chars);
extern void ImGuiIO_ClearInputCharacters();

// ImGuiTextFilter
extern struct ImGuiTextFilter *ImGuiTextFilter_Create(const char *default_filter);
extern void ImGuiTextFilter_Destroy(struct ImGuiTextFilter *filter);
extern void ImGuiTextFilter_Clear(struct ImGuiTextFilter *filter);
extern bool ImGuiTextFilter_Draw(struct ImGuiTextFilter *filter, const char *label, float width);
extern bool ImGuiTextFilter_PassFilter(const struct ImGuiTextFilter *filter, const char *text, const char *text_end);
extern bool ImGuiTextFilter_IsActive(const struct ImGuiTextFilter *filter);
extern void ImGuiTextFilter_Build(struct ImGuiTextFilter *filter);
extern const char *ImGuiTextFilter_GetInputBuf(struct ImGuiTextFilter *filter);

// ImGuiTextBuffer
extern struct ImGuiTextBuffer *ImGuiTextBuffer_Create();
extern void ImGuiTextBuffer_Destroy(struct ImGuiTextBuffer *buffer);
extern char ImGuiTextBuffer_index(struct ImGuiTextBuffer *buffer, int i);
extern const char *ImGuiTextBuffer_begin(const struct ImGuiTextBuffer *buffer);
extern const char *ImGuiTextBuffer_end(const struct ImGuiTextBuffer *buffer);
extern int ImGuiTextBuffer_size(const struct ImGuiTextBuffer *buffer);
extern bool ImGuiTextBuffer_empty(struct ImGuiTextBuffer *buffer);
extern void ImGuiTextBuffer_clear(struct ImGuiTextBuffer *buffer);
extern const char *ImGuiTextBuffer_c_str(const struct ImGuiTextBuffer *buffer);
extern void ImGuiTextBuffer_appendf(struct ImGuiTextBuffer *buffer, const char *fmt, ...);
extern void ImGuiTextBuffer_appendfv(struct ImGuiTextBuffer *buffer, const char *fmt, va_list args);

// ImGuiStorage
extern struct ImGuiStorage *ImGuiStorage_Create();
extern void ImGuiStorage_Destroy(struct ImGuiStorage *storage);
extern int ImGuiStorage_GetInt(struct ImGuiStorage *storage, ImGuiID key, int default_val);
extern void ImGuiStorage_SetInt(struct ImGuiStorage *storage, ImGuiID key, int val);
extern bool ImGuiStorage_GetBool(struct ImGuiStorage *storage, ImGuiID key, bool default_val);
extern void ImGuiStorage_SetBool(struct ImGuiStorage *storage, ImGuiID key, bool val);
extern float ImGuiStorage_GetFloat(struct ImGuiStorage *storage, ImGuiID key, float default_val);
extern void ImGuiStorage_SetFloat(struct ImGuiStorage *storage, ImGuiID key, float val);
extern void *ImGuiStorage_GetVoidPtr(struct ImGuiStorage *storage, ImGuiID key);
extern void ImGuiStorage_SetVoidPtr(struct ImGuiStorage *storage, ImGuiID key, void *val);
extern int *ImGuiStorage_GetIntRef(struct ImGuiStorage *storage, ImGuiID key, int default_val);
extern bool *ImGuiStorage_GetBoolRef(struct ImGuiStorage *storage, ImGuiID key, bool default_val);
extern float *ImGuiStorage_GetFloatRef(struct ImGuiStorage *storage, ImGuiID key, float default_val);
extern void **ImGuiStorage_GetVoidPtrRef(struct ImGuiStorage *storage, ImGuiID key, void *default_val);
extern void ImGuiStorage_SetAllInt(struct ImGuiStorage *storage, int val);

// ImGuiTextEditCallbackData
extern void ImGuiTextEditCallbackData_DeleteChars(struct ImGuiTextEditCallbackData *data, int pos, int bytes_count);
extern void ImGuiTextEditCallbackData_InsertChars(struct ImGuiTextEditCallbackData *data, int pos, const char *text, const char *text_end);
extern bool ImGuiTextEditCallbackData_HasSelection(struct ImGuiTextEditCallbackData *data);

// ImGuiListClipper
extern bool ImGuiListClipper_Step(struct ImGuiListClipper *clipper);
extern void ImGuiListClipper_Begin(struct ImGuiListClipper *clipper, int count, float items_height);
extern void ImGuiListClipper_End(struct ImGuiListClipper *clipper);
extern int ImGuiListClipper_GetDisplayStart(struct ImGuiListClipper *clipper);
extern int ImGuiListClipper_GetDisplayEnd(struct ImGuiListClipper *clipper);

//ImDrawList
extern int ImDrawList_GetVertexBufferSize(struct ImDrawList *list);
extern struct ImDrawVert *ImDrawList_GetVertexPtr(struct ImDrawList *list, int n);
extern int ImDrawList_GetIndexBufferSize(struct ImDrawList *list);
extern ImDrawIdx *ImDrawList_GetIndexPtr(struct ImDrawList *list, int n);
extern int ImDrawList_GetCmdSize(struct ImDrawList *list);
extern struct ImDrawCmd *ImDrawList_GetCmdPtr(struct ImDrawList *list, int n);

extern void ImDrawList_Clear(struct ImDrawList *list);
extern void ImDrawList_ClearFreeMemory(struct ImDrawList *list);
extern void ImDrawList_PushClipRect(struct ImDrawList *list, struct ImVec2 clip_rect_min, struct ImVec2 clip_rect_max, bool intersect_with_current_clip_rect);
extern void ImDrawList_PushClipRectFullScreen(struct ImDrawList *list);
extern void ImDrawList_PopClipRect(struct ImDrawList *list);
extern void ImDrawList_PushTextureID(struct ImDrawList *list, const ImTextureID texture_id);
extern void ImDrawList_PopTextureID(struct ImDrawList *list);
extern void ImDrawList_GetClipRectMin(struct ImVec2 *pOut, struct ImDrawList *list);
extern void ImDrawList_GetClipRectMax(struct ImVec2 *pOut, struct ImDrawList *list);

// Primitives
extern void ImDrawList_AddLine(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, ImU32 col, float thickness);
extern void ImDrawList_AddRect(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, ImU32 col, float rounding, int rounding_corners_flags, float thickness);
extern void ImDrawList_AddRectFilled(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, ImU32 col, float rounding, int rounding_corners_flags);
extern void ImDrawList_AddRectFilledMultiColor(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, ImU32 col_upr_left, ImU32 col_upr_right, ImU32 col_bot_right, ImU32 col_bot_left);
extern void ImDrawList_AddQuad(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, const struct ImVec2 d, ImU32 col, float thickness);
extern void ImDrawList_AddQuadFilled(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, const struct ImVec2 d, ImU32 col);
extern void ImDrawList_AddTriangle(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, ImU32 col, float thickness);
extern void ImDrawList_AddTriangleFilled(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, ImU32 col);
extern void ImDrawList_AddCircle(struct ImDrawList *list, const struct ImVec2 centre, float radius, ImU32 col, int num_segments, float thickness);
extern void ImDrawList_AddCircleFilled(struct ImDrawList *list, const struct ImVec2 centre, float radius, ImU32 col, int num_segments);
extern void ImDrawList_AddText(struct ImDrawList *list, const struct ImVec2 pos, ImU32 col, const char *text_begin, const char *text_end);
extern void ImDrawList_AddTextExt(struct ImDrawList *list, const struct ImFont *font, float font_size, const struct ImVec2 pos, ImU32 col, const char *text_begin, const char *text_end, float wrap_width, const struct ImVec4 *cpu_fine_clip_rect);
extern void ImDrawList_AddImage(struct ImDrawList *list, ImTextureID user_texture_id, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 uv_a, const struct ImVec2 uv_b, ImU32 col);
extern void ImDrawList_AddImageQuad(struct ImDrawList *list, ImTextureID user_texture_id, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, const struct ImVec2 d, const struct ImVec2 uv_a, const struct ImVec2 uv_b, const struct ImVec2 uv_c, const struct ImVec2 uv_d, ImU32 col);
extern void ImDrawList_AddImageRounded(struct ImDrawList *list, ImTextureID user_texture_id, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 uv_a, const struct ImVec2 uv_b, ImU32 col, float rounding, int rounding_corners);
extern void ImDrawList_AddPolyline(struct ImDrawList *list, const struct ImVec2 *points, const int num_points, ImU32 col, bool closed, float thickness);
extern void ImDrawList_AddConvexPolyFilled(struct ImDrawList *list, const struct ImVec2 *points, const int num_points, ImU32 col);
extern void ImDrawList_AddBezierCurve(struct ImDrawList *list, const struct ImVec2 pos0, const struct ImVec2 cp0, const struct ImVec2 cp1, const struct ImVec2 pos1, ImU32 col, float thickness, int num_segments);

// Stateful path API, add points then finish with PathFill() or PathStroke()
extern void ImDrawList_PathClear(struct ImDrawList *list);
extern void ImDrawList_PathLineTo(struct ImDrawList *list, const struct ImVec2 pos);
extern void ImDrawList_PathLineToMergeDuplicate(struct ImDrawList *list, const struct ImVec2 pos);
extern void ImDrawList_PathFillConvex(struct ImDrawList *list, ImU32 col);
extern void ImDrawList_PathStroke(struct ImDrawList *list, ImU32 col, bool closed, float thickness);
extern void ImDrawList_PathArcTo(struct ImDrawList *list, const struct ImVec2 centre, float radius, float a_min, float a_max, int num_segments);
extern void ImDrawList_PathArcToFast(struct ImDrawList *list, const struct ImVec2 centre, float radius, int a_min_of_12, int a_max_of_12); // Use precomputed angles for a 12 steps circle
extern void ImDrawList_PathBezierCurveTo(struct ImDrawList *list, const struct ImVec2 p1, const struct ImVec2 p2, const struct ImVec2 p3, int num_segments);
extern void ImDrawList_PathRect(struct ImDrawList *list, const struct ImVec2 rect_min, const struct ImVec2 rect_max, float rounding, int rounding_corners_flags);

// Channels
extern void ImDrawList_ChannelsSplit(struct ImDrawList *list, int channels_count);
extern void ImDrawList_ChannelsMerge(struct ImDrawList *list);
extern void ImDrawList_ChannelsSetCurrent(struct ImDrawList *list, int channel_index);

// Advanced
extern void ImDrawList_AddCallback(struct ImDrawList *list, ImDrawCallback callback, void *callback_data); // Your rendering function must check for 'UserCallback' in ImDrawCmd and call the function instead of rendering triangles.
extern void ImDrawList_AddDrawCmd(struct ImDrawList *list);                                                // This is useful if you need to forcefully create a new draw call (to allow for dependent rendering / blending). Otherwise primitives are merged into the same draw-call as much as possible

// Internal helpers
extern void ImDrawList_PrimReserve(struct ImDrawList *list, int idx_count, int vtx_count);
extern void ImDrawList_PrimRect(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, ImU32 col);
extern void ImDrawList_PrimRectUV(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 uv_a, const struct ImVec2 uv_b, ImU32 col);
extern void ImDrawList_PrimQuadUV(struct ImDrawList *list, const struct ImVec2 a, const struct ImVec2 b, const struct ImVec2 c, const struct ImVec2 d, const struct ImVec2 uv_a, const struct ImVec2 uv_b, const struct ImVec2 uv_c, const struct ImVec2 uv_d, ImU32 col);
extern void ImDrawList_PrimWriteVtx(struct ImDrawList *list, const struct ImVec2 pos, const struct ImVec2 uv, ImU32 col);
extern void ImDrawList_PrimWriteIdx(struct ImDrawList *list, ImDrawIdx idx);
extern void ImDrawList_PrimVtx(struct ImDrawList *list, const struct ImVec2 pos, const struct ImVec2 uv, ImU32 col);
extern void ImDrawList_UpdateClipRect(struct ImDrawList *list);
extern void ImDrawList_UpdateTextureID(struct ImDrawList *list);

// ImDrawData
extern void ImDrawData_DeIndexAllBuffers(struct ImDrawData *drawData);
extern void ImDrawData_ScaleClipRects(struct ImDrawData *drawData, const struct ImVec2 sc);

// ImFontAtlas
extern void ImFontAtlas_GetTexDataAsRGBA32(struct ImFontAtlas *atlas, unsigned char **out_pixels, int *out_width, int *out_height, int *out_bytes_per_pixel);
extern void ImFontAtlas_GetTexDataAsAlpha8(struct ImFontAtlas *atlas, unsigned char **out_pixels, int *out_width, int *out_height, int *out_bytes_per_pixel);
extern void ImFontAtlas_SetTexID(struct ImFontAtlas *atlas, ImTextureID id);
extern struct ImFont *ImFontAtlas_AddFont(struct ImFontAtlas *atlas, const struct ImFontConfig *font_cfg);
extern struct ImFont *ImFontAtlas_AddFontDefault(struct ImFontAtlas *atlas, const struct ImFontConfig *font_cfg);
extern struct ImFont *ImFontAtlas_AddFontFromFileTTF(struct ImFontAtlas *atlas, const char *filename, float size_pixels, const struct ImFontConfig *font_cfg, const ImWchar *glyph_ranges);
extern struct ImFont *ImFontAtlas_AddFontFromMemoryTTF(struct ImFontAtlas *atlas, void *font_data, int font_size, float size_pixels, const struct ImFontConfig *font_cfg, const ImWchar *glyph_ranges);
extern struct ImFont *ImFontAtlas_AddFontFromMemoryCompressedTTF(struct ImFontAtlas *atlas, const void *compressed_font_data, int compressed_font_size, float size_pixels, const struct ImFontConfig *font_cfg, const ImWchar *glyph_ranges);
extern struct ImFont *ImFontAtlas_AddFontFromMemoryCompressedBase85TTF(struct ImFontAtlas *atlas, const char *compressed_font_data_base85, float size_pixels, const struct ImFontConfig *font_cfg, const ImWchar *glyph_ranges);
extern void ImFontAtlas_ClearTexData(struct ImFontAtlas *atlas);
extern void ImFontAtlas_Clear(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesDefault(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesKorean(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesJapanese(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesChinese(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesCyrillic(struct ImFontAtlas *atlas);
extern const ImWchar *ImFontAtlas_GetGlyphRangesThai(struct ImFontAtlas *atlas);

extern ImTextureID ImFontAtlas_GetTexID(struct ImFontAtlas *atlas);
extern unsigned char *ImFontAtlas_GetTexPixelsAlpha8(struct ImFontAtlas *atlas);
extern unsigned int *ImFontAtlas_GetTexPixelsRGBA32(struct ImFontAtlas *atlas);
extern int ImFontAtlas_GetTexWidth(struct ImFontAtlas *atlas);
extern int ImFontAtlas_GetTexHeight(struct ImFontAtlas *atlas);
extern int ImFontAtlas_GetTexDesiredWidth(struct ImFontAtlas *atlas);
extern void ImFontAtlas_SetTexDesiredWidth(struct ImFontAtlas *atlas, int TexDesiredWidth_);
extern int ImFontAtlas_GetTexGlyphPadding(struct ImFontAtlas *atlas);
extern void ImFontAtlas_SetTexGlyphPadding(struct ImFontAtlas *atlas, int TexGlyphPadding_);
extern void ImFontAtlas_GetTexUvWhitePixel(struct ImFontAtlas *atlas, struct ImVec2 *pOut);

// ImFontAtlas::Fonts;
extern int ImFontAtlas_Fonts_size(struct ImFontAtlas *atlas);
extern struct ImFont *ImFontAtlas_Fonts_index(struct ImFontAtlas *atlas, int index);

// ImFont
extern float ImFont_GetFontSize(const struct ImFont *font);
extern void ImFont_SetFontSize(struct ImFont *font, float FontSize_);
extern float ImFont_GetScale(const struct ImFont *font);
extern void ImFont_SetScale(struct ImFont *font, float Scale_);
extern void ImFont_GetDisplayOffset(const struct ImFont *font, struct ImVec2 *pOut);
extern const struct Glyph *ImFont_GetFallbackGlyph(const struct ImFont *font);
extern void ImFont_SetFallbackGlyph(struct ImFont *font, const struct Glyph *FallbackGlyph_);
extern float ImFont_GetFallbackAdvanceX(const struct ImFont *font);
extern ImWchar ImFont_GetFallbackChar(const struct ImFont *font);
extern short ImFont_GetConfigDataCount(const struct ImFont *font);
extern struct ImFontConfig *ImFont_GetConfigData(struct ImFont *font);
extern struct ImFontAtlas *ImFont_GetContainerAtlas(struct ImFont *font);
extern float ImFont_GetAscent(const struct ImFont *font);
extern float ImFont_GetDescent(const struct ImFont *font);
extern int ImFont_GetMetricsTotalSurface(const struct ImFont *font);
extern void ImFont_ClearOutputData(struct ImFont *font);
extern void ImFont_BuildLookupTable(struct ImFont *font);
extern const struct Glyph *ImFont_FindGlyph(const struct ImFont *font, ImWchar c);
extern void ImFont_SetFallbackChar(struct ImFont *font, ImWchar c);
extern float ImFont_GetCharAdvance(const struct ImFont *font, ImWchar c);
extern bool ImFont_IsLoaded(const struct ImFont *font);
extern const char *ImFont_GetDebugName(const struct ImFont *font);
extern void ImFont_CalcTextSizeA(const struct ImFont *font, struct ImVec2 *pOut, float size, float max_width, float wrap_width, const char *text_begin, const char *text_end, const char **remaining); // utf8
extern const char *ImFont_CalcWordWrapPositionA(const struct ImFont *font, float scale, const char *text, const char *text_end, float wrap_width);
extern void ImFont_RenderChar(const struct ImFont *font, struct ImDrawList *draw_list, float size, struct ImVec2 pos, ImU32 col, unsigned short c);
extern void ImFont_RenderText(const struct ImFont *font, struct ImDrawList *draw_list, float size, struct ImVec2 pos, ImU32 col, const struct ImVec4 *clip_rect, const char *text_begin, const char *text_end, float wrap_width, bool cpu_fine_clip);
// ImFont::Glyph
extern int ImFont_Glyphs_size(const struct ImFont *font);
extern struct Glyph *ImFont_Glyphs_index(struct ImFont *font, int index);
// ImFont::IndexXAdvance
extern int ImFont_IndexXAdvance_size(const struct ImFont *font);
extern float ImFont_IndexXAdvance_index(const struct ImFont *font, int index);
// ImFont::IndexLookup
extern int ImFont_IndexLookup_size(const struct ImFont *font);
extern unsigned short ImFont_IndexLookup_index(const struct ImFont *font, int index);
]]


--
-- FFI
--

local ffi = require 'ffi'

ffi.cdef(cDefs)

local C = ffi.C

-- Turns out we can pick sane default arguments across all functions, so this works out...
local commonDefaults = {
    alpha_mul = '1',
    also_over_items = 'true',
    bg_col = '{ 0, 0, 0, 0 }',
    border = 'true',
    border_col = '{ 0, 0, 0, 0 }',
    button = '0',
    callback = 'nil',
    capture = 'true',
    center_y_ratio = '0.5',
    clip = 'true',
    column_index = '-1',
    cond = '0',
    count = '1',
    custom_callback = 'nil',
    custom_callback_data = 'nil',
    decimal_precision = '-1',
    display_format = 'nil',
    display_format_max = 'nil',
    dst = 'nil',
    enabled = 'true',
    extra_flags = '0',
    filename = 'nil',
    flags = '0',
    float_format = 'nil',
    frame_padding = '-1',
    graph_size = '{ 0, 0 }',
    height_in_items = '-1',
    hide_text_after_double_hash = 'false',
    id = 'nil',
    indent_w = '0',
    lock_threshold = '-1',
    max_depth = '-1',
    mouse_button = '0', -- We're biased toward touch devices
    mouse_pos = 'nil',
    offset = '0',
    on_edge = 'false',
    outward = '0',
    overlay = 'nil',
    overlay_text = 'nil',
    p_open = 'nil',
    pivot = '{ 0, 0 }',
    popup_max_height_in_items = '-1',
    pos_x = '0',
    power = '1',
    ptr_id = 'nil',
    ref = 'nil',
    ref_col = 'nil',
    scale_max = 'math.huge',
    scale_min = 'math.huge',
    selected = 'false',
    shortcut = 'nil',
    size = '{ 0, 0 }',
    size_arg = '{ -1, 0 }',
    spacing_w = '-1',
    step = '0',
    step_fast = '0',
    str_id = 'nil',
    text_end = 'nil',
    tint_col = '{ 1, 1, 1, 1 }',
    user_data = 'nil',
    uv0 = '{ 0, 0 }',
    uv1 = '{ 1, 1 }',
    v_degrees_max = '360',
    v_degrees_min = '-360',
    v_max = '0',
    v_min = '0',
    v_speed = '1',
    values_offset = '0',
    wrap_pos_x = '0',
    wrap_width = '-1',
}

local reservedIdentifiers = {
    ['and'] = true,
    ['break'] = true,
    ['do'] = true,
    ['else'] = true,
    ['elseif'] = true,
    ['end'] = true,
    ['false'] = true,
    ['for'] = true,
    ['function'] = true,
    ['if'] = true,
    ['in'] = true,
    ['local'] = true,
    ['nil'] = true,
    ['not'] = true,
    ['or'] = true,
    ['repeat'] = true,
    ['return'] = true,
    ['then'] = true,
    ['true'] = true,
    ['until'] = true,
    ['while'] = true,
    ['type'] = true,
}

-- Generates code for Lua wrappers for the C functions. While it's weird that we actually generate
-- strings and compile them, the statically-known layout of their arguments allows JIT'ing so this
-- may be good.
local function bind(name, cRetType, cName, cArgs)
    -- Save metadata about each C argument type:
    --   `ptrType`: The FFI `ctype` for boxed storage for pointers
    --   `outOnly`: Whether meant for output only
    --   `vec2`: Whether an `ImVec2` parameter (to pack / unpack raw number arguments / returns)
    --   `vec4`: Whether an `ImVec2` parameter (to pack / unpack raw number arguments / returns)
    local cArgMetas = {}
    for cArg in (cArgs .. ','):gmatch('%s*([^,()]+,)') do
        local cArgMeta = {}
        if cArg == '...,' then
            break -- ImGui only uses variadics for string formatting, just use Lua for that...
        else
            local cArgType, cArgName = cArg:match('(.-)%s*([%w_]+),')
            if cArgType == nil then -- Multi-element box for array types
                local cArgArrayCount
                cArgType, cArgName, cArgArrayCount = cArg:match('(.-)%s*([%w_]+)%[(%d+)%],')
                cArgMeta.ptrType = cArgType .. '[' .. cArgArrayCount .. ']'
                cArgMeta.arrayCount = tonumber(cArgArrayCount)
            end
            if cArgType:match('char.*%*.*%*') then return false end -- TODO: Sequence of strings
            if cArgType:match(' %*$') and
                    not cArgType:match('char') and
                    not cArgType:match('void') then -- Single-element box
                cArgMeta.ptrType = cArgType:gsub(' %*$', '[1]')
            end
            if (cArgName:match('^out') or cArgName:match('Out$')) and cArgMeta.ptrType then
                cArgMeta.outOnly = true -- Box is for output only
            end
            if cArgType:match('Vec2') then cArgMeta.vec2 = true end
            if cArgType:match('Vec4') then cArgMeta.vec4 = true end
            if cArgType:match('^ImGui') and
                    not cArgType:match('^ImGuiID') and
                    not cArgType:match('Callback$') then
                if cArgType:match('Flags$') then
                    cArgMeta.flagsType = cArgType
                else
                    cArgMeta.enumType = cArgType
                end
            end
            cArgMeta.name = reservedIdentifiers[cArgName] and 'set_' .. cArgName or cArgName
            cArgMeta.name = cArgMeta.name:gsub('_(.)', string.upper) -- camelCase!
            cArgMeta.default = commonDefaults[cArgName]
        end
        table.insert(cArgMetas, cArgMeta)
    end

    -- Collect some documentation while we're at it
    local doc = '- `' .. name .. '('

    -- Name formal parameters, with 'unpacked' names
    local argList = ''
    for i, meta in ipairs(cArgMetas) do
        if not meta.outOnly then
            local arg = ''
            if meta.arrayCount then
                for j = 1, meta.arrayCount do
                    arg = arg .. meta.name .. j .. (j < meta.arrayCount and ', ' or '')
                end
            elseif meta.vec2 then
                arg = arg .. meta.name .. 'X, '
                arg = arg .. meta.name .. 'Y'
            elseif meta.vec4 then
                arg = arg .. meta.name .. 'X, '
                arg = arg .. meta.name .. 'Y, '
                arg = arg .. meta.name .. 'Z, '
                arg = arg .. meta.name .. 'W'
            else
                arg = arg .. meta.name
            end

            argList = argList .. arg .. ', '
            if meta.default then
                doc = doc .. '[' .. arg .. ' = ' .. meta.default:gsub('{ ', ''):gsub(' }', '') .. '], '
            else
                doc = doc .. arg .. ', '
            end
        end
    end
    local body = 'return function(...)\n'
    argList = argList:gsub(', $', '')
    if argList ~= '' then
        body = body .. 'local ' .. argList .. ' = ...\n'
    end
    doc = doc:gsub(', $', '') .. ')'

    -- If we got fewer parameters than expected, check if the last one was an 'options' table
    if #cArgMetas > 1 then
        local _, nExpectedArgs = body:gsub(',', ',')
        nExpectedArgs = nExpectedArgs + 1
        body = body .. 'local NARGS = select("#", ...)\n'
        body = body .. 'local OPTS\n'
        body = body .. 'if NARGS > 0 and NARGS < ' .. nExpectedArgs .. ' then OPTS = select(NARGS, ...) end\n'
        body = body .. 'if type(OPTS) == "table" then\n'
        body = body .. argList .. ' = '
        local i = 0
        body = body .. argList:gsub('[^ ,]+', function(arg)
            i = i + 1
            return 'NARGS > ' .. i .. ' and ' .. arg .. ' or nil'
        end)
        body = body .. '\n' .. argList .. ' = '
        body = body .. argList:gsub('[^ ,]+', function(arg)
            return arg .. ' or OPTS.' .. arg
        end)
        body = body .. '\nend\n'
    end

    -- Convert enums
    for i, meta in ipairs(cArgMetas) do
        if meta.enumType then
            body = body .. 'if ' .. meta.name .. ' ~= nil then '
            body = body .. meta.name .. ' = L_C["' .. meta.enumType .. '_" .. ' .. meta.name .. '] '
            body = body .. 'end\n'
        end
    end

    -- Convert flags
    for i, meta in ipairs(cArgMetas) do
        if meta.flagsType then
            body = body .. 'if ' .. meta.name .. ' ~= nil then\n'
            body = body .. 'local FLAGS = 0\n'
            body = body .. 'for k, v in pairs(' .. meta.name .. ') do '
            body = body .. 'if v then '
            body = body .. 'FLAGS = L_bor(FLAGS, L_C["' .. meta.flagsType .. '_" .. k]) '
            body = body .. 'end '
            body = body .. 'end\n'
            body = body .. meta.name .. ' = FLAGS\n'
            body = body .. 'end\n'
        end
    end

    -- Name local variables for packed types and output-only types
    for i, meta in ipairs(cArgMetas) do
        if meta.outOnly or meta.arrayCount or meta.vec2 or meta.vec4 then
            body = body .. 'local ' .. meta.name .. '\n'
        end
    end

    -- Pack unpacked arguments, handle defaults
    for i, meta in ipairs(cArgMetas) do
        if not meta.outOnly then
            local default = meta.default or
                    "error(\"[imgui] " .. name .. "(): argument '" .. meta.name .. "' is required!\")"
            if meta.arrayCount then
                body = body .. 'if ' .. meta.name .. '1 == nil then ' .. default .. ' end\n'
                body = body .. meta.name .. ' = { '
                for j = 1, meta.arrayCount do
                    body = body .. meta.name .. j .. (j < meta.arrayCount and ', ' or '')
                end
                body = body .. ' }\n'
            elseif meta.vec2 then
                body = body .. 'if ' .. meta.name .. 'X == nil then '
                body = body .. meta.name .. ' = ' .. default .. ' '
                body = body .. 'else ' .. meta.name .. ' = { '
                body = body .. meta.name .. 'X, '
                body = body .. meta.name .. 'Y } end\n'
            elseif meta.vec4 then
                body = body .. 'if ' .. meta.name .. 'X == nil then '
                body = body .. meta.name .. ' = ' .. default .. ' '
                body = body .. 'else ' .. meta.name .. ' = { '
                body = body .. meta.name .. 'X, '
                body = body .. meta.name .. 'Y, '
                body = body .. meta.name .. 'Z, '
                body = body .. meta.name .. 'W } end\n'
            elseif default ~= 'nil' then -- Missing args are already `nil`
                body = body .. 'if ' .. meta.name .. ' == nil then '
                body = body .. meta.name .. ' = ' .. default .. ' end\n'
            end
        end
    end

    -- Create boxes
    for i, meta in ipairs(cArgMetas) do
        if meta.ptrType then
            if meta.outOnly then
                body = body .. meta.name .. ' = L_ffi.new("' .. meta.ptrType .. '")\n'
            else -- Can pass `nil` for values to box, eg. `p_open` in `Begin(...)`
                body = body .. meta.name .. ' = ' .. meta.name .. ' ~= nil and L_ffi.new("'
                body = body .. meta.ptrType .. '", ' .. meta.name .. ') or nil\n'
            end
        end
    end

    -- Call!
    body = body .. 'local RET = L_C.' .. cName .. '('
    for i, meta in ipairs(cArgMetas) do
        body = body .. meta.name
        if i < #cArgMetas then
            body = body .. ', '
        end
    end
    body = body .. ')\n'

    -- Return unboxed values followed by the original return value
    body = body .. 'return '
    doc = doc .. '` -> `'
    for i, meta in ipairs(cArgMetas) do
        if meta.ptrType then
            if meta.arrayCount then
                for j = 1, meta.arrayCount do
                    body = body .. meta.name .. '[' .. (j - 1) .. '], '
                    doc = doc .. meta.name .. j .. ', '
                end
            elseif meta.vec2 then
                body = body .. meta.name .. '[0].x, '
                body = body .. meta.name .. '[0].y, '
                doc = doc .. meta.name .. 'X, '
                doc = doc .. meta.name .. 'Y, '
            elseif meta.vec4 then
                body = body .. meta.name .. '[0].x, '
                body = body .. meta.name .. '[0].y, '
                body = body .. meta.name .. '[0].z, '
                body = body .. meta.name .. '[0].w, '
                doc = doc .. meta.name .. 'X, '
                doc = doc .. meta.name .. 'Y, '
                doc = doc .. meta.name .. 'Z, '
                doc = doc .. meta.name .. 'W, '
            else
                body = body .. meta.name .. ' and ' .. meta.name .. '[0], '
                doc = doc .. meta.name .. ', '
            end
        end
    end
    body = body .. 'RET\n'
    doc = doc .. cRetType .. '`'
    doc = doc:gsub('-> void', ''):gsub(', void', '')

    body = body .. 'end'

    -- Allow printing documentation and debug info -- works when headless too!
    if arg[1] == '--imgui-doc' or arg[1] == '--imgui-dump' then
        print(doc)
        if arg[1] == '--imgui-dump' then
            print(body .. '\n')
        end
    end

    -- Load! The `L_` is to prevent clashes with generated C-based argument names.
    ig[name] = load([[
    local L_ffi = require "ffi"
    local L_C = L_ffi.C
    local L_bor = bit.bor
    ]] .. body, name)()

    return true
end

-- Bind from each declaration.
for cDecl in cDefs:gmatch('extern[^\n]+;') do
    local bound = false
    if cDecl:match('extern[^\n]+%([^\n()]*%);') then -- Skip function pointers
        cDecl = cDecl:gsub('* ', ' *') -- Normalize 'T* v' pointer format to 'T *v'
        local cRetType, cName, cArgs = cDecl:match('extern (.-)%s*([%w_]+)%((.*)%);')
        if cName:match('^ig') then -- Only bind `ig*` functions for now (no 'methods')
            local name = cName:gsub('^ig', ''):gsub('^.', string.lower)
            bound = bind(name, cRetType, cName, cArgs)
        end
    end
    --    if not bound and cDecl:match('%sig') then print(cDecl) end
end


--
-- Wrappers
--

-- Copy `{begin,end}(...)` `{begin,end}Window(...)` since `end` is a keyword in Lua

ig.beginWindow = ig['begin']
ig.endWindow = ig['end']

-- Wrap `inputText{,Multiline}` since `char *` string buffers aren't automatically handled

local igInputText = ig.inputText
function ig.inputText(label, contents, ...)
    local bufSize = #contents + 128
    local buf = ffi.new('char [?]', bufSize, contents)
    local r = igInputText(label, buf, bufSize, ...)
    return ffi.string(buf), r
end

local igInputTextMultiline = ig.inputTextMultiline
function ig.inputTextMultiline(label, contents, ...)
    local bufSize = #contents + 512
    local buf = ffi.new('char [?]', bufSize, contents)
    local r = igInputTextMultiline(label, buf, bufSize, ...)
    return ffi.string(buf), r
end

-- Wrap `setDragDropPayload` / `acceptDragDropPayload` to use strings for the payload

local igSetDragDropPayload = ig.setDragDropPayload
function ig.setDragDropPayload(type, data, cond)
    return igSetDragDropPayload(type, data, #data, cond)
end

local igAcceptDragDropPayload = ig.acceptDragDropPayload
function ig.acceptDragDropPayload(setType, flags)
    local payload = igAcceptDragDropPayload(setType, flags)
    if payload ~= nil then return ffi.string(payload.Data, payload.DataSize) end
end


--
-- I/O + Draw implementation for Love (https://love2d.org/)
--

ig.love = {}

local fontAtlasTexture -- Main font texture given to us by ImGui
local scrollVelocityY = 0

local keyMap = {
    tab = C.ImGuiKey_Tab,
    left = C.ImGuiKey_LeftArrow,
    right = C.ImGuiKey_RightArrow,
    up = C.ImGuiKey_UpArrow,
    down = C.ImGuiKey_DownArrow,
    pageup = C.ImGuiKey_PageUp,
    pagedown = C.ImGuiKey_PageDown,
    home = C.ImGuiKey_Home,
    ['end'] = C.ImGuiKey_End,
    delete = C.ImGuiKey_Delete,
    backspace = C.ImGuiKey_Backspace,
    ['return'] = C.ImGuiKey_Enter,
    ['kpenter'] = C.ImGuiKey_Enter,
    escape = C.ImGuiKey_Escape,
    a = C.ImGuiKey_A,
    c = C.ImGuiKey_C,
    v = C.ImGuiKey_V,
    x = C.ImGuiKey_X,
    y = C.ImGuiKey_Y,
    z = C.ImGuiKey_Z,
}

local modifierMap = {
    rshift = 'KeyShift',
    lshift = 'KeyShift',
    rctrl = 'KeyCtrl',
    lctrl = 'KeyCtrl',
    ralt = 'KeyAlt',
    lalt = 'KeyAlt',
    rgui = 'KeySuper',
    lgui = 'KeySuper',
}

local postFrameCallbacks = {}

-- Schedule a callback to run at the end of the frame
local function postFrame(callback)
    table.insert(postFrameCallbacks, callback)
end

local igIO
pcall(function() igIO = C.igGetIO() end)

local textures = {} -- Mapping of `ImTextureID` to Love texture

function ig.love.fromTexture(tex)
    table.insert(textures, tex)
    return ffi.cast('void *', ffi.new('intptr_t', #textures))
end

function ig.love.toTexture(texId)
    local index = tonumber(ffi.cast('intptr_t', texId))
    return index == 0 and fontAtlasTexture or textures[index]
end

local function clearTextures() textures = {} end

local function wrapTextureFunctions()
    local igImage = ig.image
    function ig.image(tex, ...)
        return igImage(ig.love.fromTexture(tex), ...)
    end

    local igImageButton = ig.imageButton
    function ig.imageButton(tex, ...)
        return igImageButton(ig.love.fromTexture(tex), ...)
    end
end

function ig.love.load()
    local pixels = ffi.new('unsigned char *[1]')
    local width, height = ffi.new('int[1]'), ffi.new('int[1]')
    local bytesPerPixel = ffi.new('int[1]')
    C.ImFontAtlas_GetTexDataAsRGBA32(igIO.Fonts, pixels, width, height, bytesPerPixel)
    local pixelsStr = ffi.string(pixels[0], width[0] * height[0] * bytesPerPixel[0])
    local imgData = love.image.newImageData(width[0], height[0], 'rgba8', pixelsStr)
    fontAtlasTexture = love.graphics.newImage(imgData)
    fontAtlasTexture:setFilter('nearest', 'nearest')

    love.keyboard.setKeyRepeat(true)

    for key, mapping in pairs(keyMap) do
        igIO.KeyMap[mapping] = mapping
    end

    wrapTextureFunctions()

    if love.system.getOS() ~= 'iOS' then
        igIO.GetClipboardTextFn = function(data)
            return love.system.getClipboardText()
        end
        igIO.SetClipboardTextFn = function(data, text)
            love.system.setClipboardText(ffi.string(text))
        end
    end
end

function ig.love.mousemoved(x, y)
    igIO.MousePos = { x = x, y = y }
end

function ig.love.mousepressed(x, y, button)
    scrollVelocityY = 0
    if button >= 1 and button <= 6 then
        igIO.MouseDown[button - 1] = true
    end
end

function ig.love.mousereleased(x, y, button, istouch)
    if button >= 1 and button <= 6 then
        postFrame(function()
            igIO.MouseDown[button - 1] = false

            -- See https://github.com/ocornut/imgui/issues/1470#issuecomment-348303495
            if istouch then
                postFrame(function()
                    igIO.MousePos = { x = -math.huge, y = -math.huge }
                end)
            end
        end)
    end
end

function ig.love.wheelmoved(x, y)
    scrollVelocityY = 0.18 * y
end

function ig.love.textinput(text)
    C.ImGuiIO_AddInputCharactersUTF8(text)
end

function ig.love.keypressed(key)
    if keyMap[key] ~= nil then
        igIO.KeysDown[keyMap[key]] = true
    end
    if modifierMap[key] ~= nil then
        igIO[modifierMap[key]] = true
    end
end

function ig.love.keyreleased(key)
    if keyMap[key] ~= nil or modifierMap[key] ~= nil then
        postFrame(function()
            if keyMap[key] ~= nil then
                igIO.KeysDown[keyMap[key]] = false
            end
            if modifierMap[key] ~= nil then
                igIO[modifierMap[key]] = false
            end
        end)
    end
end

function ig.love.preupdate(dt)
    local width, height = love.graphics.getDimensions()
    igIO.DisplaySize = { x = width, y = height }

    igIO.MouseWheel = scrollVelocityY
    scrollVelocityY = scrollVelocityY * 0.63
    if math.abs(scrollVelocityY) < 0.008 then
        scrollVelocityY = 0
    end

    igIO.DeltaTime = dt or love.timer.getDelta()

    for mod, mapping in pairs(modifierMap) do
        igIO[mapping] = igIO[mapping] or love.keyboard.isDown(mod)
    end

    clearTextures()

    C.igNewFrame()
end

function ig.love.postupdate()
    C.igEndFrame()

    love.keyboard.setTextInput(igIO.WantTextInput)

    -- Use a copy and clear first in case callbacks are scheduled while iterating
    local currPostFrameCallbacks = postFrameCallbacks
    postFrameCallbacks = {}
    for _, callback in ipairs(currPostFrameCallbacks) do callback() end
end

function ig.love.draw()
    C.igRender()

    -- Iterate through `ImDrawList`s
    local drawData = C.igGetDrawData()
    for drawListId = 0, (drawData.CmdListsCount - 1) do
        local drawList = drawData.CmdLists[drawListId]

        -- Convert index buffer to Lua sequence
        local indexBufferPtr = C.ImDrawList_GetIndexPtr(drawList, 0)
        local vertexMap = {}
        for i = 0, (C.ImDrawList_GetIndexBufferSize(drawList) - 1) do
            table.insert(vertexMap, indexBufferPtr[i] + 1)
        end

        -- Convert vertex buffer to Love `ImageData`
        local vertexPtr = C.ImDrawList_GetVertexPtr(drawList, 0)
        local vertexBufferSize = C.ImDrawList_GetVertexBufferSize(drawList)
        local vertexBufferBytes = vertexBufferSize * ffi.sizeof('struct ImDrawVert')
        local vertexStr = ffi.string(vertexPtr, vertexBufferBytes)
        local vertexData = love.image.newImageData(vertexBufferBytes / 4, 1, 'rgba8', vertexStr)

        -- Create Love `Mesh`
        local mesh = love.graphics.newMesh({
            { 'VertexPosition', 'float', 2 },
            { 'VertexTexCoord', 'float', 2 },
            { 'VertexColor', 'byte', 4 },
        }, vertexData, 'triangles')
        mesh:setVertexMap(vertexMap)

        -- Iterate through `ImDrawCmd`s
        local drawCmds = C.ImDrawList_GetCmdPtr(drawList, 0)
        for drawCmdId = 0, (C.ImDrawList_GetCmdSize(drawList)) do
            local drawCmd = drawCmds[drawCmdId]
            local elemCount = drawCmd.ElemCount
            if elemCount > 0 then
                -- Scissor draw area to `ClipRect`
                local clip = drawCmd.ClipRect
                love.graphics.setScissor(clip.x, clip.y,
                    clip.z - clip.x, clip.w - clip.y)

                -- Set texture mapping based on given `ImTextureID`
                mesh:setTexture(ig.love.toTexture(drawCmd.TextureId))

                -- Select next range in `Mesh` and draw!
                local lastStart, lastCount = mesh:getDrawRange()
                mesh:setDrawRange(lastStart and lastStart + lastCount or 1, elemCount)
                love.graphics.draw(mesh)
            end
        end
        mesh:setDrawRange()
        love.graphics.setScissor()
    end
end


return ig
