import React from 'react';
import { TextInput, View } from 'react-native';

import * as GameScreen from './GameScreen';

const GameUrlInput = (props) => {
  return (
    <TextInput
      style={{
        width: '100%',
        borderRadius: 4,
        backgroundColor: '#00000010',
        borderColor: '#ccc',
        borderWidth: 0,
        paddingVertical: 8,
        paddingHorizontal: 12,
        fontSize: 16,
      }}
      placeholder="Paste a Castle game URL"
      returnKeyType="go"
      clearButtonMode="while-editing"
      onSubmitEditing={(e) => GameScreen.goToGame({ gameUri: e.nativeEvent.text })}
    />
  );
};

export default GameUrlInput;
