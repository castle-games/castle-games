import GhostApiClientConstructor from 'ghost-api-client';

// export const API = GhostApiClientConstructor("http://localhost:1380");
export const API = GhostApiClientConstructor();

export async function getInitialData() {
  const result = await API(`
    query {
      me {
        userId
        username
        name
        createdTime
      }

      currentPlaylist {
        playlistId
        name
        mediaItems {
          name
          published
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
            user {
              userId
              name
              username
            }
          }
          playlistItems {
            playlistId
            name
            mediaItems {
              name
              published
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
    variables: { query },
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
        }
      }
    `,
    variables: { username, password },
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
    `,
  });

  if (result.error) {
    return false;
  }

  return true;
}
