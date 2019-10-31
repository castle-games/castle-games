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

static void channelPush(NSString *name, NSString *value) {
  auto channel = love::thread::Channel::getChannel(name.UTF8String);
  auto var =
  love::Variant(value.UTF8String,
                [value lengthOfBytesUsingEncoding:NSUTF8StringEncoding]);
  channel->push(var);
}

//
// GhostInputZone
//

@interface ChildState : NSObject

@property(nonatomic, assign) int childId;
@property(nonatomic, assign) double x;
@property(nonatomic, assign) double y;
@property(nonatomic, assign) double width;
@property(nonatomic, assign) double height;
@property(nonatomic, strong) NSString *keyCode;
@property(nonatomic, assign) BOOL prevDown;

@end

@implementation ChildState

@end

@interface GhostInputZone : RCTView

@property(nonatomic, strong) NSString *input;

@property(nonatomic, strong) NSMutableDictionary *childStates;

@property(nonatomic, assign) NSTimeInterval lastVibrateTime;
@property(nonatomic, strong) UIImpactFeedbackGenerator *feedbackGenerator;

@end

@implementation GhostInputZone

@synthesize input;

- (instancetype)init {
  if (self = [super init]) {
    self.childStates = [NSMutableDictionary dictionary];

    self.lastVibrateTime = [NSDate timeIntervalSinceReferenceDate];
    self.feedbackGenerator = [[UIImpactFeedbackGenerator alloc] init];
  }
  return self;
}

- (void)updateChild:(NSNumber *)childId
                  x:(NSNumber *)x
                  y:(NSNumber *)y
              width:(NSNumber *)width
             height:(NSNumber *)height
             config:(NSDictionary *)config {
  ChildState *childState = self.childStates[childId];
  if (!childState) {
    childState = [[ChildState alloc] init];
    self.childStates[childId] = childState;
  }

  childState.childId = [childId intValue];
  childState.x = [x doubleValue];
  childState.y = [y doubleValue];
  childState.width = [width doubleValue];
  childState.height = [height doubleValue];
  childState.prevDown = NO;

  if (config[@"keyCode"]) {
    childState.keyCode = config[@"keyCode"];
  } else {
    childState.keyCode = NULL;
  }
}

- (void)handleTouchWithWithPoint:(CGPoint)point isDown:(BOOL)down {
  down = down && CGRectContainsPoint(self.frame, point);

  ChildState *closest = NULL;
  double closestSquaredDist = DBL_MAX;
  if (down) {
    for (NSNumber *childId in self.childStates) {
      ChildState *childState = self.childStates[childId];

      if (childState.x <= point.x && point.x <= childState.x + childState.width &&
          childState.y <= point.y && point.y <= childState.y + childState.height) {
        double centerX = childState.x + 0.5 * childState.width;
        double centerY = childState.y + 0.5 * childState.height;
        double dx = point.x - centerX;
        double dy = point.y - centerY;
        double squaredDist = dx * dx + dy * dy;
        if (squaredDist < closestSquaredDist) {
          closest = childState;
          closestSquaredDist = squaredDist;
        }
      }
    }
  }

  BOOL vibrate = NO;
  for (NSNumber *childId in self.childStates) {
    ChildState *childState = self.childStates[childId];
    BOOL currDown = closest && childState.childId == closest.childId;
    if (currDown != childState.prevDown) {
      if (currDown) {
        channelPush(@"GHOST_KEY_DOWN", childState.keyCode);
        vibrate = true;
      } else {
        channelPush(@"GHOST_KEY_UP", childState.keyCode);
      }
    }
    childState.prevDown = currDown;
  }

  if (vibrate) {
    NSTimeInterval currTime = [NSDate timeIntervalSinceReferenceDate];
    if (currTime - self.lastVibrateTime > 0.12) {
      [self.feedbackGenerator impactOccurred];
    }
  }
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  CGPoint point = [[touches anyObject] locationInView:self];
  [self handleTouchWithWithPoint:point isDown:YES];
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self.feedbackGenerator prepare];

  CGPoint point = [[touches anyObject] locationInView:self];
  [self handleTouchWithWithPoint:point isDown:YES];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  CGPoint point = [[touches anyObject] locationInView:self];
  [self handleTouchWithWithPoint:point isDown:NO];
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
                  childId:(nonnull NSNumber *)childId
                  x:(nonnull NSNumber *)x
                  y:(nonnull NSNumber *)y
                  width:(nonnull NSNumber *)width
                  height:(nonnull NSNumber *)height
                  config:(nonnull NSDictionary *)config
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  GhostInputZone *view = (GhostInputZone *)[self.bridge.uiManager viewForReactTag:reactTag];
  if (view) {
    [view updateChild:childId x:x y:y width:width height:height config:config];
  }
}

RCT_EXPORT_VIEW_PROPERTY(input, NSString);

@end
