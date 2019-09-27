import React from 'react';
import { View, StatusBar } from 'react-native';

import { createRootNavigator } from './Navigation';

const Main = () => {
  const RootNavigator = createRootNavigator({
    initialRouteName: 'SignInNavigator',
  });

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <RootNavigator />
    </View>
  );
};

export default Main;
