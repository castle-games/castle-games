// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#include "simple_handler.h"

#import <Cocoa/Cocoa.h>

#include "include/cef_browser.h"

extern "C" void ghostMacSetMainWindow(NSWindow *);

void SimpleHandler::PlatformTitleChange(CefRefPtr<CefBrowser> browser, const CefString &title) {
  NSView *view = (NSView *)browser->GetHost()->GetWindowHandle();
  NSWindow *window = [view window];
  ghostMacSetMainWindow(window);
  std::string titleStr(title);
  NSString *str = [NSString stringWithUTF8String:titleStr.c_str()];
  [window setTitle:str];
}

void SimpleHandler::OnProtocolExecution(CefRefPtr<CefBrowser> browser, const CefString &url,
                                        bool &allow_os_execution) {
  // possible to use this snippet if we need to handle unknown schemes clicked from within ghost.
  // recommended to validate url/scheme first.
  // ghostOpenExternalUrl(url);
}
