import React from 'react';
import { View, StyleSheet } from 'react-native';

import GameUrlInput from './GameUrlInput';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  urlInput: {
    width: '100%',
    padding: 8,
  },
});

const DecksScreen = (props) => {
  return (
    <View style={styles.container}>
      <View style={styles.urlInput}>
        <GameUrlInput />
      </View>
    </View>
  );
};

export default DecksScreen;
