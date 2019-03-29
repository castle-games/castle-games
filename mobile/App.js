import { AppLoading } from 'expo';
import React from 'react';
import { View, StatusBar, AsyncStorage } from 'react-native';
import { ApolloProvider } from 'react-apollo';

import './js/AutoUpdates';
import './js/GhostConsole';
import { createRootNavigator } from './js/Navigation';
import * as Conn from './js/Conn';
import './js/GhostMultiplayer';

export let onApolloClientChanged;

export default class App extends React.Component {
  state = {
    appLoading: true, // Whether to continue rendering the splash screen
    rootNavigator: null,
    apolloClient: null,
  };

  constructor(props, context) {
    super(props, context);

    onApolloClientChanged = (apolloClient) => {
      this.setState({ apolloClient });
    };

    (async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      await Conn.initAsync(authToken);

      this.setState({
        apolloClient: Conn.apolloClient,
        appLoading: false,
        rootNavigator: createRootNavigator({
          initialRouteName: await Conn.isSignedInAsync() ? 'GameNavigator' : 'SignInNavigator',
        }),
      });
    })();
  }

  render() {
    if (this.state.appLoading) {
      return <AppLoading/>;
    }

    const RootNavigator = this.state.rootNavigator;
    return (
      <ApolloProvider client={this.state.apolloClient}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar backgroundColor="white" barStyle="dark-content"/>
          <RootNavigator/>
        </View>
      </ApolloProvider>
    );
  }
}
