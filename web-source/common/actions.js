import GhostApiClientConstructor from 'ghost-api-client';

// export const API = GhostApiClientConstructor("http://localhost:1380");
export const API = GhostApiClientConstructor();

export async function getCurrentJamPlaylist() {
  const result = await API(`
    query {
      currentPlaylist {
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
  `);

  // TOOD(jim): Write a global error handler.
  if (result.error) {
    return;
  }

  return result.data.currentPlaylist;
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
