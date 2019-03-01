// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "ghost.h"
#include "ghost_constants.h"
#include "simple_handler.h"

#include <CommCtrl.h>
#include <string>
#include <windows.h>

#include "include/cef_browser.h"

#define ICON_ID  1

#define FILE_MENU_OPEN 1

extern "C" {
void ghostWinSetMainWindow(HWND window);
}

void AddMenus(HWND hwnd) {
  HMENU hMenubar;
  HMENU hMenu;

  hMenubar = CreateMenu();
  hMenu = CreateMenu();

  AppendMenu(hMenu, MF_STRING, FILE_MENU_OPEN, L"&Open Project...");

  AppendMenu(hMenubar, MF_POPUP, (UINT_PTR)hMenu, L"&File");
  SetMenu(hwnd, hMenubar);
}

LRESULT CALLBACK GhostSubclassProc(HWND hwnd, UINT msg, WPARAM w_param, LPARAM l_param, UINT_PTR subclass_id, DWORD_PTR ref_data) {
  switch (msg) {
  case WM_COMMAND:
    // WM_COMMAND is sent when the user clicks on a menu
    switch (LOWORD(w_param)) {
    case FILE_MENU_OPEN:
      std::stringstream params;
      params << "{ action: \"" << kGhostMenuFileOpenAction << "\" }";
      ghostSendJSEvent(kGhostNativeMenuSelectedEventName, params.str().c_str());
      break;
    }
    break;
  }
  UNREFERENCED_PARAMETER(ref_data);
  return DefSubclassProc(hwnd, msg, w_param, l_param);
}

void SimpleHandler::PlatformTitleChange(CefRefPtr<CefBrowser> browser, const CefString &title) {
  CefWindowHandle hwnd = browser->GetHost()->GetWindowHandle();
  ghostWinSetMainWindow(hwnd);
  SetWindowText(hwnd, std::wstring(title).c_str());

  HINSTANCE hInstance = (HINSTANCE)GetWindowLong(hwnd, GWL_HINSTANCE);
  HICON hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(ICON_ID));
  SendMessage(hwnd, WM_SETICON, ICON_SMALL, (LPARAM)hIcon);
  SendMessage(hwnd, WM_SETICON, ICON_BIG, (LPARAM)hIcon);
}

void SimpleHandler::SubclassWndProc(CefWindowHandle hwnd) {
  SetWindowSubclass(hwnd, GhostSubclassProc, 1, reinterpret_cast<DWORD_PTR>(this));
  AddMenus(hwnd);
}