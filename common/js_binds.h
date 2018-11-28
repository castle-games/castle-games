#include <functional>

#include "json.hpp"

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

#define JS_BIND_REGISTER_NAMED(name, func) JSBinds::Register jsBindRegister_##name(#name, &func);

#define JS_BIND_DEFINE(name)                                                                       \
  void jsBindFunc_##name(const json &arg,                                                          \
                         std::function<void(const std::string &response)> success,                 \
                         std::function<void(const std::string &message)> failure);                 \
  JS_BIND_REGISTER_NAMED(name, jsBindFunc_##name);                                                 \
  void jsBindFunc_##name(const json &arg,                                                          \
                         std::function<void(const std::string &response)> success,                 \
                         std::function<void(const std::string &message)> failure)
