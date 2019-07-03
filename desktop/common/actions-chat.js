import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as url from 'url';

import CastleApiClient from 'castle-api-client';

export const API = CastleApiClient(Constants.API_HOST);

export const getAllChat = async () => {
  const response = await API.graphqlAsync(
    `
      query {
        subscribedChatChannels {
          channelId
          name
          type
          createdTime
          updatedTime
          otherUserId
        }

        allChatChannels {
          channelId
          name
          type
          createdTime
          updatedTime
          otherUserId
        }
      }
    `
  );

  return response;
};

export const createChatChannel = async ({ name }) => {
  const response = await API.graphqlAsync(
    `
      mutation($name: String!) {
        createChatChannel(name: $name) {
          channelId
          name
          type
          createdTime
          updatedTime
        }
      }
    `,
    { name }
  );

  return response;
};

export const createDMChatChannel = async ({ otherUserId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($otherUserId: ID!) {
        createDMChatChannel(otherUserId: $otherUserId) {
          channelId
          name
          type
          createdTime
          updatedTime
          otherUserId
        }
      }
    `,
    { otherUserId }
  );

  return response;
};

export const createGameChatChannel = async ({ gameId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($gameId: ID!) {
        createGameChatChannel(gameId: $gameId) {
          channelId
          name
          type
          createdTime
          updatedTime
          gameId
        }
      }
    `,
    { gameId }
  );

  return response;
};

export async function getAutocompleteAsync(text, types = ['users']) {
  let usersQuery = '',
    gamesQuery = '',
    channelsQuery = '';
  if (types.includes('users')) {
    usersQuery = `
        users {
          userId
          username
          name
          photo {
            url
            height
            width
          }
        }`;
  }
  if (types.includes('channels')) {
    channelsQuery = `
        chatChannels {
          channelId
          name
          type
        }`;
  }
  const result = await API(
    `
    query($text: String!) {
      autocomplete(text: $text) {
        ${usersQuery}
        ${channelsQuery}
      }
    }`,
    { text }
  );
  if (result.error || result.errors) {
    return false;
  }
  return result.data.autocomplete;
}
