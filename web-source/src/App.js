import * as React from 'react';

import CoreApp from '~/core-components/CoreApp';

export default () => {
  const state = {
    url: '',
    viewer: null,
    isMediaFavorited: false,
    isMediaExpanded: true,
    isOverlayActive: true,
    isMediaInfoVisible: false,
    isDashboardVisible: false,
    isScoreVisible: false,
  };

  return <CoreApp state={state} />;
};
