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

const errorMessages = {
  USER_NOT_FOUND: "The email or username you entered does not belong to an account. Please check your information and try again.",
  LOGIN_BAD_CREDENTIALS: "The password you entered was incorrect. Please check your information and try again.",
  PASSWORD_RESET_TOO_MANY: "There have been too many attempts to reset your password. Try again later.",
  PASSWORD_RESET_INVALID_CODE: "The reset link you clicked on was invalid. It may have expired.",
  SIGNUP_INVALID_EMAIL: "The email address you entered was invalid.",
  SIGNUP_INVALID_USERNAME: "The username you entered was invalid. Usernames must be at least three characters long and can only contain letters, numbers, and - or _.",
  SIGNUP_EMAIL_ALREADY_TAKEN: "There is already an account associated with the email address you entered.",
  SIGNUP_USERNAME_ALREADY_TAKEN: "The username you entered is already taken.",
  SIGNUP_PASSWORD_TOO_SHORT: "The password you entered is too short. Passwords must be at least five characters long.",
}

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
      {props.headline ? (
        <Text
          style={{
            fontWeight: 'bold',
            color: '#fff',
            fontSize: 16,
            marginBottom: 4,
          }}>
          {props.headline}
        </Text>
      ) : null }
      <Text
        style={{
          color: '#fff',
          lineHeight: 20,
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
  const [errors, setErrors] = useState([]);

  const onPressSignIn = async () => {
    try {
      setSigningIn(true);
      setErrors([]);
      await Session.signInAsync({ username, password });
      setSigningIn(false);
      navigate('HomeScreen');
      if (uriAfter) {
        navigateToUri(uriAfter);
      }
    } catch (e) {
      setSigningIn(false);
      setErrors(e.graphQLErrors);
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
      {errors ? (
        <Fragment>
          {errors.map(error => (
            <Announcement body={errorMessages[error.extensions.code]} />
          ))}
        </Fragment>
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
        returnKeyType="next"
        onSubmitEditing={() => {this._password.focus()}}
        blurOnSubmit={false}
      />
      <TextInput
        style={signingIn ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        secureTextEntry
        textContentType="password"
        onChangeText={newPassword => setPassword(newPassword)}
        placeholder="Password"
        editable={!signingIn}
        ref={input => {this._password = input}}
        returnKeyType="go"
        onSubmitEditing={onPressSignIn}
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
  const [errors, setErrors] = useState([]);

  const onPressLogin = () => {
    navigate('LoginScreen');
  };

  const onPressPrivacyPolicy = () => {
    Linking.openURL('https://castle.games/legal/privacy');
  };

  const onPressCreateAccount = async () => {
    try {
      setCreatingAccount(true);
      setErrors([]);
      await Session.signUpAsync({ username, name, email, password });
      setCreatingAccount(false);
      navigate('HomeScreen');
      if (uriAfter) {
        navigateToUri(uriAfter);
      }
    } catch (e) {
      setCreatingAccount(false);
      setErrors(e.graphQLErrors);
    }
  };

  return (
    <Fragment>
      <Fragment>
          {errors.map(error => (
            <Announcement body={errorMessages[error.extensions.code]} />
          ))}
        </Fragment>
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
        returnKeyType="next"
        onSubmitEditing={() => {this._name.focus()}}
        blurOnSubmit={false}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        placeholder="Your name"
        onChangeText={newName => setName(newName)}
        editable={!creatingAccount}
        returnKeyType="next"
        ref={input => {this._name = input}}
        onSubmitEditing={() => {this._email.focus()}}
        blurOnSubmit={false}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        autoCapitalize="none"
        placeholder="Email address"
        onChangeText={newEmail => setEmail(newEmail)}
        editable={!creatingAccount}
        returnKeyType="next"
        ref={input => {this._email = input}}
        onSubmitEditing={() => {this._password.focus()}}
        blurOnSubmit={false}
      />
      <TextInput
        style={creatingAccount ? [textInputStyle, disabledTextInputStyle] : textInputStyle}
        secureTextEntry
        textContentType="password"
        placeholder="New password"
        onChangeText={newPassword => setPassword(newPassword)}
        editable={!creatingAccount}
        returnKeyType="go"
        ref={input => {this._password = input}}
        onSubmitEditing={onPressCreateAccount}
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
  const [errors, setErrors] = useState([]);

  const onPressResetPassword = async () => {
    try {
      setResettingPassword(true);
      setErrors([]);
      await Session.resetPasswordAsync({ username });
      setResettingPassword(false);
      navigate('LoginScreen', {
        resetPassword: true,
      });
    } catch (e) {
      setResettingPassword(false);
      setErrors(e.graphQLErrors);
    }
  };

  return (
    <Fragment>
      {errors ? (
        <Fragment>
          {errors.map(error => (
            <Announcement body={errorMessages[error.extensions.code]} />
          ))}
        </Fragment>
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
        autoFocus={true}
        returnKeyType="go"
        onSubmitEditing={onPressResetPassword}
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
