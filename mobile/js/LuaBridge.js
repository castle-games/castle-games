import gql from 'graphql-tag';

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
