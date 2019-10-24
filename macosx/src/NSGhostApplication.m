#import "NSGhostApplication.h"

#import <Bugsnag/Bugsnag.h>

@implementation NSGhostApplication

- (void)reportException:(NSException *)theException {
  [Bugsnag notify:theException];
  [super reportException:theException];
}

@end
