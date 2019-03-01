#ifndef __CASTLE_HT__CASTLE_HTTP_SERVER_H__TP_H__
#define __CASTLE_HTTP_SERVER_H__

class CastleHttpServer {
private:
  int mPort;

public:
  CastleHttpServer(int port) { mPort = port; }

  void start();
};

#endif
