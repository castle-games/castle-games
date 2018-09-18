#ifndef __GHOST_H__
#define __GHOST_H__

#ifdef __cplusplus
extern "C" {
#endif

void ghostOpenUri(const char *uri);
void ghostClose();
void ghostUpdateChildWindowFrame();
void ghostResizeChildWindow(float dw, float dh);
void ghostSetChildWindowFrame(float left, float top, float width, float height);

#ifdef __cplusplus
}
#endif

#endif
