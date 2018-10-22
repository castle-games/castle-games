import * as Actions from '~/common/actions';

export const getProductData = async () => {
	let data;
	let playlist1 = [];
	let playlist2 = [];
	let playlist3 = [];
	let featuredMedia = [];
	let featuredPlaylists = [];
	let allMedia = [];
	let allPlaylists = [];
	let viewer;
	let isOffline = true;

	try {
		data = await Actions.getInitialData();
		playlist1 = await Actions.getPlaylist({ playlistId: 'playlist:ludum-dare-42' });
		playlist2 = await Actions.getPlaylist({ playlistId: 'playlist:ghost-games' });
		playlist3 = await Actions.getPlaylist({ playlistId: 'playlist:jasons-favorites' });
	} catch (e) {
		console.log(e);
	}

	if (data) {
		isOffline = false;
		allMedia = data.allMedia ? data.allMedia : [];
		allPlaylists = data.allPlaylists ? data.allPlaylists : [];
		viewer = data.me;

		if (playlist1 && playlist2) {
			featuredPlaylists = [playlist1, playlist2];
		}

		if (playlist3) {
			featuredMedia = [...playlist3.mediaItems];
		}
	}

	return { featuredMedia, featuredPlaylists, allMedia, allPlaylists, viewer, isOffline };
};
