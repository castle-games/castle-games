import CastleApiClient from 'castle-api-client';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

// export const API = CastleApiClient('http://localhost:1380');
// export const API = CastleApiClient('https://ghost-server.app.render.com');
// export const API = CastleApiClient('http://api.playcastle.io');
export const API = CastleApiClient(Constants.API_HOST);
// export const API = CastleApiClient();

// fetches partial user data to support some owning object
const NESTED_USER = `
  user {
    userId
    name
    username
    photo {
      imgixUrl
      height
      width
    }
  }
`;

// fetches all the data needed to render a full user profile
const FULL_USER_FIELDS = `
  userId
  username
  name
  websiteUrl
  itchUsername
  twitterUsername
  createdTime
  updatedTime
  about
  photo {
    imgixUrl
    height
    width
  }
`;

const GAME_ITEMS = `
  gameItems {
    gameId
    name
    url
    createdTime
    updatedTime
    description
    coverImage {
      url
      imgixUrl
      height
      width
    }
    ${NESTED_USER}
  }
`;

const DEPRECATED_MEDIA_ITEMS = `
  mediaItems {
    name
    published
    createdTime
    updatedTime
    description
    mediaUrl
    mediaId
    coverImage {
      url
      imgixUrl
      height
      width
    }
    ${NESTED_USER}
  }
`;

export async function getHeadersAsync() {
  return await API.client._getRequestHeadersAsync();
}

export const delay = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export async function getExistingUser({ who }) {
  const response = await API.graphqlAsync(
    `
      query($who: String!) {
        userForLoginInput(who: $who) {
          userId
          name
          username
          photo {
            imgixUrl
            height
            width
          }
        }
      }
    `,
    { who }
  );

  // TOOD(jim): Write a global error handler.
  if (response.error) {
    return false;
  }

  if (response.errors) {
    return false;
  }

  return response.data.userForLoginInput;
}

export async function signup({ name, username, email, password }) {
  const response = await API.graphqlAsync(
    `
      mutation($name: String!, $username: String!, $email: String!, $password: String!) {
        signup(user: { name: $name, username: $username }, email: $email, password: $password) {
          ${FULL_USER_FIELDS}
          ${GAME_ITEMS}
          token
        }
      }
    `,
    {
      name,
      username,
      email,
      password,
    }
  );

  await API.client.setTokenAsync(response.data.signup.token);

  return response;
}

export async function login({ userId, password }) {
  const response = await API.graphqlAsync(
    `
      mutation($userId: ID!, $password: String!) {
        login(userId: $userId, password: $password) {
          ${FULL_USER_FIELDS}
          ${GAME_ITEMS}
          token
        }
      }
    `,
    {
      userId,
      password,
    }
  );

  // TOOD(jim): Write a global error handler.
  if (response.error) {
    return false;
  }

  if (response.errors) {
    return response;
  }

  NativeUtil.sendLuaEvent('CASTLE_SET_LOGGED_IN', !!response.data.login);
  await API.client.setTokenAsync(response.data.login.token);
  return response.data.login;
}

export async function getPlaylist({ playlistId }) {
  const variables = { playlistId };
  const result = await API(
    `
    query GetPlaylist($playlistId: ID!) {
      playlist(playlistId: $playlistId) {
        playlistId
        name
        description
        createdTime
        coverImage {
          imgixUrl
          height
          width
        }
        ${NESTED_USER}
        ${DEPRECATED_MEDIA_ITEMS}
      }
    }
  `,
    variables
  );

  if (!result) {
    return false;
  }

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.playlist;
}

export async function getUser({ userId }) {
  const variables = { userId };
  const result = await API(
    `
    query GetUser($userId: ID!) {
      user(userId: $userId) {
        ${FULL_USER_FIELDS}
        ${GAME_ITEMS}
      }
    }
  `,
    variables
  );

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.user;
}

export async function getViewer() {
  const result = await API(`
    query {
      me {
        ${FULL_USER_FIELDS}
        ${GAME_ITEMS}
      }
    }
  `);

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.me;
}

export async function getInitialData() {
  const result = await API(`
    query {
      me {
        ${FULL_USER_FIELDS}
        ${GAME_ITEMS}
      }

      allGames {
        gameId
        name
        url
        createdTime
        description
        coverImage {
          url
          height
          width
        }
        ${NESTED_USER}
      }

      allUsers {
        userId
        name
        username
        createdTime
        photo {
          imgixUrl
          height
          width
        }
      }
    }
  `);

  if (!result) {
    return false;
  }

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.data.me && result.data.me.userId) {
    amplitude.getInstance().setUserId(result.data.me.userId);
  }

  return result.data;
}

export async function logout() {
  const result = await API.graphqlAsync({
    query: `
      mutation {
        logout
      }
    `,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  NativeUtil.sendLuaEvent('CASTLE_SET_LOGGED_IN', false);
  await API.client.setTokenAsync(null);
  return true;
}

export async function getGameByUrl(url) {
  const variables = { url };

  let result = await API.graphqlAsync({
    query: `
    query GetGame($url: String!) {
      game(url: $url) {
        gameId
        name
        url
        createdTime
        description
        metadata
        coverImage {
          url
          height
          width
        }
        ${NESTED_USER}
      }
    }
    `,
    variables,
  });

  if (result.errors && result.errors.length) {
    throw new Error(`Unable to resolve game url: ${result.errors[0].message}`);
  }
  return result.data.game;
}

export async function uploadImageAsync({ file }) {
  const variables = { file };
  const result = await API.graphqlAsync({
    query: `
      mutation($file: Upload!) {
        uploadFile(file: $file) {
          fileId
          hash
          name
          encoding
          mimeType
          userId
          user {
            userId
            username
            name
          }
          uploadedTime
          width
          height
          originUrl
          imgixUrl
        }
      }
    `,
    variables,
  });

  // TODO(jim): Write a global error handler.
  if (result.error || result.errors || !result.data) {
    return false;
  }

  return result.data.uploadFile;
}

export async function setUserPhotoAsync({ userId, fileId }) {
  const variables = {
    userId,
    photoFileId: fileId,
  };
  const result = await API.graphqlAsync({
    query: `
      mutation ($userId: ID!, $photoFileId: ID!) {
       updateUser(
         userId: $userId
         user: { photoFileId: $photoFileId }
       ) {
         userId
         photo {
           imgixUrl
         }
       }
      }
    `,
    variables,
  });

  // TODO(jim): Write a global error handler.
  if (result.error || result.errors || !result.data) {
    return false;
  }

  return result.data.updateUser;
}

export async function updateUserAsync({ userId, user }) {
  const variables = {
    userId,
    ...user,
    about: JSON.stringify(user.about),
  };
  const result = await API.graphqlAsync({
    query: `
      mutation ($userId: ID!, $about: String, $name: String, $websiteUrl: String, $itchUsername: String, $twitterUsername: String) {
       updateUser(
         userId: $userId
         user: {
           about: { rich: $about }
           name: $name
           websiteUrl: $websiteUrl
           itchUsername: $itchUsername
           twitterUsername: $twitterUsername
         }
       ) {
         userId
       }
      }
    `,
    variables,
  });

  // TODO(jim): Write a global error handler.
  if (result.error || result.errors || !result.data) {
    return false;
  }

  return result.data.updateUser;
}

function _validateRegisterGameResult(result) {
  if (result.errors && result.errors.length) {
    const error = result.errors[0];
    const code = error.extensions ? error.extensions.code : '';
    if (code === 'REGISTER_GAME_DUPLICATE_URL') {
      throw new Error(`A game already exists in Castle with this url.`);
    } else if (code === 'REGISTER_GAME_DUPLICATE_SLUG') {
      throw new Error(`You have already added a game with this name.`);
    } else if (code === 'REGISTER_GAME_INVALID_USERNAME') {
      throw new Error(`The \`username\` given at this url does not match your username.`);
    } else {
      throw new Error(`There was a problem looking up the game at the url you provided: ${error.message}`);
    }
  }
  return true;
}

export async function registerGameAtUrl(url) {
  const variables = {
    url,
  };

  const result = await API.graphqlAsync({
    query: `
      mutation RegisterGame($url: String!) {
        registerGame(url: $url) {
          gameId,
          slug,
          name,
          url,
          description,
          createdTime,
          updatedTime,
        }
      }
    `,
    variables,
  });

  _validateRegisterGameResult(result);
  return result.data.registerGame;
}

export async function previewGameAtUrl(url) {
  const variables = {
    url,
  };

  const result = await API.graphqlAsync({
    query: `
      query PreviewGame($url: String!) {
        previewGame(url: $url) {
          slug,
          name,
          url,
          user {
            username,
          },
          description,
          createdTime,
          updatedTime,
        }
      }
    `,
    variables,
  });

  _validateRegisterGameResult(result);
  return result.data.previewGame;
}

export async function recordUserplayEndAsync(userplayId) {
  let result = await API.graphqlAsync(
    /* GraphQL */ `
      mutation($userplayId: ID!) {
        recordUserplayEnd(userplayId: $userplayId) {
          userId
        }
      }
    `,
    {
      userplayId,
    }
  );
}

// TODO: UserActivity
export async function recordUserplayStartAsync(mediaUrl, mediaId) {
  return await API.graphqlAsync(
    /* GraphQL */ `
      mutation($mediaId: ID, $mediaUrl: String) {
        recordUserplayStart(mediaId: $mediaId, mediaUrl: $mediaUrl) {
          userplayId
        }
      }
    `,
    {
      mediaId,
      mediaUrl,
    }
  );
}

// TODO: UserActivity
export async function recordUserplayPingAsync(userplayId) {
  return await API.graphqlAsync(
    /* GraphQL */ `
      mutation($userplayId: ID!) {
        recordUserplayPing(userplayId: $userplayId) {
          userplayId
        }
      }
    `,
    {
      userplayId,
    }
  );
}

// TODO: media -> game
export async function multiplayerJoinAsync(mediaUrl) {
  let result;
  try {
    result = await API.graphqlAsync(
      /* GraphQL */ `
        mutation($mediaUrl: String!) {
          multiplayerJoin(mediaUrl: $mediaUrl)
        }
      `,
      {
        mediaUrl,
      }
    );
  } catch (e) {
    return false;
  }

  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.multiplayerJoin;
}
