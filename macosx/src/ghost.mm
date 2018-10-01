#import "ghost.h"

#import "GhostAppDelegate.h"
#import "simple_handler.h"

NSString *const kGhostOpenUrlEventName = @"nativeOpenUrl";

#pragma mark - internal

static void _ghostSendJSEvent(NSString *eventName, NSString *serializedParams) {
  CefRefPtr<CefBrowser> browser = SimpleHandler::GetInstance()->GetFirstBrowser();
  CefRefPtr<CefFrame> frame = browser->GetMainFrame();
  NSString *validatedParams = (serializedParams) ? serializedParams : @"{}";
  NSString *msg = [NSString
      stringWithFormat:
          @"{ let event = new Event('%@'); event.params = %@; window.dispatchEvent(event); }",
          eventName, validatedParams];
  frame->ExecuteJavaScript([msg UTF8String], frame -> GetURL(), 0);
}

static void _ghostSendNativeOpenUrlEvent(const char *uri) {
  NSString *params = [NSString stringWithFormat:@"{ url: '%s' }", uri];
  _ghostSendJSEvent(kGhostOpenUrlEventName, params);
}

#pragma mark - macos implementation of ghost.h

static float childLeft = 0, childTop = 0, childWidth = 200, childHeight = 200;

static BOOL browserReady = NO;
static char *initialUri = NULL;

void ghostSetChildWindowFrame(float left, float top, float width, float height) {
  childLeft = left;
  childTop = top;
  childWidth = width;
  childHeight = height;

  NSWindow *window = [[NSApplication sharedApplication] mainWindow];
  if (window) {
    CGRect frame;
    frame.origin.x = window.frame.origin.x + left;
    frame.origin.y = window.frame.origin.y + window.contentLayoutRect.size.height - top - height;
    frame.size.width = width;
    frame.size.height = height;

    for (NSWindow *childWindow in window.childWindows) {
      [childWindow setFrame:frame display:NO];
    }
  }
}

void ghostResizeChildWindow(float dw, float dh) {
  ghostSetChildWindowFrame(childLeft, childTop, childWidth + dw, childHeight + dh);
}

void ghostUpdateChildWindowFrame() {
  ghostSetChildWindowFrame(childLeft, childTop, childWidth, childHeight);
}

void ghostHandleOpenUri(const char *uri) {
  if (browserReady) {
    _ghostSendNativeOpenUrlEvent(uri);
  } else {
    initialUri = strdup(uri);
  }
}

void ghostOpenLoveUri(const char *uri) {
  NSString *uriStr = [NSString stringWithCString:uri encoding:NSUTF8StringEncoding];
  dispatch_async(dispatch_get_main_queue(), ^{
    GhostAppDelegate *delegate = [NSApplication sharedApplication].delegate;
    [delegate stopLove];
    [delegate bootLoveWithUri:uriStr];
  });
}

void ghostClose() {
  dispatch_async(dispatch_get_main_queue(), ^{
    GhostAppDelegate *delegate = [NSApplication sharedApplication].delegate;
    [delegate stopLove];
  });
}

void ghostSetBrowserReady() {
  browserReady = YES;
  if (initialUri) {
    _ghostSendNativeOpenUrlEvent(initialUri);
    free(initialUri);
    initialUri = NULL;
  }
}

void ghostQuitMessageLoop() {}

void ghostSendJSEvent(const char *eventName, const char *serializedParams) {
  NSString *eventNameMacOS = [NSString stringWithFormat:@"%s", eventName];
  NSString *eventParamsMacOS =
      (serializedParams != NULL) ? [NSString stringWithFormat:@"%s", serializedParams] : nil;
  _ghostSendJSEvent(eventNameMacOS, eventParamsMacOS);
}
