#include <functional>

#include "json.hpp"

// Registered functions are available under `NativeBinds.` in JavaScript

using json = nlohmann::json;

namespace JSBinds {
typedef void (*Function)(const json &arg, std::function<void(const std::string &response)> success,
                         std::function<void(const std::string &message)> failure);

class Register {
public:
  Register(const char *name, Function function);
};

Function find(const char *name);
} // namespace JSBinds

#define JS_BIND_REGISTER_NAMED(name, func)                                                         \
  static JSBinds::Register jsBindRegister_##name(#name, &func);

#define JS_BIND_DEFINE(name)                                                                       \
  static void jsBindFunc_##name(const json &arg,                                                   \
                                std::function<void(const std::string &response)> success,          \
                                std::function<void(const std::string &message)> failure);          \
  JS_BIND_REGISTER_NAMED(name, jsBindFunc_##name);                                                 \
  static void jsBindFunc_##name(const json &arg,                                                   \
                                std::function<void(const std::string &response)> success,          \
                                std::function<void(const std::string &message)> failure)
