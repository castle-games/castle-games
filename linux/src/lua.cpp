#include "lua.h"
#include "timer.h"
#include <assert.h>

void Lua::checkForLogs() {
  static lua_State *conversionLuaState = lua_open();

  std::string channelNames[] = {"PRINT", "ERROR"};
  for (const std::string channelName : channelNames) {
    auto channel = love::thread::Channel::getChannel(channelName);
    love::Variant var;
    while (channel->pop(&var)) {
      assert(var.getType() == love::Variant::STRING || var.getType() == love::Variant::SMALLSTRING);
      var.toLua(conversionLuaState);
      std::string str(luaL_checkstring(conversionLuaState, -1));
      mLogs->logLua(str);
      lua_pop(conversionLuaState, 1);
    }
  }
}

static int love_preload(lua_State *L, lua_CFunction f, const char *name) {
  lua_getglobal(L, "package");
  lua_getfield(L, -1, "preload");
  lua_pushcfunction(L, f);
  lua_setfield(L, -2, name);
  lua_pop(L, 2);
  return 0;
}

Lua::DoneAction Lua::execute(std::string url, int port, int &retval) {
  // Create the virtual machine.
  lua_State *L = luaL_newstate();
  luaL_openlibs(L);

  // Add love to package.preload for easy requiring.
  love_preload(L, luaopen_love, "love");

  // Add command line arguments to global arg (like stand-alone Lua).
  {
    lua_newtable(L);

    lua_pushstring(L, "love");
    lua_rawseti(L, -2, -2);

    lua_pushstring(L, "embedded boot.lua");
    lua_rawseti(L, -2, -1);

    std::string path = mRootDirectory + "base";

    mLogs->log("Castle lua path: %s", path.c_str());
    lua_pushstring(L, path.c_str());
    lua_rawseti(L, -2, 0);

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

  // Turn the returned boot function into a coroutine and call it until done.
  lua_newthread(L);
  lua_pushvalue(L, -2);

  mLogs->log("Setting GHOST_ROOT_URI to " + url);
  lua_pushstring(L, url.c_str());
  lua_setglobal(L, "GHOST_ROOT_URI");

  mLogs->log("Setting GHOST_PORT to %i", port);
  lua_pushinteger(L, port);
  lua_setglobal(L, "GHOST_PORT");

  // TODO: should actually test whether lua is finished initializing
  Timer timer;
  timer.start();
  bool hasActivatedGameSession = false;

  int stackpos = lua_gettop(L);
  while (lua_resume(L, 0) == LUA_YIELD) {
    if (!hasActivatedGameSession) {
      if (timer.elapsedTimeS() > 5) {
        hasActivatedGameSession = true;
        // ActivateGameSession();
        // log("Called ActivateGameSession()");
      }
    }

    lua_pop(L, lua_gettop(L) - stackpos);
    checkForLogs();

    if (mShouldQuit) {
      return DONE_QUIT;
    }
  }

  retval = 0;
  DoneAction done = DONE_QUIT;

  // if love.boot() returns "restart", we'll start up again after closing this
  // Lua state.
  if (lua_type(L, -1) == LUA_TSTRING && strcmp(lua_tostring(L, -1), "restart") == 0)
    done = DONE_RESTART;
  if (lua_isnumber(L, -1))
    retval = (int)lua_tonumber(L, -1);

  lua_close(L);

  return done;
}