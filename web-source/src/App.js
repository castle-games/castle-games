import * as React from 'react';
import * as Fixtures from '~/common/fixtures';

import Storage from '~/common/storage';
import CoreApp from '~/core-components/CoreApp';

// NOTE(jim): The entire initial state of the application can be represented here.
// There is only one JavaScript object at the root that represents local state.

const storage = new Storage('castle');

export default () => {
  const state = {
    logs: [],
    mediaUrl: '',
    playlist: null,
    media: null,
    viewer: null,
    local: null,
    searchQuery: '',
    searchResultsMedia: null,
    searchResultsPlaylists: null,
    sidebarMode: null, // current-playlists | dashboard | media-info | authentication | null
    pageMode: 'sign-in', // browse | playlist | profile | sign-in | null
    profileMode: null, // media | playlist | null
    isMediaFavorited: false,
    isMediaExpanded: true,
    isOverlayActive: true,
    isScoreVisible: false,
  };

  return <CoreApp state={state} storage={storage} />;
};
