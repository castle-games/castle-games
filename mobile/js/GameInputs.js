import React from 'react';
import { View, Text } from 'react-native';

import GhostInputView from './ghost/GhostInputView';

const inputStyle = {
  width: 60,
  height: 60,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  margin: 8,
  backgroundColor: 'rgba(128, 128, 128, 0.5)',
};

const GameInputs = () => (
  <View
    pointerEvents="box-none"
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <GhostInputView style={inputStyle} input="up">
      <Text>^</Text>
    </GhostInputView>
    <GhostInputView style={inputStyle} input="down">
      <Text>V</Text>
    </GhostInputView>
    <GhostInputView style={inputStyle} input="left">
      <Text>{'<'}</Text>
    </GhostInputView>
    <GhostInputView style={inputStyle} input="right">
      <Text>{'>'}</Text>
    </GhostInputView>
  </View>
);

export default GameInputs;
