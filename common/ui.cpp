#include "imgui.h"
#define IMGUI_DEFINE_MATH_OPERATORS
#include "imgui_internal.h"

using namespace ImGui;


#ifdef _MSC_VER
#define EXPORT extern "C" __declspec(dllexport)
#else
#define EXPORT extern "C" __attribute__((visibility("default")))
#endif


// Based on https://github.com/ocornut/imgui/issues/319#issuecomment-345795629
EXPORT bool uiSplitter(const char *sub_id, bool splitVertically, float thickness,
    float *size1, float *size2, float minSize1, float minSize2,
    float splitterLongAxisSize)
{
    ImGuiContext& g = *GImGui;
    ImGuiWindow* window = g.CurrentWindow;
    ImGuiID id = window->GetID(sub_id);
    ImRect bb;
    bb.Min = window->DC.CursorPos + (splitVertically ? ImVec2(*size1, 0.0f) : ImVec2(0.0f, *size1));
    bb.Max = bb.Min + CalcItemSize(splitVertically ?
        ImVec2(thickness, splitterLongAxisSize) :
        ImVec2(splitterLongAxisSize, thickness), 0.0f, 0.0f);
    return SplitterBehavior(id, bb, splitVertically ? ImGuiAxis_X : ImGuiAxis_Y,
        size1, size2, minSize1, minSize2,
        4.0f);
}
