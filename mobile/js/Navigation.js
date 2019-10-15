// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React, { Fragment } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { useNavigation } from 'react-navigation-hooks';
import { Text, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';

import { LoginScreen, CreateAccountScreen, ForgotPasswordScreen } from './AuthScreens';
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
              width: 20,
              height: 36,
              marginBottom: 6,
              marginRight: 8,
            }}
            source={require('../assets/images/castle-b-mini.gif')}
          />
          <Text style={{ fontSize: 24, letterSpacing: 0.5, fontFamily: 'RTAliasGrotesk-Bold' }}>
            Castle
          </Text>
        </View>
      ),
      headerStyle: { elevation: 2 },
    },
  },
});

const ProfileNavigator = createSwitchNavigator({
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
          return (
            <Image
              style={{
                width: 28,
                height: 28,
                tintColor: tintColor,
              }}
              source={require('../assets/images/chess-figures.png')}
            />
          );
        },
      },
    },
    Profile: {
      screen: ProfileNavigator,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <Image
              style={{
                width: 28,
                height: 28,
                tintColor: tintColor,
              }}
              source={require('../assets/images/single-neutral-shield.png')}
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#000',
      inactiveTintColor: '#aaa',
      style: {
        height: 60,
      },
      tabStyle: {
        padding: 6,
      },
    },
  }
);

const AuthNavigator = createStackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen,
    },
    CreateAccountScreen: {
      screen: CreateAccountScreen,
    },
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen,
    },
  },
  {
    headerMode: 'none',
  }
);

const InitialScreen = () => {
  const { navigate } = useNavigation();

  if (Session.isSignedIn()) {
    navigate('HomeScreen');
  } else {
    navigate('LoginScreen');
  }

  return null;
};

const AppNavigator = createSwitchNavigator(
  {
    InitialScreen,
    AuthNavigator,
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
