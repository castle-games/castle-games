/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#include <SDL.h>

#import "../../../ghost-extensions/SDL2-2.0.8/src/video/uikit/SDL_uikitappdelegate.h"

@implementation SDLUIKitDelegate (Castle)

// SDL defines its own `int main(...)` function:
// https://github.com/spurious/SDL-mirror/blob/5d7cfcca344034aff9327f77fc181ae3754e7a90/src/video/uikit/SDL_uikitappdelegate.m#L45-L70.
// We tell it to use our `AppDelegate` class instead.
+ (NSString *)getAppDelegateClassName {
  return NSStringFromClass([AppDelegate class]);
}

@end

int SDL_main(int argc, char *argv[]) {
  // Implement a dummy `SDL_main()` to satisfy the linker.
  return 0;
}

@interface AppDelegate ()

@property(nonatomic, strong) SDLUIKitDelegate *sdlDelegate;

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Castle"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  // SDL
  self.sdlDelegate = [[SDLUIKitDelegate alloc] init];
  [self.sdlDelegate hideLaunchScreen];
  SDL_SetMainReady();
  SDL_iPhoneSetEventPump(SDL_FALSE);

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [NSURL URLWithString:@"http://192.168.0.107:8081/index.bundle?platform=ios&dev=true&minify=false"];
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:app openURL:url options:options];
}

- (void)applicationWillTerminate:(UIApplication *)application {
  [self.sdlDelegate applicationWillTerminate:application];
}

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
  [self.sdlDelegate applicationDidReceiveMemoryWarning:application];
}

- (void)application:(UIApplication *)application
    didChangeStatusBarOrientation:
        (UIInterfaceOrientation)oldStatusBarOrientation {
  [self.sdlDelegate application:application
      didChangeStatusBarOrientation:oldStatusBarOrientation];
}

- (void)applicationWillResignActive:(UIApplication *)application {
  [self.sdlDelegate applicationWillResignActive:application];
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
  [self.sdlDelegate applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
  [self.sdlDelegate applicationWillEnterForeground:application];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [self.sdlDelegate applicationDidBecomeActive:application];
}

@end
