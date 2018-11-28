#include "js_binds.h"

#include <string>
#include <unordered_map>

namespace JSBinds {

// If `function` is not `nullptr`, puts it at `name` in the registry and returns it.
// If `function` is `nullptr`, returns the `Function` previously put at `name` in the registry.
static Function accessRegistry(const char *name, Function function) {
  static auto registry = new std::unordered_map<std::string, Function>();
  if (function) {
    (*registry)[std::string(name)] = function;
  } else {
    function = (*registry)[std::string(name)];
  }
  return function;
}

Register::Register(const char *name, Function function) { accessRegistry(name, function); }

Function find(const char *name) { return accessRegistry(name, nullptr); }

} // namespace JSBinds

#include "ghost.h"
#include "ghost_constants.h"

#include "modules/thread/Channel.h"

// Three names are defined in function bodies:
//   `arg`: a `json` passed as the argument
//   `success`: call this with a string to send back a successful response
//   `failure`: call this with a string to send back an error message

JS_BIND_DEFINE(hello) {
  const std::string &name = arg["name"];
  printf("hello called with name: %s\n", name.c_str());
  success("hello, " + name);
}

JS_BIND_DEFINE(openUri) {
  std::string uri = arg["uri"];
  ghostOpenLoveUri(uri.c_str());
  success("success");
}

JS_BIND_DEFINE(close) {
  ghostClose();
  success("success");
}

JS_BIND_DEFINE(setChildWindowFrame) {
  float left = arg["left"];
  float top = arg["top"];
  float width = arg["width"];
  float height = arg["height"];
  ghostSetChildWindowFrame(left, top, width, height);
  success("success");
}

JS_BIND_DEFINE(readChannels) {
  static lua_State *conversionLuaState = lua_open();

  auto response = json::object();

  for (const std::string &channelName : arg["channelNames"]) {
    response[channelName] = json::array();
    auto channel = love::thread::Channel::getChannel(channelName);
    love::Variant var;
    while (channel->pop(&var)) {
      assert(var.getType() == love::Variant::STRING || var.getType() == love::Variant::SMALLSTRING);
      var.toLua(conversionLuaState);
      std::string str(luaL_checkstring(conversionLuaState, -1));
      response[channelName].push_back(str);
      lua_pop(conversionLuaState, 1);
    }
  }

  success(response.dump());
}

JS_BIND_DEFINE(browserReady) {
  ghostSetBrowserReady();
  success("success");
}

JS_BIND_DEFINE(openExternalUrl) {
  std::string url = arg["url"];
  ghostOpenExternalUrl(url.c_str());
  success("success");
}

JS_BIND_DEFINE(writeChannels) {
  auto channelData = arg["channelData"];
  for (auto it = channelData.begin(); it != channelData.end(); ++it) {
    std::string name = it.key();
    auto channel = love::thread::Channel::getChannel(name);
    for (std::string val : it.value()) {
      // Explicitly pass `.length()` because `val` may be in UTF-8
      channel->push(love::Variant(val.c_str(), val.length()));
    }
  }
}
