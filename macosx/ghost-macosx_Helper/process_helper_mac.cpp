// Copyright (c) 2013 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that can
// be found in the LICENSE file.

#include "include/cef_app.h"

class HelperApp : public CefApp,
                  public CefRenderProcessHandler {
public:
  virtual CefRefPtr<CefRenderProcessHandler>
  GetRenderProcessHandler() OVERRIDE {
    return this;
  }

  // CefRenderProcessHandler methods:
  virtual void OnContextCreated(CefRefPtr<CefBrowser> browser,
                                CefRefPtr<CefFrame> frame,
																CefRefPtr<CefV8Context> context) OVERRIDE {
    struct NativeCallHandler : public CefV8Handler {
      virtual bool Execute(const CefString &name, CefRefPtr<CefV8Value> object,
                           const CefV8ValueList &arguments,
                           CefRefPtr<CefV8Value> &retval,
                           CefString &exception) OVERRIDE {
        if (name == "foo") {
          retval = CefV8Value::CreateString("bar");
          return true;
        }
        
        return false;
      }
      
      IMPLEMENT_REFCOUNTING(NativeCallHandler);
    };
    
    CefRefPtr<CefV8Value> globals = context->GetGlobal();
    CefRefPtr<CefV8Handler> nativeCallHandler = new NativeCallHandler();
    CefRefPtr<CefV8Value> jsNativeCallHandler =
    CefV8Value::CreateFunction("foo", nativeCallHandler);
    context->GetGlobal()->SetValue("nativeFoo", jsNativeCallHandler,
                                   V8_PROPERTY_ATTRIBUTE_NONE);
	};

private:
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
