import React, { useState, Fragment } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';

import * as Session from './Session';
import { navigateToUri } from './DeepLinks';

const textInputStyle = {
  width: '100%',
  borderColor: '#ddd',
  borderRadius: 4,
  borderWidth: 1,
  paddingVertical: 8,
  paddingHorizontal: 12,
  marginVertical: 8,
};

const SignInScreen = () => {
  const { navigate } = useNavigation();

  const uriAfter = useNavigationParam('uriAfter');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [signingIn, setSigningIn] = useState(false);
  const [errored, setErrored] = useState(false);

  const onPressSignIn = async () => {
    try {
      setSigningIn(true);
      setErrored(false);
      await Session.signInAsync({ username, password });
      setSigningIn(false);
      if (uriAfter) {
        navigateToUri(uriAfter);
      } else {
        navigate('HomeScreen');
      }
    } catch (e) {
      setSigningIn(false);
      setErrored(true);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}>
      {signingIn ? (
        <Text>Signing in...</Text>
      ) : (
        <Fragment>
          <TextInput
            style={textInputStyle}
            autoCapitalize="none"
            onChangeText={newUsername => setUsername(newUsername)}
            autoFocus={true}
            placeholder="Email or username"
          />
          <TextInput
            style={textInputStyle}
            secureTextEntry
            textContentType="password"
            onChangeText={newPassword => setPassword(newPassword)}
            placeholder="Password"
          />
          <TouchableOpacity
            style={{
              backgroundColor: '#ddd',
              borderRadius: 4,
              paddingVertical: 8,
              paddingHorizontal: 12,
              margin: 8,
              alignItems: 'center',
            }}
            onPress={onPressSignIn}>
            <Text>Sign In</Text>
          </TouchableOpacity>
          {errored ? (
            <Text style={{ color: '#d00' }}>
              Error signing in. Please check your network connection and ensure that the username
              and password are correct.
            </Text>
          ) : null}
        </Fragment>
      )}
    </View>
  );
};

export default SignInScreen;
