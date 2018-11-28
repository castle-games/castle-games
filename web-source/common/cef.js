// `NativeBinds.<name>(arg)` calls the `JS_BIND_DEFINE`'d function with '<name>', passing `arg` as
// the only parameter. Returns a `Promise` that is resolved with the `success` response when calling
// that function. If no such function exists or the found function throws a failure, the `Promise`
// is rejected with the error message.
export const NativeBinds = new Proxy({}, {
  get(self, name) {
    if (name in self) { // Memoize
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
  }
});

let logId = 1;
export const getLogs = async () => {
  const channelsJson = await NativeBinds.readChannels({ channelNames: ['PRINT', 'ERROR'] });
  const channels = JSON.parse(channelsJson);

  const logs = [];
  channels.PRINT.map(json => {
    const params = JSON.parse(json);
    let logText;
    if (params && Array.isArray(params)) {
      logText = params.join(' ');
    } else {
      logText = '(nil)';
    }
    logs.push({ id: logId, type: 'print', text: `${logText}` });
    logId = logId + 1;
  });
  channels.ERROR.map(json => {
    const { error, stacktrace } = JSON.parse(json);
    logs.push({ id: logId, type: 'error', text: error, details: stacktrace });
    logId = logId + 1;
  });
  return logs;
};

export const chooseDirectoryWithDialogAsync = async ({ title, message, action }) => {
  let chosenDirectory;
  try {
    chosenDirectory = await NativeBinds.chooseDirectoryWithDialog({ title, message, action });
  } catch (e) {
    // TODO: handle
  }
  return chosenDirectory;
};

export const setMultiplayerSessionInfo = async (info) => {
  await NativeBinds.writeChannels({
    channelData: {
      MULTIPLAYER_SESSION_INFO: [ // This name must match channel name query in Lua code
        JSON.stringify(info),
      ],
    },
  });
};

export const setBrowserReady = async callback => {
  await NativeBinds.browserReady();
  if (callback) {
    return callback();
  }
};

export const openWindowFrame = async mediaUrl => {
  await NativeBinds.openUri({ uri: mediaUrl });
};

export const openExternalURL = async externalUrl => {
  await NativeBinds.openExternalUrl({ url: externalUrl });
};

export const updateWindowFrame = async rect => {
  await NativeBinds.setChildWindowFrame({
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  });
};

export const closeWindowFrame = async () => {
  await NativeBinds.close();
};
