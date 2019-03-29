import ApolloClient, { gql } from 'apollo-boost';
export { ApolloConsumer, Query, Mutation } from 'react-apollo';

import { onApolloClientChanged } from '../App';

export { gql };

export let apolloClient = null;

export async function initAsync(token) {
  apolloClient = new ApolloClient({
    uri: 'https://api.castle.games/graphql',
    headers: token ? {
      ['X-Auth-Token']: token,
    } : {},
  });
  onApolloClientChanged(apolloClient);
}

export async function isSignedInAsync() {
  return false;

  if (apolloClient === null) {
    return false;
  }

  const { data: { me } } = await apolloClient.query({
    query: gql`
      query {
        me {
          userId
        }
      }
    `,
  });
  return !!me;
}
