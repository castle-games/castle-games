#import <Cocoa/Cocoa.h>

@interface GhostAppDelegate : NSObject <NSApplicationDelegate>

- (void)stopLove;
- (void)bootLoveWithUri:(NSString *)uri;
- (void)tryToTerminateApplication:(NSApplication *)app;
- (void)createApplication:(id)object;

@end
