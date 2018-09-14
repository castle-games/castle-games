#import "GhostAppDelegate.h"
#import "ghost.h"

extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

#include "modules/love/love.h"
#include "simple_handler.h"

@interface GhostAppDelegate ()

@property(nonatomic, assign) lua_State *luaState;
@property(nonatomic, assign) int loveBootStackPos;

@property(nonatomic, strong) NSTimer *mainLoopTimer;

@end

@implementation GhostAppDelegate

+ (NSMenu *)makeMainMenu {
  NSMenu *mainMenu = [[NSMenu alloc] init];
  NSMenuItem *mainMenuItem =
      [[NSMenuItem alloc] initWithTitle:@"Application" action:nil keyEquivalent:@""];
  [mainMenu addItem:mainMenuItem];

  NSMenu *appMenu = [[NSMenu alloc] init];
  mainMenuItem.submenu = appMenu;

  NSMenuItem *quitItem =
      [[NSMenuItem alloc] initWithTitle:@"Quit" action:@selector(terminate:) keyEquivalent:@"q"];
  quitItem.target = [NSApplication sharedApplication];
  [appMenu addItem:quitItem];
  return mainMenu;
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
  return YES;
}

// Create the application on the UI thread.
- (void)createApplication:(id)object {
  [NSApplication sharedApplication];
  [NSApplication sharedApplication].mainMenu = [[self class] makeMainMenu];

  // Set the delegate for application events.
  [[NSApplication sharedApplication] setDelegate:self];

  // Love test
  self.luaState = nil;
  //  [self bootLoveWithUri:nil];
  self.mainLoopTimer = [NSTimer timerWithTimeInterval:1.0f / 60.0f
                                               target:self
                                             selector:@selector(stepLove)
                                             userInfo:nil
                                              repeats:YES];
  [[NSRunLoop mainRunLoop] addTimer:self.mainLoopTimer forMode:NSRunLoopCommonModes];
}

- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)sender {
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

    NSArray *bundlepaths = [[NSBundle mainBundle] pathsForResourcesOfType:@"love" inDirectory:nil];
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

  ghostUpdateChildWindowFrame();
}

- (void)closeLua {
  if (self.luaState) {
    lua_State *L = self.luaState;
    self.luaState = nil;
    lua_close(L);
  }
}

- (void)tryToTerminateApplication:(NSApplication *)app {
  [self closeLua];

  SimpleHandler *handler = SimpleHandler::GetInstance();
  if (handler && !handler->IsClosing())
    handler->CloseAllBrowsers(false);
}

@end
