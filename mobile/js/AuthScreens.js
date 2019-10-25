import React, { useState, Fragment } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
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

const disabledTextInputStyle = {
  backgroundColor: '#ddd',
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
        backgroundColor: '#9955c8',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        margin: 8,
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{props.text}</Text>
      {props.spinner ? (
        <View
          style={{
            backgroundColor: '#9955c8',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="small" color="#fff" />
        </View>
      ) : null}
    </View>
  );
};

const LoginForm = () => {
  const { navigate } = useNavigation();

  const uriAfter = useNavigationParam('uriAfter');
  const resetPassword = useNavigationParam('resetPassword');

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
      navigate('HomeScreen');
      if (uriAfter) {
        navigateToUri(uriAfter);
      }
    } catch (e) {
      setSigningIn(false);
      setErrored(true);
    }
  };

  const onPressSignUp = () => {
    navigate('CreateAccountScreen', { uriAfter });
  };

  const onPressForgotPassword = () => {
    navigate('ForgotPasswordScreen');
  };

  return (
    <Fragment>
      {errored ? (
        <Announcement
          headline="There was a problem signing in"
          body="Please check your network connection and ensure that the username and password are correct."
        />
      ) : null}
      {resetPassword ? (
        <Announcement
          headline="Check your email"
          body="We've sent you an email with a link to reset your password."
        />
      ) : null}
      <View style={{ width: '100%', alignItems: 'center', paddingBottom: 16 }}>
        <TouchableOpacity onPress={onPressSignUp}>
          <Text>
            Don't have an account?&nbsp;
            <Text style={{ fontWeight: 'bold' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={signingIn ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        onChangeText={newUsername => setUsername(newUsername)}
        placeholder="Email or username"
        editable={!signingIn}
      />
      <TextInput
        style={signingIn ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        onChangeText={newPassword => setPassword(newPassword)}
        placeholder="Password"
        editable={!signingIn}
      />
      <TouchableOpacity
        style={{ paddingTop: 8, paddingBottom: 16 }}
        onPress={onPressForgotPassword}>
        <Text>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressSignIn}>
        <Button text="Log In" spinner={signingIn} />
      </TouchableOpacity>
    </Fragment>
  );
};

const CreateAccountForm = () => {
  const { navigate } = useNavigation();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [creatingAccount, setCreatingAccount] = useState(false);
  const [errored, setErrored] = useState(false);

  const onPressLogin = () => {
    navigate('LoginScreen');
  };

  const onPressPrivacyPolicy = () => {
    Linking.openURL('https://castle.games/legal/privacy');
  };

  const onPressCreateAccount = async () => {
    try {
      setCreatingAccount(true);
      setErrored(false);
      await Session.signUpAsync({ username, name, email, password });
      setCreatingAccount(false);
      navigate('HomeScreen');
      if (uriAfter) {
        navigateToUri(uriAfter);
      }
    } catch (e) {
      setCreatingAccount(false);
      setErrored(true);
    }
  };

  return (
    <Fragment>
      {errored ? (
        <Announcement
          headline="There was a problem"
          body="Please ensure that your information is correct."
        />
      ) : null}
      <View style={{ paddingBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Create a new account</Text>
        <TouchableOpacity onPress={onPressLogin}>
          <Text style={{ marginTop: 16 }}>
            Already have an account?&nbsp;
            <Text style={{ fontWeight: 'bold' }}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        placeholder="Username"
        onChangeText={newUsername => setUsername(newUsername)}
        editable={!creatingAccount}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        placeholder="Your name"
        onChangeText={newName => setName(newName)}
        editable={!creatingAccount}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        placeholder="Email address"
        onChangeText={newEmail => setEmail(newEmail)}
        editable={!creatingAccount}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        secureTextEntry
        textContentType="password"
        placeholder="New password"
        onChangeText={newPassword => setPassword(newPassword)}
        editable={!creatingAccount}
      />
      <View style={{ paddingTop: 8, paddingBottom: 16 }}>
        <TouchableOpacity onPress={onPressPrivacyPolicy}>
          <Text style={{ lineHeight: 20 }}>
            By clicking "Create Account," you are agreeing to Castle's&nbsp;
            <Text style={{ fontWeight: 'bold' }}>privacy policy</Text>.
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onPressCreateAccount}>
        <Button text="Create Account" spinner={creatingAccount} />
      </TouchableOpacity>
    </Fragment>
  );
};

const ForgotPasswordForm = () => {
  const { navigate } = useNavigation();

  const [username, setUsername] = useState('');

  const [resettingPassword, setResettingPassword] = useState(false);
  const [errored, setErrored] = useState(false);

  const onPressResetPassword = async () => {
    try {
      setResettingPassword(true);
      setErrored(false);
      await Session.resetPasswordAsync({ username });
      setResettingPassword(false);
      navigate('LoginScreen', {
        resetPassword: true,
      });
    } catch (e) {
      setResettingPassword(false);
      setErrored(true);
    }
  };

  return (
    <Fragment>
      {errored ? (
        <Announcement
          headline="There was a problem"
          body="Please ensure that the email or username is correct."
        />
      ) : null}
      <View style={{ paddingBottom: 16 }}>
        <Text style={{ fontSize: 20 }}>Forgot your password?</Text>
      </View>
      <TextInput
        style={resettingPassword ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        onChangeText={newUsername => setUsername(newUsername)}
        placeholder="Email or username"
        editable={!resettingPassword}
      />
      <TouchableOpacity onPress={onPressResetPassword}>
        <Button text="Reset Password" spinner={resettingPassword} />
      </TouchableOpacity>
    </Fragment>
  );
};

const WithHeader = ({ children }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#ffe00e',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
    <StatusBar backgroundColor="#ffe00e" barStyle="dark-content" />
    <View
      style={{
        alignItems: 'center',
        paddingBottom: 16,
      }}>
      <FastImage
        style={{
          width: 100,
          aspectRatio: 1,
          marginBottom: 16,
        }}
        source={require('../assets/images/castle-classic-white.png')}
      />
      <Text
        style={{
          fontSize: 28,
          fontFamily: 'RTAliasGrotesk-Bold',
        }}>
        Castle
      </Text>
    </View>
    <View style={{ width: '100%', alignItems: 'center', paddingBottom: 64 }}>{children}</View>
  </View>
);

export const LoginScreen = () => (
  <WithHeader>
    <LoginForm />
  </WithHeader>
);

export const CreateAccountScreen = () => (
  <WithHeader>
    <CreateAccountForm />
  </WithHeader>
);

export const ForgotPasswordScreen = () => (
  <WithHeader>
    <ForgotPasswordForm />
  </WithHeader>
);
