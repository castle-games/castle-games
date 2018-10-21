import CastleApiClient from 'castle-api-client';

// export const API = CastleApiClient("http://localhost:1380");
// export const API = CastleApiClient('https://ghost-server.app.render.com');
// export const API = CastleApiClient('http://api.playcastle.io');
export const API = CastleApiClient('https://apis.playcastle.io');
// export const API = CastleApiClient();

const NESTED_USER = `
  user {
    userId
    name
    username
    createdTime
    isReal
    photo {
      url
      height
      width
    }
  }
`;

const MEDIA_ITEMS = `
  mediaItems {
    name
    published
    createdTime
    instructions
    description
    mediaUrl
    mediaId
    coverImage {
      url
      height
      width
    }
    ${NESTED_USER}
  }
`;

const PLAYLISTS = `
  playlists {
    playlistId
    name
    description
    createdTime
    coverImage {
      url
      height
      width
    }
    ${NESTED_USER}
    ${MEDIA_ITEMS}
  }
`;

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
          userId
          username
          name
          createdTime
          isReal
          photo {
            url
            height
            width
          }
          ${PLAYLISTS}
          ${MEDIA_ITEMS}
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

  return response;

}

export async function login({ userId, password }) {
  const response = await API.graphqlAsync(
    `
      mutation($userId: ID!, $password: String!) {
        login(userId: $userId, password: $password) {
          userId
          username
          name
          createdTime
          isReal
          photo {
            url
            height
            width
          }
          ${PLAYLISTS}
          ${MEDIA_ITEMS}
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
        ${MEDIA_ITEMS}
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

  return result.data.playlist;
}

export async function getUser({ userId }) {
  const variables = { userId };
  const result = await API(
    `
    query GetUser($userId: ID!) {
      user(userId: $userId) {
        userId
        username
        name
        createdTime
        isReal
        photo {
          url
          height
          width
        }
        ${PLAYLISTS}
        ${MEDIA_ITEMS}
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
        userId
        username
        name
        createdTime
        isReal
        photo {
          url
          height
          width
        }
        ${MEDIA_ITEMS}
        ${PLAYLISTS}
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
        userId
        username
        name
        createdTime
        isReal
        ${MEDIA_ITEMS}
        ${PLAYLISTS}
      }

      allMedia {
        name
        published
        createdTime
        description
        mediaUrl
        mediaId
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
        isReal
        photo {
          url
          height
          width
        }
      }

      allPlaylists {
        playlistId
        name
        description
        createdTime
        coverImage {
          height
          width
          imgixUrl
        }
        ${NESTED_USER}
        ${MEDIA_ITEMS}
      }
    }
  `);

  console.log(result);

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  return result.data;
}

export async function search(query) {
  const result = await API.graphqlAsync({
    query: `
      query SearchMediaAndPlaylists(
        $query: String
        $cursorPosition: Int
        $limit: Int
      ) {
        searchMediaAndPlaylists(
          query: $query
          cursorPosition: $cursorPosition
          limit: $limit
        ) {
          ${MEDIA_ITEMS}
          ${PLAYLISTS}
        }
      }
    `,
    variables: { query },
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.searchMediaAndPlaylists;
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

  return true;
}

export async function getMediaByURL({ mediaUrl }) {
  const variables = { mediaUrl };

  const result = await API.graphqlAsync({
    query: `
      query GetMediaByURL($mediaUrl: String!) {
        mediaByMediaUrl(mediaUrl: $mediaUrl) {
          name
          published
          createdTime
          instructions
          description
          mediaUrl
          mediaId
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

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.mediaByMediaUrl;
}

export async function addMedia({ name, url, description }) {
  const variables = {
    name,
    mediaUrl: url,
    description: JSON.stringify(description),
  };

  const result = await API.graphqlAsync({
    query: `
      mutation AddMedia($name: String, $mediaUrl: String, $description: String) {
        addMedia(media: {
          name: $name
          mediaUrl: $mediaUrl
          description: {
            rich: $description
          }
        }) {
          mediaId
        }
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.addMedia;
}

export async function addPlaylist({ name, description }) {
  const variables = { name, description: JSON.stringify(description) };

  const result = await API.graphqlAsync({
    query: `
      mutation AddPlaylist($name: String, $description: String) {
        addPlaylist(playlist: {
          name: $name
          description: {
            rich: $description
          }
        }) {
          playlistId
        }
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.addPlaylist;
}

export async function addMediaToPlaylist({ mediaId, playlistId }) {
  const variables = { mediaId, playlistId };

  const result = await API.graphqlAsync({
    query: `
      mutation AddPlaylistMediaItem($mediaId: ID!, $playlistId: ID!) {
        addPlaylistMediaItem(mediaId: $mediaId, playlistId: $playlistId) {
          playlistId
        }
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.addPlaylistMediaItem;
}

export async function removeMediaFromPlaylist({ mediaId, playlistId }) {
  const variables = { mediaId, playlistId };

  const result = await API.graphqlAsync({
    query: `
      mutation RemovePlaylistMediaItem($mediaId: ID!, $playlistId: ID!) {
        removePlaylistMediaItem(mediaId: $mediaId, playlistId: $playlistId) {
          playlistId
        }
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return result.data.removePlaylistMediaItem;
}

export async function removeMedia({ mediaId }) {
  const variables = { mediaId };

  const result = await API.graphqlAsync({
    query: `
      mutation RemoveMedia($mediaId: ID!) {
        deleteMedia(mediaId: $mediaId)
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return { mediaId };
}

export async function removePlaylist({ playlistId }) {
  const variables = { playlistId };

  const result = await API.graphqlAsync({
    query: `
      mutation RemovePlaylist($playlistId: ID!) {
        deletePlaylist(playlistId: $playlistId)
      }
    `,
    variables,
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return false;
  }

  if (result.errors) {
    return false;
  }

  return { playlistId };
}
