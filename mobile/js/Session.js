import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';

import { onApolloClientChanged } from './Main';

export let apolloClient = null;

export let authToken = null;

export async function initAsync(token) {
  authToken = token;

  if (token) {
    await AsyncStorage.setItem('authToken', token);
  }

  apolloClient = new ApolloClient({
    uri: 'https://api.castle.games/graphql',
    headers: token ? {
      ['X-Auth-Token']: token,
    } : {},
  });
  onApolloClientChanged(apolloClient);
}

export function isSignedInAsync() {
  return !!authToken;
}
