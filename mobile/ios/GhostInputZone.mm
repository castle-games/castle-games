// Wrapped by 'GhostInputZone.js'.
#import <React/RCTView.h>
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

#include "modules/thread/Channel.h"

//
// GhostInputZone
//

@interface ChildState
@end

@interface GhostInputZone : RCTView

@property(nonatomic, strong) NSString *input;

@end

@implementation GhostInputZone

@synthesize input;

static void channelPush(NSString *name, NSString *value) {
  auto channel = love::thread::Channel::getChannel(name.UTF8String);
  auto var =
      love::Variant(value.UTF8String,
                    [value lengthOfBytesUsingEncoding:NSUTF8StringEncoding]);
  channel->push(var);
}

- (void)updateChild:(NSNumber *)childId
                  x:(NSNumber *)x
                  y:(NSNumber *)y
              width:(NSNumber *)width
             height:(NSNumber *)height
             config:(NSDictionary *)config {
  
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  channelPush(@"GHOST_INPUT_DOWN", self.input);
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  channelPush(@"GHOST_INPUT_UP", self.input);
}

@end

//
// GhostInputZoneManager
//

@interface GhostInputZoneManager : RCTViewManager
@end

@implementation GhostInputZoneManager

RCT_EXPORT_MODULE()

@synthesize bridge = _bridge;

- (UIView *)view {
  return [[GhostInputZone alloc] init];
}

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(updateChild:(nonnull NSNumber *)reactTag
                  childId:(NSNumber *)childId
                  x:(NSNumber *)x
                  y:(NSNumber *)y
                  width:(NSNumber *)width
                  height:(NSNumber *)height
                  config:(NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseResolveBlock)reject) {
  GhostInputZone *view = (GhostInputZone *)[self.bridge.uiManager viewForReactTag:reactTag];
  if (view) {
    NSLog(@"updateChild: %@ %@ %@ %@ %@", childId, x, y, width, height);
    [view updateChild:childId x:x y:y width:width height:height config:config];
  }
}

RCT_EXPORT_VIEW_PROPERTY(input, NSString);

@end
