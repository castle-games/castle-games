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

Register::Register(const char * name, Function function) {
  accessRegistry(name, function);
}

Function find(const char *name) {
  return accessRegistry(name, nullptr);
}
  
}

JS_BIND_DEFINE(hello, arg, success, failure) {
  const std::string &name = arg["name"];
  printf("hello called with name: %s\n", name.c_str());
  success("hello, " + name);
}
