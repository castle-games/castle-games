#import "NSApplication+Ghost.h"

#include "ghost.h"
#include "ghost_constants.h"

#include <string>

@implementation NSApplication (Ghost)

- (void)openProject:(__unused id)sender {
  [self _sendJSNativeMenuEventWithAction:kGhostMenuFileOpenAction];
}

- (void)_sendJSNativeMenuEventWithAction:(const char *)action {
  NSString *params = [NSString stringWithFormat:@"{ action: \"%s\" }", action];
  ghostSendJSEvent(kGhostNativeMenuSelectedEventName,
                   [params cStringUsingEncoding:NSUTF8StringEncoding]);
}

@end
