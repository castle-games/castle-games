import CastleApiClient from "castle-api-client";

// export const API = CastleApiClient("http://localhost:1380");
export const API = CastleApiClient();

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
        playlists {
          playlistId
          name
          description
          createdTime
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
          }
        }
        mediaItems {
          name
          published
          createdTime
          instructions
          description
          mediaUrl
          mediaId
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
        }
      }
    }
  `,
    variables
  );

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.user;
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
        }

        playlists {
          playlistId
          name
          description
          createdTime
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
          }
        }
      }

      currentPlaylist {
        playlistId
        name
        description
        createdTime
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
        }
      }
    }
  `);

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
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
          mediaItems {
            mediaId
            mediaUrl
            name
            createdTime
            published
            user {
              userId
              name
              username
            }
          }
          playlists {
            playlistId
            name
            description
            createdTime
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
            mediaItems {
              name
              published
              createdTime
              instructions
              description
              mediaUrl
              coverImage {
                url
                height
                width
              }
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
            }
          }
        }
      }
    `,
    variables: { query }
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.searchMediaAndPlaylists;
}

export async function authenticate({ username, password }) {
  const result = await API.graphqlAsync({
    query: `
      mutation Login($username: String, $password: String!) {
        login(who: $username, password: $password) {
          userId
          username
          name
          createdTime

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
          }

          playlists {
            playlistId
            name
            createdTime
            description
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
            }
          }
        }
      }
    `,
    variables: { username, password }
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.login;
}

export async function logout() {
  const result = await API.graphqlAsync({
    query: `
      mutation {
        logout
      }
    `
  });

  if (result.error) {
    return false;
  }

  return true;
}

export async function addMedia({ name, url, description }) {
  const variables = {
    name,
    mediaUrl: url,
    description: JSON.stringify(description)
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
        }
      }
    `,
    variables
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
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
          name
          description
          playlistId
          createdTime
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
        }
      }
    `,
    variables
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.addPlaylist;
}

export async function removeMedia({ mediaId }) {
  const variables = { mediaId };

  const result = await API.graphqlAsync({
    query: `
      mutation RemoveMedia($mediaId: ID!) {
        deleteMedia(mediaId: $mediaId)
      }
    `,
    variables
  });

  if (result.error) {
    return;
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
    variables
  });

  if (result.error) {
    return;
  }

  return { playlistId };
}
