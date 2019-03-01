#include "common/version.h"
#include "httpServer.h"
#include "logs.h"
#include "lua.h"
#include "timer.h"
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
#include <thread>
#include <unistd.h>

#define GHOST_EXPORT extern "C" __attribute__((visibility("default")))
#define DELAY_BEFORE_HEARTBEAT_TEST 30
#define HEARTBEAT_MAX_INTERVAL 5

static bool sShouldQuit = false;
static std::string sCastleUrl;
static std::string sBinaryDirectory;
static int sPort = -1;
static Lua *sLua;
static Logs *sCastleLogs;
static bool sIsAcceptingPlayers = true;
static Timer sGameTimer;
static Timer sHeartbeatTimer;

GHOST_EXPORT void ghostSetIsAcceptingPlayers(bool isAcceptingPlayers) {
  if (sIsAcceptingPlayers == isAcceptingPlayers) {
    return;
  }

  // TODO: tell agent we aren't accepting any more players
}

GHOST_EXPORT void ghostHeartbeat(int numConnectedPeers) {
  if (numConnectedPeers > 0) {
    sHeartbeatTimer.reset();
  }
}

void quit() {
  sShouldQuit = true;
  if (sLua != NULL) {
    sLua->exit();
  }
}

void checkHeartbeat() {
  while (sCastleUrl.empty() && !sShouldQuit) {
    sleep(100);
  }

  while (!sShouldQuit) {
    if (sGameTimer.elapsedTimeS() > DELAY_BEFORE_HEARTBEAT_TEST) {
      if (!sHeartbeatTimer.hasStarted() ||
          sHeartbeatTimer.elapsedTimeS() > HEARTBEAT_MAX_INTERVAL) {
        sCastleLogs->log("Heartbeat test failed. Shutting down.");
        quit();
      }
    }
    sleep(100);
  }
}

void my_handler(int s) {
  sCastleLogs->log("Caught signal %d", s);
  quit();
}

static Lua::DoneAction runlove(int argc, char **argv, int &retval) {
  while (sCastleUrl.empty() && !sShouldQuit) {
    sleep(0);
  }
  sCastleLogs->log("Done sleeping");
  if (sShouldQuit) {
    sCastleLogs->log("Quitting from runlove");
    return Lua::DONE_QUIT;
  }

  return sLua->execute(sCastleUrl, sPort, retval);
}

int main(int argc, char **argv) {
  char *portString = std::getenv("CASTLE_GAME_SERVER_PORT");
  if (portString == NULL) {
    std::cout << "CASTLE_GAME_SERVER_PORT is required" << std::endl;
    return 1;
  }
  sPort = atoi(portString);

  CastleHttpServer *httpServer = new CastleHttpServer(sPort);
  httpServer->start();

  std::string::size_type pos = std::string(argv[0]).find_last_of("\\/");
  sBinaryDirectory = std::string(argv[0]).substr(0, pos) + "/";

  sCastleLogs = new Logs(sBinaryDirectory);
  sCastleLogs->setPort(sPort);

  sLua = new Lua(sBinaryDirectory, sCastleLogs);

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

  sCastleLogs->log("Finished initializing");

  int retval = 0;
  Lua::DoneAction done = Lua::DONE_QUIT;

  std::thread heartbeatThread(checkHeartbeat);
  do {
    done = runlove(argc, argv, retval);
  } while (done != Lua::DONE_QUIT);

  sCastleLogs->log("Done running Lua");

  quit();
  heartbeatThread.join();

  return retval;
}
