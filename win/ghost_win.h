extern "C" {
HWND ghostWinGetMainWindow();
HWND ghostWinGetChildWindow();
void ghostWinFocusWindow(HWND window);
extern bool ghostWinPendingChildFocus; // Whether we wanted to focus child but couldn't because
                                       // parent was inactive
}

// #define GHOST_WIN_UPDATES_URL
// L"C:\\Users\\nikki\\Development\\ghost\\megasource\\castle-releases\\win"
#define GHOST_WIN_UPDATES_URL L"https://api.castle.games/api/releases/win/win"
