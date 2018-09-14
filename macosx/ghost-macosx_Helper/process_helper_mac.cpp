// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that can
// be found in the LICENSE file.

#include "include/cef_app.h"

#include "include/wrapper/cef_message_router.h"

class HelperApp : public CefApp, public CefRenderProcessHandler {
public:
  virtual CefRefPtr<CefRenderProcessHandler> GetRenderProcessHandler() OVERRIDE { return this; }

  // CefRenderProcessHandler methods:
  void OnWebKitInitialized() OVERRIDE {
    // Create the renderer-side router for query handling.
    CefMessageRouterConfig config;
    message_router_ = CefMessageRouterRendererSide::Create(config);
  }

  void OnContextCreated(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame,
                        CefRefPtr<CefV8Context> context) OVERRIDE {
    message_router_->OnContextCreated(browser, frame, context);
  }

  void OnContextReleased(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame,
                         CefRefPtr<CefV8Context> context) OVERRIDE {
    message_router_->OnContextReleased(browser, frame, context);
  }

  bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser, CefProcessId source_process,
                                CefRefPtr<CefProcessMessage> message) OVERRIDE {
    return message_router_->OnProcessMessageReceived(browser, source_process, message);
  }

private:
  CefRefPtr<CefMessageRouterRendererSide> message_router_;

  // Include the default reference counting implementation.
  IMPLEMENT_REFCOUNTING(HelperApp);
};

// Entry point function for sub-processes.
int main(int argc, char *argv[]) {
  // Provide CEF with command-line arguments.
  CefMainArgs main_args(argc, argv);

  CefRefPtr<HelperApp> app(new HelperApp());

  // Execute the sub-process.
  return CefExecuteProcess(main_args, app, NULL);
}
