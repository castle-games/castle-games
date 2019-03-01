#ifndef __CASTLE_LUA_H__
#define __CASTLE_LUA_H__

#include "modules/love/love.h"
#include "modules/thread/Channel.h"

// Lua
extern "C" {
#include <lauxlib.h>
#include <lua.h>
#include <lualib.h>
}

#include "logs.h"
#include <string>

class Lua {
private:
  std::string mRootDirectory;
  Logs *mLogs;
  std::string mUrl;
  int mPort;
  void checkForLogs();
  bool mShouldQuit = false;

public:
  enum DoneAction {
    DONE_QUIT,
    DONE_RESTART,
  };

  Lua(std::string rootDirectory, Logs *logs) {
    mRootDirectory = rootDirectory;
    mLogs = logs;
  }

  DoneAction execute(std::string url, int port, int &retval);
  void exit() { mShouldQuit = true; }
};

#endif
