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
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ flex: 1 }}>
        <Page visible={mode === 'game'}>
          <GameScreen />
          <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              backgroundColor: '#fff',
              width: '100%',
              padding: 16,
            }}>
            <TouchableOpacity onPress={() => {
              setMode('navigator');
              console.log(mode);
            }}>
              <Text style={{ fontSize: 18 }}>Return to Castle</Text>
            </TouchableOpacity>
          </View>
        </Page>
        <Page visible={mode === 'navigator'}>
          <RootNavigator />
          <View style={{
            position: 'absolute',
            bottom: 64,
            left: 16,
            zIndex: 1,
            backgroundColor: '#eee',
            width: 90,
            height: 160,
            borderRadius: 8,
            justifyContent: 'center',
            elevation: 5,
          }}>
            <TouchableOpacity onPress={() => {
              setMode('game');
              console.log(mode);
            }}>
              <Text>Return to Game</Text>
            </TouchableOpacity>
          </View>
        </Page>
      </View>
    </View>
  );
};

export default MainSwitcher;
