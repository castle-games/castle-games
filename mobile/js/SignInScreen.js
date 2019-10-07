import React, { useState, Fragment } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import FastImage from 'react-native-fast-image';

import * as Session from './Session';
import { navigateToUri } from './DeepLinks';

const textInputStyle = {
  backgroundColor: '#fff',
  width: '100%',
  borderRadius: 4,
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
        backgroundColor: '#ffc21c',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}>
      <View
        style={{
          alignItems: 'center',
          paddingBottom: 16,
        }}>
        <FastImage
          style={{
            width: 100,
            aspectRatio: 1,
            marginBottom: 8,
          }}
          source={require('../src/assets/castle.png')}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: 'bold',
          }}>
          Castle
        </Text>
      </View>
      {signingIn ? (
        <Text>Signing in...</Text>
      ) : (
        <Fragment>
          {errored ? (
            <View style={{ paddingBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                There was a problem signing in.
              </Text>
              <Text>
                Please check your network connection and ensure that the username and password are
                correct.
              </Text>
            </View>
          ) : null}
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
              backgroundColor: '#000',
              borderRadius: 4,
              paddingVertical: 8,
              paddingHorizontal: 12,
              margin: 8,
              alignItems: 'center',
            }}
            onPress={onPressSignIn}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sign In</Text>
          </TouchableOpacity>
        </Fragment>
      )}
    </View>
  );
};

export default SignInScreen;
