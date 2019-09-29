import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { RootNavigator } from './Navigation';
import GameScreen from './GameScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export let switchTo = () => {};

const Page = ({ visible, children }) => (
  <View
    style={{
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      zIndex: visible ? 20 : 10,
    }}>
    {children}
  </View>
);

const MainSwitcher = () => {
  // `mode` is one of `'game'` or `'navigator'`
  const [mode, setMode] = useState('navigator');

  switchTo = setMode;

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <TouchableOpacity
        style={{ backgroundColor: '#ddd', padding: 4, alignItems: 'center' }}
        onPress={() => setMode(mode === 'game' ? 'navigator' : 'game')}>
        <Text>{mode === 'game' ? 'Go to Castle' : 'Go to Game'}</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Page visible={mode === 'game'}>
          <GameScreen />
        </Page>
        <Page visible={mode === 'navigator'}>
          <RootNavigator />
        </Page>
      </View>
    </View>
  );
};

export default MainSwitcher;
