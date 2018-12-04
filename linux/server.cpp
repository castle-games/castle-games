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

#include "aws/gamelift/server/GameLiftServerAPI.h"
#include "aws/gamelift/server/LogParameters.h"
#include "aws/gamelift/server/ProcessParameters.h"
#include "common/version.h"
#include "modules/love/love.h"
#include <SDL.h>
#include <algorithm>
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
#define PORT_LOCK_FILE "port_lockfile.txt"
// We pad the game session data with the string "castle" because otherwise aws sends us the content
// of the url instead of the url string
#define GAME_SESSION_DATA_PADDING 6

using namespace Aws::GameLift::Server;

static bool sShouldQuit = false;
static std::string sCastleUrl;
static std::string sBinaryDirectory;
static int sPort = -1;

// From https://stackoverflow.com/a/1643134
/*! Try to get lock. Return its file descriptor or -1 if failed.
 *
 *  @param lockName Name of file used as lock (i.e. '/var/lock/myLock').
 *  @return File descriptor of lock file, or -1 if failed.
 */
int tryGetLock(char const *lockName) {
  mode_t m = umask(0);
  int fd = open(lockName, O_RDWR | O_CREAT, 0666);
  umask(m);
  if (fd >= 0 && flock(fd, LOCK_EX | LOCK_NB) < 0) {
    close(fd);
    fd = -1;
  }
  return fd;
}

/*! Release the lock obtained with tryGetLock( lockName ).
 *
 *  @param fd File descriptor of lock returned by tryGetLock( lockName ).
 *  @param lockName Name of file used as lock (i.e. '/var/lock/myLock').
 */
void releaseLock(int fd, char const *lockName) {
  if (fd < 0)
    return;
  remove(lockName);
  close(fd);
}

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

static void log(const char *format, ...) {
  va_list args;
  va_start(args, format);
  char buffer[1000];
  vsnprintf(buffer, 1000, format, args);
  va_end(args);

  time_t _tm = time(NULL);
  struct tm *curtime = localtime(&_tm);
  std::string formattedTime = std::string(asctime(curtime));
  formattedTime.erase(std::remove(formattedTime.begin(), formattedTime.end(), '\n'),
                      formattedTime.end());

  std::string str = buffer;
  std::cout << formattedTime << ": " << str << std::endl;

  std::ofstream outfile;
  outfile.open(sBinaryDirectory + "log.txt", std::ofstream::out | std::ofstream::app);
  outfile << formattedTime << ": " << str << std::endl;
}

static void log(std::string str) { log(str.c_str()); }

void my_handler(int s) {
  log("Caught signal %d", s);
  sShouldQuit = true;
}

// from https://gist.github.com/5at/3671566
static int l_my_print(lua_State *L) {
  int nargs = lua_gettop(L);
  log("Lua logs:");
  for (int i = 1; i <= nargs; ++i) {
    log("   " + std::string(lua_tostring(L, i)));
  }

  return 0;
}

static const struct luaL_Reg printlib[] = {
    {"print", l_my_print}, {NULL, NULL} /* end of array */
};

static DoneAction runlove(int argc, char **argv, int &retval) {
  while (sCastleUrl.empty() && !sShouldQuit) {
    sleep(0);
  }
  log("Done sleeping");
  if (sShouldQuit) {
    log("Quitting from runlove");
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

    log("Castle lua path: %s", path.c_str());
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

  log("Setting GHOST_ROOT_URI to " + sCastleUrl);
  lua_pushstring(L, sCastleUrl.c_str());
  lua_setglobal(L, "GHOST_ROOT_URI");

  log("Setting GHOST_PORT to %i", sPort);
  lua_pushinteger(L, sPort);
  lua_setglobal(L, "GHOST_PORT");

  // Add custom print lib
  lua_getglobal(L, "_G");
  luaL_register(L, NULL, printlib);
  lua_pop(L, 1);

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
        ActivateGameSession();
      }
    }

    if (sShouldQuit) {
      return DONE_QUIT;
    }

    lua_pop(L, lua_gettop(L) - stackpos);
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
  log("onStartGameSession");
  std::string castleUrl = session.GetGameSessionData();
  if (castleUrl.empty() || castleUrl.length() < GAME_SESSION_DATA_PADDING) {
    sShouldQuit = true;
    log("No GameSessionData");
    return;
  }

  sCastleUrl = castleUrl.substr(GAME_SESSION_DATA_PADDING);
  log("Castle url is: " + sCastleUrl);
};

const std::function<void()> onProcessTerminate = []() {
  log("onProcessTerminate");
  sShouldQuit = true;
};

const std::function<bool()> onHealthCheck = []() {
  log("onHealthCheck");
  return !sShouldQuit;
};

// PORT_FILE has the next available port. We grab a file lock before doing anything since GameLift
// starts multiple of these same processes at the same time when a new instance is created.
void findFreePort() {
  std::string lockFile = sBinaryDirectory + PORT_LOCK_FILE;
  int lockFd = -1;
  while (lockFd == -1) {
    sleep(0);
    lockFd = tryGetLock(lockFile.c_str());
  }

  std::ifstream t(sBinaryDirectory + PORT_FILE);
  if (!t.good()) { // file doesn't exist. port is definitely free
    sPort = START_PORT;
    log("Port file doesn't exist. Using port %i", sPort);
  } else {
    while (sPort == -1) {
      try {
        std::stringstream buffer;
        buffer << t.rdbuf();
        std::string str = buffer.str();
        sPort = std::stoi(str);
      } catch (const std::exception &ex) {
        log("Could not convert port file to integer. Waiting and trying again.");
        sleep(1);
      }
    }

    if (sPort > END_PORT) {
      sPort = START_PORT;
    }
    log("Port file exists. Using port %i", sPort);
  }

  std::ofstream outfile;
  outfile.open(sBinaryDirectory + PORT_FILE, std::ofstream::out);
  outfile << (sPort + 1) << std::endl;
  outfile.flush();
  outfile.close();

  releaseLock(lockFd, lockFile.c_str());
}

int main(int argc, char **argv) {
  std::string::size_type pos = std::string(argv[0]).find_last_of("\\/");
  sBinaryDirectory = std::string(argv[0]).substr(0, pos) + "/";

  findFreePort();

  struct sigaction sigIntHandler;

  if (strcmp(LOVE_VERSION_STRING, love_version()) != 0) {
    log("Version mismatch detected!\nLOVE binary is version %s\n"
        "LOVE library is version %s",
        LOVE_VERSION_STRING, love_version());
    return 1;
  }

  if (argc != 1) {
    log("Does not take any args");
    return 1;
  }

  log("\n\n\n\n");
  log("Castle server started");
  sigIntHandler.sa_handler = my_handler;
  sigemptyset(&sigIntHandler.sa_mask);
  sigIntHandler.sa_flags = 0;
  sigaction(SIGINT, &sigIntHandler, NULL);

  LogParameters logParameters;
  ProcessParameters gameLiftParams(onStartGameSession, onProcessTerminate, onHealthCheck, sPort,
                                   logParameters);

  InitSDK();
  ProcessReady(gameLiftParams);

  log("Finished initializing GameLift");

  int retval = 0;
  DoneAction done = DONE_QUIT;

  do {
    done = runlove(argc, argv, retval);
  } while (done != DONE_QUIT);

  log("Done running Lua");

  return retval;
}

#endif // LOVE_BUILD_EXE