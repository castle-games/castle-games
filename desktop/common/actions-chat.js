import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as url from 'url';

import CastleApiClient from 'castle-api-client';

export const API = CastleApiClient(Constants.API_HOST);

const CHANNEL_FIELDS = `
  channelId
  name
  type
  updatedTime
  otherUserId
  gameId
  hasUnreadMessages
  unreadNotificationCount
`;

export const getSubscribedChannels = async () => {
  const response = await API.graphqlAsync(
    `
      query {
        subscribedChatChannels {
          ${CHANNEL_FIELDS}
        }
      }
    `
  );

  return response;
};

export const getChannels = async (channelIds) => {
  const response = await API.graphqlAsync(
    `
    query($channelIds: [ID]!) {
      chatChannels(channelIds: $channelIds) {
        ${CHANNEL_FIELDS}
      }
    }
  `,
    { channelIds }
  );
  return response.data.chatChannels;
};

export const createChatChannel = async ({ name }) => {
  const response = await API.graphqlAsync(
    `
      mutation($name: String!) {
        createChatChannel(name: $name) {
          ${CHANNEL_FIELDS}
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
          ${CHANNEL_FIELDS}
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
          ${CHANNEL_FIELDS}
        }
      }
    `,
    { gameId }
  );

  return response;
};

export const getAutocompleteAsync = async (text, types = ['users']) => {
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
          lastUserStatus {
            userStatusId
            status
            game {
              gameId
              name
              url
            }
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
};

export const markMessageRead = async (chatMessageId) => {
  const response = await API.graphqlAsync(
    `
      mutation($chatMessageId: ID!) {
        markChatMessageRead(chatMessageId: $chatMessageId) {
          ${CHANNEL_FIELDS}
        }
      }
    `,
    { chatMessageId }
  );

  if (response.error || response.errors) {
    return null;
  }

  return response.data.markChatMessageRead;
};

// TODO: move this to castle-chat-lib
// so that we don't have to know about fetching chat messages.
export const toggleChatMessageReaction = async (chatMessageId, emoji) => {
  const response = await API.graphqlAsync(
    `
      mutation($chatMessageId: ID!, $emoji: String) {
        toggleChatMessageReaction(chatMessageId: $chatMessageId, emoji: $emoji) {
          chatMessageId
        }
      }
    `,
    { chatMessageId, emoji }
  );

  if (response.error || response.errors) {
    return null;
  }

  return response.data.toggleChatMessageReaction;
};
