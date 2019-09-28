import React, { useState } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';

import * as Session from './Session';
import { navigateToUri } from './DeepLinks';

const textInputStyle = {
  width: '100%',
  borderColor: '#ddd',
  borderRadius: 4,
  borderWidth: 1,
  padding: 4,
  margin: 4,
};

const SignInScreen = () => {
  const { navigate } = useNavigation();

  const uriAfter = useNavigationParam('uriAfter');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onPressSignIn = async () => {
    await Session.signInAsync({ username, password });
    if (uriAfter) {
      navigateToUri(uriAfter);
    } else {
      navigate('GameScreen');
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '25%',
      }}>
      <TextInput
        style={textInputStyle}
        autoCapitalize="none"
        onChangeText={newUsername => setUsername(newUsername)}
      />
      <TextInput
        style={textInputStyle}
        secureTextEntry
        textContentType="password"
        onChangeText={newPassword => setPassword(newPassword)}
      />
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
