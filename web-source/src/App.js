import * as React from 'react';

import CoreApp from '~/core-components/CoreApp';

export default () => {
  const state = {
    url: '',
    viewer: null,
    sidebarMode: null, // dashboard | media-info | null
    pageMode: null, // browse | playlist | profile | null
    isMediaFavorited: false,
    isMediaExpanded: true,
    isOverlayActive: true,
    isScoreVisible: false,
  };

  return <CoreApp state={state} />;
};
