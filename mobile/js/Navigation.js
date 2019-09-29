// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import SignInScreen from './SignInScreen';
import * as DeepLinks from './DeepLinks';
import HomeScreen from './HomeScreen';
import * as Session from './Session';

const HomeNavigator = createStackNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: { title: 'Home' },
  },
});

const TabNavigator = createBottomTabNavigator({
  Home: HomeNavigator,
});

const SignInNavigator = createStackNavigator({
  SignInScreen: {
    screen: SignInScreen,
    navigationOptions: { title: 'Sign In' },
  },
});

export const createRootNavigator = () => {
  const RootNavigator = createAppContainer(
    createSwitchNavigator(
      {
        SignInNavigator,
        TabNavigator,
      },
      {
        // Pick initial screen based on whether signed in
        initialRouteName: Session.isSignedIn() ? 'TabNavigator' : 'SignInNavigator',
      }
    )
  );

  return () => <RootNavigator ref={DeepLinks.setRootNavigatorRef} enableURLHandling={false} />;
};
