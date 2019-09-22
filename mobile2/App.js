import React from 'react';
import { View } from 'react-native';

import './js/GhostConsole';
import GhostView from './js/GhostView';
// import './js/GhostMultiplayer';

const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/castle-games/ghost-tests/d69f1e4e96add56d7aec8772acb9a2378a367fee/screensize/main.lua';

const App = () => (
  <View style={{ backgroundColor: 'black', flex: 1 }}>
    <GhostView
      style={{ backgroundColor: 'black', width: '100%', height: '100%' }}
      uri={DEFAULT_GAME_URI}
    />
  </View>
);

export default App;
