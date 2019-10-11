// Assemble all the `*Screen`s together using `*Navigator`s. Confine navigation things to this
// module so that the app's navigation flow is always clear.

import React, { Fragment } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { useNavigation } from 'react-navigation-hooks';
import { Text, View } from 'react-native';
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
              width: 30,
              height: 36,
              marginBottom: 6,
              marginRight: 12,
            }}
            source={require('../assets/images/castle-full-yellow.png')}
          />
          <Text style={{ fontSize: 24, fontFamily: 'RTAliasGrotesk-Bold' }}>Castle</Text>
        </View>
      ),
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
      activeTintColor: '#000',
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
