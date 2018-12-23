import CastleApiClient from 'castle-api-client';
import ApolloClient, { gql } from 'apollo-boost';
export { ApolloConsumer, Query, Mutation } from 'react-apollo';

export { gql };

export let castleClient = null;
export let apolloClient = null;

export async function initAsync() {
  castleClient = CastleApiClient().client;
  // await castleClient.forgetAllSessionsAsync(); // Uncomment this to force sign-out

  apolloClient = new ApolloClient({
    uri: 'https://apis.playcastle.io/graphql',
    headers: await castleClient._getRequestHeadersAsync(),
  });
}

export async function isSignedInAsync() {
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
