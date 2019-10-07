// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { useNavigation } from 'react-navigation-hooks';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

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
      headerTitle: (
        <View style={{ padding: 16, flexDirection: 'row', alignItems: 'flex-end' }}>
          <FastImage
            style={{
              width: 30,
              height: 36,
              marginBottom: 6,
              marginRight: 12,
            }}
            source={require('../src/assets/castle-mini-yellow.png')}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Castle</Text>
        </View>
      ),
    },
  },
});

const ProfileNavigator = createStackNavigator({
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: { title: 'Profile' },
  },
});

const TabNavigator = createBottomTabNavigator(
  {
    Play: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return <Text>🎮</Text>;
        },
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return <Text>👤</Text>;
        },
      },
    },
  },
  {
    tabBarOptions: {
      showIcon: true,
      activeTintColor: 'tomato',
    },
  }
);

const SignInNavigator = createSwitchNavigator({
  SignInScreen: {
    screen: SignInScreen,
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
