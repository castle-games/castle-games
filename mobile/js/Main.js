import React from 'react';
import { View } from 'react-native';

import './ghost/GhostConsole';
import GhostView from './ghost/GhostView';
// import './GhostMultiplayer';

// const DEFAULT_GAME_URI =
//   'https://raw.githubusercontent.com/castle-games/ghost-tests/d69f1e4e96add56d7aec8772acb9a2378a367fee/screensize/main.lua';
const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/castle-games/ghost-tests/master/log-touches/main.lua';

const Main = () => (
  <View style={{ flex: 1 }}>
    <GhostView
      style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
      uri={DEFAULT_GAME_URI}
    />
  </View>
);

export default Main;
