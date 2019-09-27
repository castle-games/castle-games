// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

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

export const createRootNavigator = ({ initialRouteName }) => {
  const RootNavigator = createAppContainer(
    createSwitchNavigator(
      {
        SignInNavigator,
        GameNavigator,
      },
      {
        initialRouteName,
      }
    )
  );

  return () => <RootNavigator />;
};
