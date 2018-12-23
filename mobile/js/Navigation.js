// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
  NavigationActions,
} from 'react-navigation';
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

let rootNavigator = null;

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

  return () => <RootNavigator ref={ref => (rootNavigator = ref)} />;
};

// Callable from outside any component. Returns whether successful (unsuccessful if navigation
// isn't initialized yet).
export function navigate(routeName, params) {
  if (rootNavigator) {
    rootNavigator.dispatch(NavigationActions.navigate({ routeName, params }));
    return true;
  }
  return false;
}
