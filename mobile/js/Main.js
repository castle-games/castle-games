import React from 'react';
import { View } from 'react-native';

import GameScreen from './GameScreen';

// const DEFAULT_GAME_URI =
//   'https://raw.githubusercontent.com/castle-games/ghost-tests/master/screensize/project-defaults.castle';
const DEFAULT_GAME_URI =
  'https://raw.githubusercontent.com/schazers/badboxart/master/robosquash.castle';

const Main = () => (
  <View style={{ flex: 1 }}>
    <GameScreen gameUri={DEFAULT_GAME_URI} />
  </View>
);

export default Main;
