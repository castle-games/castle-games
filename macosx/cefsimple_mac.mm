// Copyright (c) 2013 The Chromium Embedded Framework Authors.
// Portions copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import <Cocoa/Cocoa.h>

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

#include <SDL.h>

#include "include/cef_application_mac.h"
#include "include/wrapper/cef_helpers.h"
#include "simple_app.h"
#include "simple_handler.h"

#include "modules/love/love.h"

// Receives notifications from the application.
@interface SimpleAppDelegate : NSObject <NSApplicationDelegate>

@property(nonatomic, assign) lua_State *luaState;
@property(nonatomic, assign) int loveBootStackPos;

@property(nonatomic, strong) NSTimer *mainLoopTimer;

- (void)createApplication:(id)object;
- (void)tryToTerminateApplication:(NSApplication *)app;
@end

// Provide the CefAppProtocol implementation required by CEF.
@interface SimpleApplication : NSApplication <CefAppProtocol> {
@private
  BOOL handlingSendEvent_;
}
@end

@implementation SimpleApplication
- (BOOL)isHandlingSendEvent {
  return handlingSendEvent_;
}

- (void)setHandlingSendEvent:(BOOL)handlingSendEvent {
  handlingSendEvent_ = handlingSendEvent;
}

- (void)sendEvent:(NSEvent *)event {
  CefScopedSendingEvent sendingEventScoper;
  [super sendEvent:event];
}

- (void)terminate:(id)sender {
  SimpleAppDelegate *delegate =
      static_cast<SimpleAppDelegate *>([NSApp delegate]);
  [delegate tryToTerminateApplication:self];
  // Return, don't exit. The application is responsible for exiting on its own.
}
@end

@implementation SimpleAppDelegate

// Create the application on the UI thread.
- (void)createApplication:(id)object {
  [NSApplication sharedApplication];
  [[NSBundle mainBundle] loadNibNamed:@"MainMenu"
                                owner:NSApp
                      topLevelObjects:nil];

  // Set the delegate for application events.
  [[NSApplication sharedApplication] setDelegate:self];

  // Love test
  self.luaState = nil;
  [self bootLoveWithUri:nil];
  self.mainLoopTimer = [NSTimer timerWithTimeInterval:1.0f / 60.0f
                                               target:self
                                             selector:@selector(stepLove)
                                             userInfo:nil
                                              repeats:YES];
  [[NSRunLoop mainRunLoop] addTimer:self.mainLoopTimer
                            forMode:NSRunLoopCommonModes];
}

- (NSApplicationTerminateReply)applicationShouldTerminate:
    (NSApplication *)sender {
  return NSTerminateNow;
}

- (void)bootLoveWithUri:(NSString *)uri {
  // Create the virtual machine.
  lua_State *L = luaL_newstate();
  luaL_openlibs(L);

  // Add love to package.preload for easy requiring.
  lua_getglobal(L, "package");
  lua_getfield(L, -1, "preload");
  lua_pushcfunction(L, luaopen_love);
  lua_setfield(L, -2, "love");
  lua_pop(L, 2);

  // Add command line arguments to global arg (like stand-alone Lua).
  {
    lua_newtable(L);

    lua_pushstring(L, "love");
    lua_rawseti(L, -2, -2);

    lua_pushstring(L, "embedded boot.lua");
    lua_rawseti(L, -2, -1);

    NSArray *bundlepaths =
        [[NSBundle mainBundle] pathsForResourcesOfType:@"love" inDirectory:nil];
    if (bundlepaths.count > 0) {
      lua_pushstring(L, [bundlepaths[0] UTF8String]);
      lua_rawseti(L, -2, 0);
      lua_pushstring(L, "--fused");
      lua_rawseti(L, -2, 1);
    }

    lua_setglobal(L, "arg");
  }

  // require "love"
  lua_getglobal(L, "require");
  lua_pushstring(L, "love");
  lua_call(L, 1, 1); // leave the returned table on the stack.

  // Add love._exe = true.
  // This indicates that we're running the standalone version of love, and not
  // the library version.
  {
    lua_pushboolean(L, 1);
    lua_setfield(L, -2, "_exe");
  }

  // Pop the love table returned by require "love".
  lua_pop(L, 1);

  // require "love.boot" (preloaded when love was required.)
  lua_getglobal(L, "require");
  lua_pushstring(L, "love.boot");
  lua_call(L, 1, 1);

  // Turn the returned boot function into a coroutine and leave it at the top of
  // the stack
  lua_newthread(L);
  lua_pushvalue(L, -2);
  self.loveBootStackPos = lua_gettop(L);
  self.luaState = L;

  // If `uri` is given, set it as the global variable `GHOST_ROOT_URI`
  if (uri) {
    lua_pushstring(L, uri.UTF8String);
    lua_setglobal(L, "GHOST_ROOT_URI");
  }
}

- (void)stepLove {
  if (self.luaState) {
    // Call the coroutine at the top of the stack
    lua_State *L = self.luaState;
    if (lua_resume(L, 0) == LUA_YIELD) {
      lua_pop(L, lua_gettop(L) - self.loveBootStackPos);
    } else {
      [self closeLua];
    }
  }
}

- (void)closeLua {
  if (self.luaState) {
    lua_close(self.luaState);
    self.luaState = nil;
  }
}

- (void)tryToTerminateApplication:(NSApplication *)app {
  SimpleHandler *handler = SimpleHandler::GetInstance();
  if (handler && !handler->IsClosing())
    handler->CloseAllBrowsers(false);
}

@end

// Entry point function for the browser process.
int main(int argc, char *argv[]) {
  // Provide CEF with command-line arguments.
  CefMainArgs main_args(argc, argv);

  // Initialize the AutoRelease pool.
  // NSAutoreleasePool* autopool = [[NSAutoreleasePool alloc] init];

  // Initialize the SimpleApplication instance.
  [SimpleApplication sharedApplication];

  // Specify CEF global settings here.
  CefSettings settings;

  // SimpleApp implements application-level callbacks for the browser process.
  // It will create the first browser instance in OnContextInitialized() after
  // CEF has initialized.

  // use embedded index.html if it exists.
  NSString *indexPath =
      [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html"];
  std::string initialUrl;
  if (indexPath && indexPath.length) {
    indexPath = [NSString stringWithFormat:@"file://%@", indexPath];
    initialUrl = std::string([indexPath UTF8String]);
  } else {
    initialUrl = "http://www.google.com";
  }
  CefRefPtr<SimpleApp> app(new SimpleApp(initialUrl));

  // Initialize CEF for the browser process.
  CefInitialize(main_args, settings, app.get(), NULL);

  // Create the application delegate.
  NSObject *delegate = [[SimpleAppDelegate alloc] init];
  [delegate performSelectorOnMainThread:@selector(createApplication:)
                             withObject:nil
                          waitUntilDone:NO];

  // Run the CEF message loop. This will block until CefQuitMessageLoop() is
  // called.
  CefRunMessageLoop();

  // Shut down CEF.
  CefShutdown();

  // Release the delegate.
  //[delegate release];

  // Release the AutoRelease pool.
  //[autopool release];

  return 0;
}
