import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { RootNavigator } from './Navigation';
import GameScreen from './GameScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

export let switchTo = () => {};

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  windowed: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    zIndex: 1,
    backgroundColor: '#000',
    width: 135,
    height: 240,
    borderRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  }
});

const MainSwitcher = () => {
  // `mode` is one of `'game'` or `'navigator'`
  const [mode, setMode] = useState('navigator');

  switchTo = setMode;

  return (
    <View style={{ flex: 1, backgroundColor: 'white', position: 'relative' }}>
      <View style={{ flex: 1 }}>
        <View style={ mode === 'game' ? styles.fullscreen : styles.windowed }>
          <GameScreen />
            { mode === 'navigator' &&
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}>
                <TouchableOpacity onPress={() => {
                  setMode('game');
                }}>
                  <View style={{
                    width: '100%',
                    height: '100%',
                  }}>
                  </View>
                </TouchableOpacity>
              </View>
            }
        </View>
        { mode === 'game' &&
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            width: '100%',
            backgroundColor: '#fff',
            paddingVertical: 8,
            paddingHorizontal: 16,
          }}>
            <TouchableOpacity onPress={() => {
              setMode('navigator');
            }}>
              <Text>Return to Castle</Text>
            </TouchableOpacity>
          </View>
        }
        <RootNavigator />
      </View>
    </View>
  );
};

export default MainSwitcher;
