import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

let authToken = null;

export const getAuthToken = () => authToken;

export const apolloClient = new ApolloClient({
  uri: 'https://api.castle.games/graphql',
  request: operation => {
    operation.setContext({
      headers: authToken ? { ['X-Auth-Token']: authToken } : {},
    });
  },
});

export const initAsync = async () => {
  authToken = await AsyncStorage.getItem('AUTH_TOKEN');
};

export const isSignedIn = () => authToken !== null;

export const signInAsync = async ({ username, password }) => {
  // Find `userId` for this `username`
  const {
    data: {
      userForLoginInput: { userId },
    },
  } = await apolloClient.query({
    query: gql`
      query($username: String!) {
        userForLoginInput(who: $username) {
          userId
        }
      }
    `,
    variables: { username },
  });
  console.log('got `userId`: ' + userId);

  // Log in and save the auth token
  const result = await apolloClient.mutate({
    mutation: gql`
      mutation($userId: ID!, $password: String!) {
        login(userId: $userId, password: $password) {
          userId
          token
        }
      }
    `,
    variables: { userId, password },
  });
  if (result && result.data && result.data.login && result.data.login.userId) {
    apolloClient.resetStore();
    authToken = result.data.login.token;
    await AsyncStorage.setItem('AUTH_TOKEN', authToken);
  }
};
