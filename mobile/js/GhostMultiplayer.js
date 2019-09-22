import * as GhostChannels from './GhostChannels';
import { apolloClient, gql } from './Session';

// Should coincide with event names mentioned in 'base/castle.lua'
GhostChannels.on('CASTLE_CONNECT_MULTIPLAYER_CLIENT_REQUEST', async requestJson => {
  const { mediaUrl } = JSON.parse(requestJson);
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
    GhostChannels.pushAsync(
      'JS_EVENTS',
      JSON.stringify({
        name: 'CASTLE_CONNECT_MULTIPLAYER_CLIENT_RESPONSE',
        params: {
          address: data.joinMultiplayerSession.address,
        },
      })
    );
  }
});
