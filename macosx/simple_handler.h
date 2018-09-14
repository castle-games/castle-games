// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.

#ifndef CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_
#define CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_

#include "include/cef_client.h"
#include "include/wrapper/cef_message_router.h"

#include <list>

class SimpleHandler : public CefClient,
                      public CefDisplayHandler,
                      public CefLifeSpanHandler,
                      public CefLoadHandler,
                      public CefRequestHandler {
public:
  explicit SimpleHandler(bool use_views);
  ~SimpleHandler();

  // Provide access to the single global instance of this object.
  static SimpleHandler *GetInstance();

  // CefClient methods:
  virtual CefRefPtr<CefDisplayHandler> GetDisplayHandler() OVERRIDE { return this; }
  virtual CefRefPtr<CefLifeSpanHandler> GetLifeSpanHandler() OVERRIDE { return this; }
  virtual CefRefPtr<CefLoadHandler> GetLoadHandler() OVERRIDE { return this; }
  virtual CefRefPtr<CefRequestHandler> GetRequestHandler() OVERRIDE { return this; }
  bool OnProcessMessageReceived(CefRefPtr<CefBrowser> browser, CefProcessId source_process,
                                CefRefPtr<CefProcessMessage> message) OVERRIDE;

  // CefDisplayHandler methods:
  virtual void OnTitleChange(CefRefPtr<CefBrowser> browser, const CefString &title) OVERRIDE;

  // CefLifeSpanHandler methods:
  virtual void OnAfterCreated(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual bool DoClose(CefRefPtr<CefBrowser> browser) OVERRIDE;
  virtual void OnBeforeClose(CefRefPtr<CefBrowser> browser) OVERRIDE;

  // CefLoadHandler methods:
  virtual void OnLoadError(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame,
                           ErrorCode errorCode, const CefString &errorText,
                           const CefString &failedUrl) OVERRIDE;

  // CefRequestHandler methods:
  bool OnBeforeBrowse(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame,
                      CefRefPtr<CefRequest> request, bool user_gesture, bool is_redirect) OVERRIDE;
  void OnRenderProcessTerminated(CefRefPtr<CefBrowser> browser, TerminationStatus status) OVERRIDE;

  // Request that all existing browser windows close.
  void CloseAllBrowsers(bool force_close);

  bool IsClosing() const { return is_closing_; }

private:
  // Platform-specific implementation.
  void PlatformTitleChange(CefRefPtr<CefBrowser> browser, const CefString &title);

  // True if the application is using the Views framework.
  const bool use_views_;

  // List of existing browser windows. Only accessed on the CEF UI thread.
  typedef std::list<CefRefPtr<CefBrowser>> BrowserList;
  BrowserList browser_list_;

  bool is_closing_;

  CefRefPtr<CefMessageRouterBrowserSide> message_router_;
  scoped_ptr<CefMessageRouterBrowserSide::Handler> message_handler_;

  // Include the default reference counting implementation.
  IMPLEMENT_REFCOUNTING(SimpleHandler);
};

#endif // CEF_TESTS_CEFSIMPLE_SIMPLE_HANDLER_H_
