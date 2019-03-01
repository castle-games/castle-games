#ifndef __CASTLE_HT__CASTLE_HTTP_SERVER_H__TP_H__
#define __CASTLE_HTTP_SERVER_H__

#include "simple-web-server/server_http.hpp"
#include "json/json.hpp"
#include <string>

using json = nlohmann::json;

using namespace std;

using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;

class CastleHttpServer {
private:
  HttpServer mServer;
  int mPort;
  json (*mPollingCallback)();
  bool (*mGameStartCallback)(json);

public:
  CastleHttpServer(int port) { mPort = port; }

  void registerPollingCallback(json (*callback)()) { mPollingCallback = callback; };
  void registerGameStartCallback(bool (*callback)(json)) { mGameStartCallback = callback; };
  thread start();
  void stop() { mServer.stop(); }
};

#endif
