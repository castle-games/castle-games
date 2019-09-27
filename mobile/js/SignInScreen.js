import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';

const SignInScreen = () => {
  const { navigate } = useNavigation();

  const onPressSignIn = () => navigate('GameScreen');

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '25%',
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#ddd',
          borderRadius: 4,
          padding: 4,
          margin: 4,
          alignItems: 'center',
        }}
        onPress={onPressSignIn}>
        <Text>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;
