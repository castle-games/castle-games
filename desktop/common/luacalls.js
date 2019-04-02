import Logs from '~/common/logs';
import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';
import GameWindow from '~/native/gamewindow';

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
    const currentGame = GameWindow.getCurrentGame();
    if (!currentGame) {
      throw new Error('Global storage needs a running game!');
    }
    const gameId = currentGame.gameId;
    if (!gameId) {
      throw new Error('Global storage needs a published game!');
    }

    const result = await Actions.getGameGlobalStorageValueAsync({ gameId, key });
    return result ? result.value : null;
  },

  async storageSetGlobal({ key, value }) {
    const currentGame = GameWindow.getCurrentGame();
    if (!currentGame) {
      throw new Error('Global storage needs a running game!');
    }
    const gameId = currentGame.gameId;
    if (!gameId) {
      throw new Error('Global storage needs a published game!');
    }

    let result;
    if (value !== undefined && value !== null) {
      result = await Actions.upsertGameGlobalStorageAsync({ gameId, key, value });
    } else {
      result = await Actions.deleteGameGlobalStorageAsync({ gameId, key });
    }
    if (!result) {
      throw new Error('Global storage write failed!');
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
