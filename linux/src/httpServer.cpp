#include "httpServer.h"

thread CastleHttpServer::start() {
  mServer.config.port = mPort;

  mServer.resource["^/set_url$"]["POST"] = [this](shared_ptr<HttpServer::Response> response,
                                                  shared_ptr<HttpServer::Request> request) {
    auto content = request->content.string();
    if (mGameUrlCallback(content)) {
      response->write("ok!");
    } else {
      response->write("error!");
    }
  };

  mServer.resource["^/poll$"]["GET"] = [this](shared_ptr<HttpServer::Response> response,
                                              shared_ptr<HttpServer::Request> request) {
    json j = mPollingCallback();

    SimpleWeb::CaseInsensitiveMultimap header;
    header.emplace("Content-Type", "application/json");

    response->write(j.dump(), header);
  };

  mServer.on_error = [](shared_ptr<HttpServer::Request> request, const SimpleWeb::error_code &ec) {
    // Handle errors here
    // Note that connection timeouts will also call this handle with ec set to
    // SimpleWeb::errc::operation_canceled

    std::cout << "on server err: " << ec.message() << std::endl;
  };

  thread server_thread([this]() {
    // Start server
    mServer.start();
  });

  return server_thread;
}
