import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let playlist = [];
  let featuredMedia = [];
  let allMedia = [];
  let allPlaylists = [];
  let viewer;
  let isOffline = true;

  try {
    data = await Actions.getInitialData();
    playlist = await Actions.getPlaylist({ playlistId: 'playlist:ghost-games' });
  } catch (e) {
    console.log(e);
  }

  if (data) {
    isOffline = false;
    allMedia = data.allMedia ? data.allMedia : [];
    allPlaylists = data.allPlaylists ? data.allPlaylists : [];
    viewer = data.me;

    if (playlist) {
      featuredMedia = [...playlist.mediaItems];
    }
  }

  return { featuredMedia, allMedia, allPlaylists, viewer, isOffline };
};
