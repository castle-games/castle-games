import React from 'react';
import { View, Text } from 'react-native';

const ProfileScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Welcome to your profile!</Text>
    </View>
  );
};

export default ProfileScreen;
