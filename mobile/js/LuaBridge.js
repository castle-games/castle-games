///
/// Data conversion
///

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

export const jsGameToLuaGame = async ({ gameId, owner, title, url, description }) => ({
  gameId,
  owner: await jsUserToLuaUser(owner),
  title,
  url,
  description,
});
