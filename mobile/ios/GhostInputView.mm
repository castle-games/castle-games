// Wrapped by 'GhostInputView.js'.
#import <React/RCTView.h>
#import <React/RCTViewManager.h>

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

#include "modules/thread/Channel.h"

//
// GhostInputView
//

@interface GhostInputView : RCTView

@property(nonatomic, strong) NSString *input;

@end

@implementation GhostInputView

@synthesize input;

static void channelPush(NSString *name, NSString *value) {
  auto channel = love::thread::Channel::getChannel(name.UTF8String);
  auto var =
      love::Variant(value.UTF8String,
                    [value lengthOfBytesUsingEncoding:NSUTF8StringEncoding]);
  channel->push(var);
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  channelPush(@"GHOST_INPUT_DOWN", self.input);
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  channelPush(@"GHOST_INPUT_UP", self.input);
}

@end

//
// GhostInputViewManager
//

@interface GhostInputViewManager : RCTViewManager
@end

@implementation GhostInputViewManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (UIView *)view {
  return [[GhostInputView alloc] init];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(input, NSString);

@end
