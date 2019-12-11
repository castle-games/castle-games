import gql from 'graphql-tag';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'uuid';
import md5 from 'md5';

import * as GhostEvents from './ghost/GhostEvents';
import * as GameScreen from './GameScreen';
import * as Session from './Session';

///
/// JS -> Lua for GraphQL entities
///

export const LUA_USER_FRAGMENT = gql`
  fragment LuaUser on User {
    userId
    username
    name
    photo {
      fileId
      url
    }
  }
`;

export const jsUserToLuaUser = async user =>
  user
    ? {
        userId: user.userId,
        username: user.username,
        name: user.name,
        photoUrl: user.photo ? user.photo.url : undefined,
      }
    : undefined;

export const jsPostToLuaPost = async ({ postId, creator, media }, { data }) => ({
  postId,
  creator: await jsUserToLuaUser(creator),
  mediaUrl: media ? media.url : undefined,
  data: data ? await Actions.postDataAsync({ postId }) : undefined,
});

export const LUA_GAME_FRAGMENT = gql`
  fragment LuaGame on Game {
    gameId
    owner {
      ...LuaUser
    }
    title
    url
    description
  }
  ${LUA_USER_FRAGMENT}
`;

export const jsGameToLuaGame = async ({ gameId, owner, title, url, description }) => ({
  gameId,
  owner: await jsUserToLuaUser(owner),
  title,
  url,
  description,
});

///
/// Lua -> JS -> Lua calls
///

let localStorageKey = '';
const awaitingLocalStorageKey = (async () => {
  localStorageKey = await AsyncStorage.getItem('LOCAL_STORAGE_KEY');
  if (!localStorageKey) {
    localStorageKey = uuid();
    await AsyncStorage.setItem('LOCAL_STORAGE_KEY', localStorageKey);
  }
})();

const storageIdForGame = async game => {
  if (game.storageId) {
    return game.storageId;
  } else if (game.isLocal) {
    await awaitingLocalStorageKey;
    return md5(localStorageKey + game.url);
  } else {
    return md5(game.url);
  }
};

export const JS = {
  // Test method called by 'ghost-tests'
  async sayHello({ name }) {
    if (name !== 'l') {
      console.log(`responding 'hello, ${name}' in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return `js: hello, ${name}!`;
    } else {
      console.log(`throwing an error in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error("js: 'l' not allowed!");
    }
  },

  // Game
  async gameLoad({ gameIdOrUrl, params }, { game }) {
    // Decide whether it's a `gameId` or a `gameUri`
    let gameId = null;
    let gameUri = null;
    if (gameIdOrUrl.includes('://')) {
      gameUri = gameIdOrUrl;
    } else {
      gameId = gameIdOrUrl;
    }

    // Go to game with current game as `referrerGame`! Don't steal focus if game was running in
    // the background..
    GameScreen.goToGame({
      gameId,
      gameUri,
      focus: false,
      extras: { referrerGame: game, initialParams: params },
    });
  },

  // Storage

  async storageGetGlobal({ key }, { game }) {
    const result = await Session.apolloClient.query({
      query: gql`
        query StorageGetGlobal($storageId: String!, $key: String!) {
          gameGlobalStorage(storageId: $storageId, key: $key) {
            value
          }
        }
      `,
      variables: { storageId: await storageIdForGame(game), key },
      fetchPolicy: 'no-cache',
    });
    if (result.errors && result.errors.length) {
      throw new Error(result.errors[0].message);
    }
    if (result.data && result.data.gameGlobalStorage && result.data.gameGlobalStorage.value) {
      return result.data.gameGlobalStorage.value;
    }
    return null;
  },

  async storageSetGlobal({ key, value }, { game }) {
    const result = await Session.apolloClient.mutate({
      mutation: gql`
        mutation StorageSetGlobal($storageId: String!, $key: String!, $value: String) {
          setGameGlobalStorage(storageId: $storageId, key: $key, value: $value)
        }
      `,
      variables: {
        storageId: await storageIdForGame(game),
        key,
        value: value === undefined ? null : value,
      },
      fetchPolicy: 'no-cache',
    });
    if (result.errors && result.errors.length) {
      throw new Error(result.errors[0].message);
    }
  },

  async storageGetUser({ key }, { game }) {
    const result = await Session.apolloClient.query({
      query: gql`
        query StorageGetUser($storageId: String!, $key: String!) {
          gameUserStorage(storageId: $storageId, key: $key) {
            value
          }
        }
      `,
      variables: { storageId: await storageIdForGame(game), key },
      fetchPolicy: 'no-cache',
    });
    if (result.errors && result.errors.length) {
      throw new Error(result.errors[0].message);
    }
    if (result.data && result.data.gameUserStorage && result.data.gameUserStorage.value) {
      return result.data.gameUserStorage.value;
    }
    return null;
  },

  async storageSetUser({ key, value }, { game }) {
    const result = await Session.apolloClient.mutate({
      mutation: gql`
        mutation StorageSetUser($storageId: String!, $key: String!, $value: String) {
          setGameUserStorage(storageId: $storageId, key: $key, value: $value)
        }
      `,
      variables: {
        storageId: await storageIdForGame(game),
        key,
        value: value === undefined ? null : value,
      },
      fetchPolicy: 'no-cache',
    });
    if (result.errors && result.errors.length) {
      throw new Error(result.errors[0].message);
    }
  },
};

const onJSCallRequest = context => async ({ id, methodName, arg }) => {
  const response = { id };
  try {
    const method = JS[methodName];
    if (method) {
      response.result = await method(arg, context);
    }
  } catch (e) {
    response.error = e.toString();
  }
  GhostEvents.sendAsync('JS_CALL_RESPONSE', response);
};

export const useLuaBridge = ({ eventsReady, game }) => {
  GhostEvents.useListen({
    eventsReady,
    eventName: 'JS_CALL_REQUEST',
    handler: onJSCallRequest({ game }),
  });
};
