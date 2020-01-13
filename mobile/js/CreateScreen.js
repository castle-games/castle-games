import React from 'react';
import { View, Text } from 'react-native';

const CreateScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>New Card</Text>
    </View>
  );
};

export default CreateScreen;
