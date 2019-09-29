import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Welcome home!</Text>
    </View>
  );
};

export default HomeScreen;
