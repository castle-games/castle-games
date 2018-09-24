#ifndef __GHOST_H__
#define __GHOST_H__

#ifdef __cplusplus
extern "C" {
#endif

// handler for when the user opened any ghost url from native code.
void ghostHandleOpenUri(const char *uri);

// boot a love instance with the given initial uri.
void ghostOpenLoveUri(const char *uri);

void ghostClose();
void ghostUpdateChildWindowFrame();
void ghostResizeChildWindow(float dw, float dh);
void ghostSetChildWindowFrame(float left, float top, float width, float height);

#ifdef __cplusplus
}
#endif

#endif
