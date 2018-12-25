import { AppLoading } from 'expo';
import React from 'react';
import { View, StatusBar } from 'react-native';
import { ApolloProvider } from 'react-apollo';

import './js/GhostConsole';
import { createRootNavigator } from './js/Navigation';
import * as Conn from './js/Conn';

export default class App extends React.Component {
  state = {
    appLoading: true, // Whether to continue rendering the splash screen
    initialRouteName: 'SignInNavigator', // Initial route -- set based on signed-in state below
  };

  constructor(props, context) {
    super(props, context);

    (async () => {
      await Conn.initAsync();

      this.setState({
        appLoading: false,
        initialRouteName: await Conn.isSignedInAsync() ? 'GameNavigator' : 'SignInNavigator',
      });
    })();
  }

  render() {
    if (this.state.appLoading) {
      return <AppLoading />;
    }

    const RootNavigator = createRootNavigator({ initialRouteName: this.state.initialRouteName });
    return (
      <ApolloProvider client={Conn.apolloClient}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <RootNavigator />
        </View>
      </ApolloProvider>
    );
  }
}
