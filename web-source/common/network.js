import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let user;
  let playlist = [];
  let featuredMedia = [];
  let featuredPlaylists = [];
  let allMedia = [];
  let allPlaylists = [];
  let viewer;
  let isOffline = true;

  try {
    data = await Actions.getInitialData();
    user = await Actions.getUser({ userId: 'user:castle' });
    playlist = await Actions.getPlaylist({ playlistId: 'playlist:jasons-favorites' });
  } catch (e) {
    console.log(e);
  }

  if (data) {
    isOffline = false;
    allMedia = data.allMedia ? data.allMedia : [];
    allPlaylists = data.allPlaylists ? data.allPlaylists : [];
    viewer = data.me;

    if (user) {
      featuredPlaylists = [...user.playlists];
    }

    if (playlist) {
      featuredMedia = [...playlist.mediaItems];
    }
  }

  return { featuredMedia, featuredPlaylists, allMedia, allPlaylists, viewer, isOffline };
};
