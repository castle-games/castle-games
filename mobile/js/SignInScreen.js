import React, { useState, Fragment } from 'react';
import { View, TouchableOpacity, Text, TextInput, StatusBar } from 'react-native';
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

const Announcement = props => {
  return (
    <View
      style={{
        padding: 16,
        paddingTop: 12,
        backgroundColor: '#000',
        borderRadius: 4,
        marginBottom: 16,
        flexDirection: 'column',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#fff',
          fontSize: 16,
          marginBottom: 4,
        }}>
        {props.headline}
      </Text>
      <Text
        style={{
          color: '#fff',
        }}>
        {props.body}
      </Text>
    </View>
  );
};

const Button = props => {
  return (
    <View
      style={{
        backgroundColor: '#000',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 8,
        alignItems: 'center',
      }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{props.text}</Text>
    </View>
  );
};

const LoginForm = () => {
  const { navigate } = useNavigation();

  const uriAfter = useNavigationParam('uriAfter');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [signingIn, setSigningIn] = useState(false);
  const [errored, setErrored] = useState(false);

  const reset = false;

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
    <Fragment>
      {errored ? (
        <Announcement
          headline="There was a problem signing in"
          body="Please check your network connection and ensure that the username and password are
        //     correct."
        />
      ) : null}
      {reset ? (
        <Announcement
          headline="Check your email"
          body="We've sent you an email with a link to reset your password."
        />
      ) : null}
      <Text style={{ paddingBottom: 16 }}>
        Don't have an account?&nbsp;
        <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
      </Text>
      <TextInput
        style={textInputStyle}
        autoCapitalize="none"
        onChangeText={newUsername => setUsername(newUsername)}
        placeholder="Email or username"
      />
      <TextInput
        style={textInputStyle}
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        onChangeText={newPassword => setPassword(newPassword)}
        placeholder="Password"
      />
      <View style={{ paddingTop: 8, paddingBottom: 16 }}>
        <Text>Forgot password?</Text>
      </View>
      <TouchableOpacity onPress={onPressSignIn}>
        <Button text="Log In" />
      </TouchableOpacity>
    </Fragment>
  );
};

const CreateAccountForm = () => {
  return (
    <Fragment>
      <View style={{ paddingBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Create a new account</Text>
        <Text style={{ marginTop: 16 }}>
          Already have an account?&nbsp;
          <Text style={{ fontWeight: 'bold' }}>Log in</Text>
        </Text>
      </View>
      <TextInput style={textInputStyle} autoCapitalize="none" placeholder="Username" />
      <TextInput style={textInputStyle} placeholder="Your name" />
      <TextInput style={textInputStyle} autoCapitalize="none" placeholder="Email address" />
      <TextInput
        style={textInputStyle}
        secureTextEntry
        textContentType="password"
        placeholder="New password"
      />
      <TouchableOpacity style={{ paddingTop: 8, paddingBottom: 16 }}>
        <Text style={{ lineHeight: 20 }}>
          By clicking "Create Account," you are agreeing to Castle's&nbsp;
          <Text style={{ fontWeight: 'bold' }}>privacy policy</Text>.
        </Text>
      </TouchableOpacity>
      <Button text="Create Account" />
    </Fragment>
  );
};

const ForgotPasswordForm = () => {
  return (
    <Fragment>
      <View style={{ paddingBottom: 16 }}>
        <Text style={{ fontSize: 20 }}>Forgot your password?</Text>
      </View>
      <TextInput
        style={textInputStyle}
        autoCapitalize="none"
        onChangeText={newUsername => setUsername(newUsername)}
        placeholder="Email or username"
      />
      <Button text="Reset Password" />
    </Fragment>
  );
};

const SignInScreen = () => {
  const [signingIn, setSigningIn] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffc21c',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}>
      <StatusBar backgroundColor="#ffc21c" barStyle="dark-content" />
      <View
        style={{
          alignItems: 'center',
          paddingBottom: 16,
        }}>
        <FastImage
          style={{
            width: 80,
            aspectRatio: 1,
            marginBottom: 8,
          }}
          source={require('../src/assets/castle-full-white.png')}
        />
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
          }}>
          Castle
        </Text>
      </View>
      {signingIn ? (
        <Text>Signing in...</Text>
      ) : (
        <View style={{ width: '100%', alignItems: 'center', paddingBottom: 64 }}>
          {LoginForm()}
          {/* { CreateAccountForm() } */}
          {/* { ForgotPasswordForm() } */}
        </View>
      )}
    </View>
  );
};

export default SignInScreen;
