import * as Actions from '~/common/actions';

export const getProductData = async () => {
  let data;
  let playlist = [];
  let featuredMedia = [];
  let allContent = {};
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
    allContent.media = data.allMedia ? data.allMedia : [];
    allContent.playlists = data.allPlaylists ? data.allPlaylists : [];
    allContent.users = data.allUsers ? data.allUsers : [];
    viewer = data.me;

    if (playlist) {
      featuredMedia = [...playlist.mediaItems];
    }
  }

  return { featuredMedia, allContent, viewer, isOffline };
};
