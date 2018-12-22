// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import GameScreen from './GameScreen';
import SignInScreen from './SignInScreen';

const GameNavigator = createStackNavigator({
  GameScreen: {
    screen: GameScreen,
    navigationOptions: { title: 'Game' },
  },
});

const SignInNavigator = createStackNavigator({
  SignInScreen: {
    screen: SignInScreen,
    navigationOptions: { title: 'Sign In' },
  },
});

export const createRootNavigator = ({ initialRouteName }) =>
  createSwitchNavigator(
    {
      SignInNavigator,
      GameNavigator,
    },
    {
      initialRouteName,
    }
  );
