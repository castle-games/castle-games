import GhostApiClientConstructor from "ghost-api-client";

// export const API = GhostApiClientConstructor("http://localhost:1380");
export const API = GhostApiClientConstructor();

export async function getCurrentJamPlaylist() {
  const result = await API(/* GraphQL */ `
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
  return result.data.currentPlaylist;
}
