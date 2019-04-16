import * as uuid from 'uuid/v4';
import * as Actions from '~/common/actions';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';

import md5 from 'md5';
import Logs from '~/common/logs';
import GameWindow from '~/native/gamewindow';
import Storage from '~/common/storage';

const storage = new Storage('castle');
let localStorageKey = storage.getItem('localStorageKey');
if (!localStorageKey) {
  localStorageKey = uuid();
  storage.setItem('localStorageKey', localStorageKey);
}

// Utility: get the `storageId` for a registered game or generate one if unregistered
const storageIdForCurrentGame = () => {
  const currentGame = GameWindow.getCurrentGame();
  if (!currentGame) {
    throw new Error('Global storage needs a running game');
  }
  if (currentGame.storageId) {
    return currentGame.storageId;
  } else {
    const url = currentGame.url;
    if (Urls.isPrivateUrl(url)) {
      return md5(localStorageKey + url);
    } else {
      return md5(url);
    }
  }
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

  // Post

  async postCreate({ message, data }) {
    // Get the current game and make sure it has a `.gameId` (is registered)
    const currentGame = GameWindow.getCurrentGame();
    if (!currentGame) {
      throw new Error('Post creation needs a running game');
    }
    if (!currentGame.gameId) {
      throw new Error(
        'Post creation needs the running game to have a `gameId` -- is it registered?'
      );
    }

    // Let user edit the message and confirm posting, or cancel
    message = prompt(`Create a post from '${currentGame.title}'`, message);
    if (message === null) {
      return null;
    }

    // Create the post!
    return await Actions.createPostAsync({
      sourceGameId: currentGame.gameId,
      message,
      data
    });
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
