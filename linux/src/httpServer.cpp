#include "httpServer.h"
#include "simple-web-server/server_http.hpp"

using namespace std;

using HttpServer = SimpleWeb::Server<SimpleWeb::HTTP>;

void CastleHttpServer::start() {
  HttpServer server;
  server.config.port = mPort;

  server.resource["^/string$"]["POST"] = [](shared_ptr<HttpServer::Response> response,
                                            shared_ptr<HttpServer::Request> request) {
    std::cout << "in post" << std::endl;
    // Retrieve string:
    auto content = request->content.string();
    // request->content.string() is a convenience function for:
    // stringstream ss;
    // ss << request->content.rdbuf();
    // auto content=ss.str();

    *response << "HTTP/1.1 200 OK\r\nContent-Length: " << content.length() << "\r\n\r\n" << content;

    // Alternatively, use one of the convenience functions, for instance:
    // response->write(content);
  };

  server.default_resource["GET"] = [](shared_ptr<HttpServer::Response> response,
                                      shared_ptr<HttpServer::Request> request) {
    std::cout << "in get" << std::endl;
    response->write("works!");
  };

  server.on_error = [](shared_ptr<HttpServer::Request> /*request*/,
                       const SimpleWeb::error_code & /*ec*/) {
    // Handle errors here
    // Note that connection timeouts will also call this handle with ec set to
    // SimpleWeb::errc::operation_canceled
    std::cout << "on err" << std::endl;
  };

  thread server_thread([&server]() {
    std::cout << "started server" << std::endl;
    // Start server
    server.start();
  });

  server_thread.join();
}
