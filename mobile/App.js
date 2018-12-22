import { AppLoading } from 'expo';
import React from 'react';
import { View, StatusBar } from 'react-native';
import CastleApiClient from 'castle-api-client';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import './js/Console';
import { createRootNavigator } from './js/Navigation';
import { gql } from './js/GraphQL';

export default class App extends React.Component {
  state = {
    appLoading: true, // Whether to continue rendering the splash screen
    initialRouteName: 'SignInNavigator', // Initial route -- set based on signed-in state below
  };

  constructor(props, context) {
    super(props, context);

    (async () => {
      // Initialize Castle API client to get HTTP headers
      this._castleClient = CastleApiClient().client;
      // await this._castleClient.forgetAllSessionsAsync(); // Uncomment this to force sign-out

      // Initialize Apollo client
      this._apolloClient = new ApolloClient({
        uri: 'https://apis.playcastle.io/graphql',
        headers: await this._castleClient._getRequestHeadersAsync(),
      });

      // Check whether we're signed in and set initial route accordingly
      const { data } = await this._apolloClient.query({
        query: gql`
          query {
            me {
              userId
            }
          }
        `,
      });
      this.setState({
        appLoading: false,
        initialRouteName: data.me ? 'GameNavigator' : 'SignInNavigator',
      });
    })();
  }

  render() {
    if (this.state.appLoading) {
      return <AppLoading />;
    }

    const RootNavigator = createRootNavigator({ initialRouteName: this.state.initialRouteName });
    return (
      <ApolloProvider client={this._apolloClient}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <RootNavigator />
        </View>
      </ApolloProvider>
    );
  }
}
