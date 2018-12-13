/**
 * Copyright (c) 2006-2018 LOVE Development Team
 *
 * This software is provided 'as-is', without any express or implied
 * warranty.  In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 * 1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be
 *    misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 **/

// This is just for the editor
#ifndef GAMELIFT_USE_STD
#define GAMELIFT_USE_STD 1
#endif

#include "aws/core/Aws.h"
#include "aws/gamelift/server/GameLiftServerAPI.h"
#include "aws/gamelift/server/LogParameters.h"
#include "aws/gamelift/server/ProcessParameters.h"
#include "common/version.h"
#include "logs.h"
#include "modules/love/love.h"
#include "modules/thread/Channel.h"
#include <SDL.h>
#include <algorithm>
#include <assert.h>
#include <fcntl.h>
#include <fstream>
#include <iostream>
#include <signal.h>
#include <sstream>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <sys/file.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

#ifdef LOVE_BUILD_EXE

#define START_PORT 22122
#define END_PORT 42122
#define PORT_FILE "current_port.txt"
// We pad the game session data with the string "castle" because otherwise aws sends us the content
// of the url instead of the url string
#define GAME_SESSION_DATA_PADDING 6

using namespace Aws::GameLift::Server;

static bool sShouldQuit = false;
static std::string sCastleUrl;
static std::string sBinaryDirectory;
static int sPort = -1;
static Logs *sCastleLogs;

// Lua
extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

static int love_preload(lua_State *L, lua_CFunction f, const char *name) {
  lua_getglobal(L, "package");
  lua_getfield(L, -1, "preload");
  lua_pushcfunction(L, f);
  lua_setfield(L, -2, name);
  lua_pop(L, 2);
  return 0;
}

enum DoneAction {
  DONE_QUIT,
  DONE_RESTART,
};

void my_handler(int s) {
  sCastleLogs->log("Caught signal %d", s);
  sShouldQuit = true;
}

static void checkForLogs() {
  static lua_State *conversionLuaState = lua_open();

  std::string channelNames[] = {"PRINT", "ERROR"};
  for (const std::string channelName : channelNames) {
    auto channel = love::thread::Channel::getChannel(channelName);
    love::Variant var;
    while (channel->pop(&var)) {
      assert(var.getType() == love::Variant::STRING || var.getType() == love::Variant::SMALLSTRING);
      var.toLua(conversionLuaState);
      std::string str(luaL_checkstring(conversionLuaState, -1));
      sCastleLogs->logLua(str);
      lua_pop(conversionLuaState, 1);
    }
  }

  sCastleLogs->tick();
}

static DoneAction runlove(int argc, char **argv, int &retval) {
  while (sCastleUrl.empty() && !sShouldQuit) {
    sleep(0);
  }
  sCastleLogs->log("Done sleeping");
  if (sShouldQuit) {
    sCastleLogs->log("Quitting from runlove");
    return DONE_QUIT;
  }

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

    std::string path = sBinaryDirectory + "base";

    sCastleLogs->log("Castle lua path: %s", path.c_str());
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

  sCastleLogs->log("Setting GHOST_ROOT_URI to " + sCastleUrl);
  lua_pushstring(L, sCastleUrl.c_str());
  lua_setglobal(L, "GHOST_ROOT_URI");

  sCastleLogs->log("Setting GHOST_PORT to %i", sPort);
  lua_pushinteger(L, sPort);
  lua_setglobal(L, "GHOST_PORT");

  // TODO: should actually test whether lua is finished initializing
  struct timespec start, finish;
  double elapsed;
  clock_gettime(CLOCK_MONOTONIC, &start);
  bool hasActivatedGameSession = false;

  int stackpos = lua_gettop(L);
  while (lua_resume(L, 0) == LUA_YIELD) {
    if (!hasActivatedGameSession) {
      clock_gettime(CLOCK_MONOTONIC, &finish);
      elapsed = (finish.tv_sec - start.tv_sec);
      elapsed += (finish.tv_nsec - start.tv_nsec) / 1000000000.0;

      if (elapsed > 5) {
        hasActivatedGameSession = true;
        // ActivateGameSession();
        // log("Called ActivateGameSession()");
      }
    }

    if (sShouldQuit) {
      return DONE_QUIT;
    }

    lua_pop(L, lua_gettop(L) - stackpos);
    checkForLogs();
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

const std::function<void(Model::GameSession)> onStartGameSession = [](Model::GameSession session) {
  sCastleLogs->log("onStartGameSession");
  std::string castleUrl = session.GetGameSessionData();
  if (castleUrl.empty() || castleUrl.length() < GAME_SESSION_DATA_PADDING) {
    sShouldQuit = true;
    sCastleLogs->log("No GameSessionData");
    return;
  }

  sCastleUrl = castleUrl.substr(GAME_SESSION_DATA_PADDING);
  sCastleLogs->log("Castle url is: " + sCastleUrl);
  sCastleLogs->setUrl(sCastleUrl);

  // We should really call this from runlove(), but GameLift has some bug where it will terminate
  // the session if this isn't called quickly
  ActivateGameSession();
};

const std::function<void()> onProcessTerminate = []() {
  sCastleLogs->log("onProcessTerminate");
  sShouldQuit = true;
};

const std::function<bool()> onHealthCheck = []() {
  sCastleLogs->log("onHealthCheck");
  return !sShouldQuit;
};

// PORT_FILE has the next available port. We grab a file lock before doing anything since GameLift
// starts multiple of these same processes at the same time when a new instance is created.
void findFreePort() {
  std::string filename = sBinaryDirectory + PORT_FILE;
  int fd = open(filename.c_str(), O_RDWR | O_CREAT, 0666);
  int lock = -1;
  // Probably don't actually need the while loop, but there are some edge case errors that this
  // might catch
  while (lock == -1) {
    lock = flock(fd, LOCK_EX);
    sleep(0);
  }

  // Read the 5 digit port
  char port[5];
  ssize_t bytesRead = read(fd, port, 5);

  if (bytesRead != 5) {
    sPort = START_PORT;
    sCastleLogs->log("Port file doesn't exist. Using port %i", sPort);
  } else {
    sPort = std::stoi(port);
    if (sPort > END_PORT) {
      sPort = START_PORT;
    }
    sCastleLogs->log("Port file exists. Using port %i", sPort);
  }

  const char *newPort = std::to_string(sPort + 1).c_str();

  lseek(fd, 0, SEEK_SET);
  write(fd, newPort, strlen(newPort));

  // Shouldn't be necessary but makes the logs cleaner
  // sleep(3);

  flock(fd, LOCK_UN);
  close(fd);
}

int main(int argc, char **argv) {
  Aws::SDKOptions options;
  Aws::InitAPI(options);

  std::string::size_type pos = std::string(argv[0]).find_last_of("\\/");
  sBinaryDirectory = std::string(argv[0]).substr(0, pos) + "/";

  sCastleLogs = new Logs(sBinaryDirectory);

  sCastleLogs->log("\n\n\n\n");
  findFreePort();

  sCastleLogs->setPort(sPort);

  struct sigaction sigIntHandler;

  if (strcmp(LOVE_VERSION_STRING, love_version()) != 0) {
    sCastleLogs->log("Version mismatch detected!\nLOVE binary is version %s\n"
                     "LOVE library is version %s",
                     LOVE_VERSION_STRING, love_version());
    return 1;
  }

  if (argc != 1) {
    sCastleLogs->log("Does not take any args");
    return 1;
  }

  sCastleLogs->log("Castle server started");
  sigIntHandler.sa_handler = my_handler;
  sigemptyset(&sigIntHandler.sa_mask);
  sigIntHandler.sa_flags = 0;
  sigaction(SIGINT, &sigIntHandler, NULL);

  LogParameters logParameters;
  ProcessParameters gameLiftParams(onStartGameSession, onProcessTerminate, onHealthCheck, sPort,
                                   logParameters);

  InitSDK();
  ProcessReady(gameLiftParams);

  sCastleLogs->log("Finished initializing GameLift");

  int retval = 0;
  DoneAction done = DONE_QUIT;

  do {
    done = runlove(argc, argv, retval);
  } while (done != DONE_QUIT);

  sCastleLogs->log("Done running Lua");
  sCastleLogs->forceFlush();
  Aws::ShutdownAPI(options);

  return retval;
}

#endif // LOVE_BUILD_EXE