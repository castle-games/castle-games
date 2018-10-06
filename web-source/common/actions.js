import CastleApiClient from 'castle-api-client';

// export const API = CastleApiClient("http://localhost:1380");
export const API = CastleApiClient();

export async function getInitialData() {
  const result = await API(`
    query {
      me {
        userId
        username
        name
        createdTime

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

        playlists {
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
          playlists {
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

          playlists {
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

export async function addMedia({ name, url }) {
  const result = await API.graphqlAsync({
    query: `
      mutation AddMedia($name: String, $mediaUrl: String) {
        addMedia(media: {
          name: $name
          mediaUrl: $mediaUrl
        }) {
          name
          createdTime
          mediaUrl
          mediaId
        }
      }
    `,
    variables: { name, mediaUrl: url },
  });

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.addMedia;
}

export async function addPlaylist({ name }) {
  const result = await API.graphqlAsync({
    query: `
      mutation AddPlaylist($name: String) {
        addPlaylist(playlist: {
          name: $name
        }) {
          name
          playlistId
        }
      }
    `,
    variables: { name },
  });

  console.log(result);

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.addPlaylist;
}
