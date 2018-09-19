#import "ghost.h"

#import "GhostAppDelegate.h"
#import "simple_handler.h"

// macOS implementation of 'ghost.h'

static float childLeft = 0, childTop = 0, childWidth = 200, childHeight = 200;

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
  CefRefPtr<CefBrowser> browser = SimpleHandler::GetInstance()->GetFirstBrowser();
  CefRefPtr<CefFrame> frame = browser->GetMainFrame();
  NSString *msg =
      [NSString stringWithFormat:@"let event = new Event('nativeOpenUrl'); event.params = { url: "
                                 @"'%s' }; window.dispatchEvent(event);",
                                 uri];
  frame->ExecuteJavaScript([msg UTF8String], frame -> GetURL(), 0);
}

void ghostOpenLoveUri(const char *uri) {
  NSString *uriStr = [NSString stringWithCString:uri encoding:NSUTF8StringEncoding];
  dispatch_async(dispatch_get_main_queue(), ^{
    GhostAppDelegate *delegate = [NSApplication sharedApplication].delegate;
    [delegate closeLua];
    [delegate bootLoveWithUri:uriStr];
  });
}

void ghostClose() {
  dispatch_async(dispatch_get_main_queue(), ^{
    GhostAppDelegate *delegate = [NSApplication sharedApplication].delegate;
    [delegate closeLua];
  });
}
