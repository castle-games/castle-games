// `NativeBinds.<name>(arg)` calls the `JS_BIND_DEFINE`'d function with '<name>', passing `arg` as
// the only parameter. Returns a `Promise` that is resolved with the `success` response when calling
// that function. If no such function exists or the found function throws a failure, the `Promise`
// is rejected with the error message.
export const NativeBinds = new Proxy(
  {},
  {
    get(self, name) {
      if (name in self) {
        // Memoize
        return self[name];
      } else {
        const wrapper = async (arg) => {
          if (!window.cefQuery) {
            console.error(`\`NativeBinds.${name}\`: \`window.cefQuery\` is not defined`);
            return [];
          }

          return new Promise((resolve, reject) => {
            window.cefQuery({
              request: JSON.stringify({ name: name, arg: arg }),
              onSuccess: resolve,
              onFailure(code, message) {
                reject(new Error(message));
              },
            });
          });
        };
        self[name] = wrapper;
        return wrapper;
      }
    },
  }
);
