import Logs from '~/common/logs';
import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';
import GameWindow from '~/native/gamewindow';

// Utility: get the `storageId` for a registered game or generate one if unregistered
const storageIdForCurrentGame = () => {
  const currentGame = GameWindow.getCurrentGame();
  if (!currentGame) {
    throw new Error('Global storage needs a running game');
  }
  const storageId = currentGame.storageId;
  if (!storageId) {
    throw new Error("Storage for unregistered games is currently not implemented"); // TODO(nikki): Implement!
  }
  return storageId;
};

// Methods callable as `jsCall.<methodName>(arg)` from Lua. Can be `async `. Should be called from
// a network coroutine in Lua. Blocks the coroutine till a response (return value, error thrown,
// promise resolution or rejection) is received.
const methods = {
  // Test method called by 'ghost-tests'
  async sayHello({ name }) {
    if (name !== 'l') {
      Logs.system(`responding 'hello, ${name}' in 2 seconds...`);
      await Actions.delay(2000);
      return `hello, ${name}!`;
    } else {
      Logs.system(`throwing an error in 2 seconds...`);
      await Actions.delay(2000);
      throw new Error("'l' not allowed!");
    }
  },

  // Storage

  async storageGetGlobal({ key }) {
    const storageId = storageIdForCurrentGame();
    const result = await Actions.getGameGlobalStorageValueAsync({ storageId, key });
    return result ? result.value : null;
  },

  async storageSetGlobal({ key, value }) {
    const storageId = storageIdForCurrentGame();
    const result = await Actions.setGameGlobalStorageAsync({
      storageId,
      key,
      value: value === undefined ? null : value, // Normalize to `null` for deletes
    });
    if (!result) {
      throw new Error('Global storage write failed!');
    }
  },

  async storageGetUser({ key }) {
    const storageId = storageIdForCurrentGame();
    const result = await Actions.getGameUserStorageValueAsync({ storageId, key });
    return result ? result.value : null;
  },

  async storageSetUser({ key, value }) {
    const storageId = storageIdForCurrentGame();
    const result = await Actions.setGameUserStorageAsync({
      storageId,
      key,
      value: value === undefined ? null : value, // Normalize to `null` for deletes
    });
    if (!result) {
      throw new Error('User storage write failed!');
    }
  },
};

const onReceiveRequest = async (e) => {
  const response = { id: e.params.id };
  try {
    const methodName = e.params.methodName;
    const method = methods[methodName];
    if (!method) {
      throw new Error(`Unknown method '${methodName}'`);
    }
    response.result = await method(e.params.arg);
  } catch (err) {
    response.error = err.toString();
  }
  NativeUtil.sendLuaEvent('JS_CALL_RESPONSE', response);
};

export const addEventListeners = () => {
  window.addEventListener('JS_CALL_REQUEST', onReceiveRequest);
};

export const removeEventListeners = () => {
  window.removeEventListener('JS_CALL_REQUEST', onReceiveRequest);
};
