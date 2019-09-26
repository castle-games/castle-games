import * as GhostEvents from './GhostEvents';
import { apolloClient, gql } from './Session';

// Should coincide with event names mentioned in 'base/castle.lua'
GhostEvents.listen('CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST', async ({ mediaUrl }) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation($mediaUrl: String!) {
        joinMultiplayerSession(mediaUrl: $mediaUrl) {
          address
        }
      }
    `,
    variables: { mediaUrl },
  });
  if (data && data.joinMultiplayerSession) {
    GhostEvents.send('CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE', {
      address: data.joinMultiplayerSession.address,
    });
  }
});