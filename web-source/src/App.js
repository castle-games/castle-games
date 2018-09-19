import * as React from 'react';
import * as Fixtures from '~/common/fixtures';

import CoreApp from '~/core-components/CoreApp';

// NOTE(jim): The entire initial state of the application can be represented here.
// There is only one JavaScript object at the root that represents local state.

export default () => {
  const state = {
    logs: [],
    url: Fixtures.CurrentPlaylist.mediaItems[0].url,
    playlist: Fixtures.CurrentPlaylist,
    media: Fixtures.CurrentPlaylist.mediaItems[0],
    viewer: null,
    local: null,
    searchQuery: '',
    searchResultsMedia: null,
    searchResultsPlaylists: null,
    sidebarMode: null, // current-playlists | dashboard | media-info | authentication | null
    pageMode: null, // browse | playlist | profile | null
    profileMode: null, // media | playlist | null
    isMediaFavorited: false,
    isMediaExpanded: true,
    isOverlayActive: true,
    isScoreVisible: false,
  };

  return <CoreApp state={state} />;
};
