import gql from 'graphql-tag';

import * as GhostEvents from './ghost/GhostEvents';
import * as GameScreen from './GameScreen';

///
/// JS -> Lua for GraphQL entities
///

export const LUA_USER_FRAGMENT = gql`
  fragment LuaUser on User {
    userId
    username
    name
    photo {
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
/// LUA -> JS -> LUA
///

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
