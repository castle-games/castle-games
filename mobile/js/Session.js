// Maintains session state for the API server connection -- auth token and GraphQL client

import AsyncStorage from '@react-native-community/async-storage';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import gql from 'graphql-tag';

let authToken = null;

export const getAuthToken = () => authToken;

// Based on https://www.apollographql.com/docs/react/migrating/boost-migration/
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    new ApolloLink(
      (operation, forward) =>
        new Observable(observer => {
          let handle;
          Promise.resolve(operation)
            .then(operation => {
              const headers = {};
              headers['X-Platform'] = 'mobile';
              if (authToken) {
                headers['X-Auth-Token'] = authToken;
              }
              operation.setContext({ headers });
            })
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            })
            .catch(observer.error.bind(observer));
          return () => {
            if (handle) handle.unsubscribe();
          };
        })
    ),
    createUploadLink({
      uri: 'https://api.castle.games/graphql',
    }),
  ]),
  cache: new InMemoryCache(),
});

// Failed attempt at an Apollo cache...:
//
//   const typeNameToIdFieldName = {
//     Game: 'gameId',
//     User: 'userId',
//     HostedFile: 'fileId',
//     Post: 'postId',
//     ChatChannel: 'chatChannelId',
//     ChatMessage: 'chatMessageId',
//   };
//   cache: new InMemoryCache({
//     fragmentMatcher: new IntrospectionFragmentMatcher({
//       introspectionQueryResultData: {
//         __schema: {
//           types: [],
//         },
//       },
//     }),
//     dataIdFromObject: o => {
//       let id = o.id;
//       const idField = typeNameToIdFieldName[o.__typename];
//       if (idField) {
//         if (o[idField]) {
//           id = o[idField];
//         } else {
//           console.log(`DEBUG: Missing ID Field -- ${o.__typename} -- ${id}`);
//         }
//       }
//       return o.__typename + '_' + id;
//     },
//     cacheRedirects: {
//       Query: {
//         game: (_, args, { getCacheKey }) => getCacheKey({ __typename: 'Game', id: args.gameId }),
//         user: (_, args, { getCacheKey }) => getCacheKey({ __typename: 'User', id: args.userId }),
//       },
//     },
//   }),
//

export const initAsync = async () => {
  authToken = await AsyncStorage.getItem('AUTH_TOKEN');
};

export const isSignedIn = () => authToken !== null;

const useNewAuthTokenAsync = async newAuthToken => {
  apolloClient.resetStore();
  authToken = newAuthToken;
  if (newAuthToken) {
    await AsyncStorage.setItem('AUTH_TOKEN', authToken);
  } else {
    await AsyncStorage.removeItem('AUTH_TOKEN');
  }
};

const userIdForUsernameAsync = async username => {
  const {
    data: {
      userForLoginInput: { userId },
    },
  } = await apolloClient.query({
    query: gql`
      query GetUserId($username: String!) {
        userForLoginInput(who: $username) {
          userId
        }
      }
    `,
    variables: { username },
  });
  return userId;
};

export const signInAsync = async ({ username, password }) => {
  const userId = await userIdForUsernameAsync(username);

  const result = await apolloClient.mutate({
    mutation: gql`
      mutation SignIn($userId: ID!, $password: String!) {
        login(userId: $userId, password: $password) {
          userId
          token
        }
      }
    `,
    variables: { userId, password },
  });
  if (result && result.data && result.data.login && result.data.login.userId) {
    await useNewAuthTokenAsync(result.data.login.token);
  }
};

export const signOutAsync = async () => {
  await apolloClient.mutate({
    mutation: gql`
      mutation SignOut {
        logout
      }
    `,
  });
  await useNewAuthTokenAsync(null);
};

export const signUpAsync = async ({ username, name, email, password }) => {
  const result = await apolloClient.mutate({
    mutation: gql`
      mutation SignUp($name: String!, $username: String!, $email: String!, $password: String!) {
        signup(user: { name: $name, username: $username }, email: $email, password: $password) {
          userId
          token
        }
      }
    `,
    variables: { username, name, email, password },
  });
  if (result && result.data && result.data.signup && result.data.signup.userId) {
    await useNewAuthTokenAsync(result.data.signup.token);
  }
};

export const resetPasswordAsync = async ({ username }) => {
  const userId = await userIdForUsernameAsync(username);

  await apolloClient.mutate({
    mutation: gql`
      mutation ResetPassword($userId: ID!) {
        sendResetPasswordEmail(userId: $userId)
      }
    `,
    variables: { userId },
  });
};
