// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { useNavigation } from 'react-navigation-hooks';

import SignInScreen from './SignInScreen';
import * as DeepLinks from './DeepLinks';
import HomeScreen from './HomeScreen';
import * as Session from './Session';
import ProfileScreen from './ProfileScreen';

// App UI layout

const HomeNavigator = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Castle',
    },
  },
});

const ProfileNavigator = createStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: { title: 'Profile' },
  },
});

const TabNavigator = createBottomTabNavigator({
  Home: HomeNavigator,
  Profile: ProfileNavigator,
});

const SignInNavigator = createStackNavigator({
  SignInScreen: {
    screen: SignInScreen,
    navigationOptions: { title: 'Sign In' },
  },
});

const InitialScreen = () => {
  const { navigate } = useNavigation();

  if (Session.isSignedIn()) {
    navigate('HomeScreen');
  } else {
    navigate('SignInScreen');
  }

  return null;
};

const AppNavigator = createSwitchNavigator(
  {
    InitialScreen,
    SignInNavigator,
    TabNavigator,
  },
  {
    initialRouteName: 'InitialScreen',
  }
);

// The root navigator -- wrapped so we can save the `ref` and set some props

const RealRootNavigator = createAppContainer(AppNavigator);

export const RootNavigator = () => {
  return <RealRootNavigator ref={DeepLinks.setRootNavigatorRef} enableURLHandling={false} />;
};
