#import "ghost.h"
#import "ghost_constants.h"

#import "GhostAppDelegate.h"
#import "GhostFileSystem.h"

#import <sstream>

#pragma mark - internal

static void _ghostSendNativeOpenUrlEvent(const char *uri) {
  std::stringstream params;
  params << "{ url: '" << uri << "' }";
  ghostSendJSEvent(kGhostOpenUrlEventName.c_str(), params.str().c_str());
}

#pragma mark - macos implementation of ghost.h

static float childLeft = 0, childTop = 0, childWidth = 200, childHeight = 200;

static BOOL browserReady = NO;
static char *initialUri = NULL;
NSWindow *hiddenWindow = nil;

void ghostSetChildWindowVisible(bool visible) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSWindow *window = [[NSApplication sharedApplication] mainWindow];
    if (window) {
      if (visible) {
        if (hiddenWindow) {
          [window addChildWindow:hiddenWindow ordered:NSWindowAbove];
          hiddenWindow = nil;
        }
      } else {
        for (NSWindow *childWindow in window.childWindows) {
          assert(!hiddenWindow);
          [childWindow setIsVisible:FALSE];
          hiddenWindow = childWindow;
        }
      }
    }
  });
}

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

void ghostOpenExternalUrl(const char *url) {
  NSString *urlStr = [NSString stringWithCString:url encoding:NSUTF8StringEncoding];
  NSURL *macUrl = [NSURL URLWithString:urlStr];
  if (macUrl) { // will be nil if invalid
    [[NSWorkspace sharedWorkspace] openURL:macUrl];
  }
}

void ghostClose() {
  hiddenWindow = nil;
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

bool ghostChooseDirectoryWithDialog(const char *title, const char *message, const char *action,
                                    const char **result) {
  const char *chosenPathCStr = NULL;
  NSOpenPanel *openPanel = [NSOpenPanel openPanel];
  [openPanel setTitle:[NSString stringWithCString:title encoding:NSUTF8StringEncoding]];
  [openPanel setPrompt:[NSString stringWithCString:action encoding:NSUTF8StringEncoding]];
  [openPanel setMessage:[NSString stringWithCString:message encoding:NSUTF8StringEncoding]];
  [openPanel setAllowsMultipleSelection:NO];
  [openPanel setCanChooseDirectories:YES];
  [openPanel setCanCreateDirectories:YES];
  [openPanel setCanChooseFiles:NO];
  // NOTE: we might want [openPanel setDirectoryURL:]
  NSModalResponse response = [openPanel runModal];
  if (response == NSFileHandlingPanelOKButton) {
    NSURL *url = [[openPanel URLs] lastObject];
    chosenPathCStr = [[url path] cStringUsingEncoding:NSUTF8StringEncoding];
  }
  if (chosenPathCStr) {
    *result = strdup(chosenPathCStr);
    return true;
  }
  return false;
}

void ghostQuitMessageLoop() {}

bool ghostGetPathToFileInAppBundle(const char *filename, const char **result) {
  NSString *_filename = [NSString stringWithCString:filename encoding:NSUTF8StringEncoding];
  NSString *path = [GhostFileSystem pathToFileInAppBundle:_filename];
  const char *pathStr = NULL;
  if (path) {
    pathStr = [path cStringUsingEncoding:NSUTF8StringEncoding];
  }
  if (pathStr) {
    *result = strdup(pathStr);
    return true;
  }
  return false;
}
