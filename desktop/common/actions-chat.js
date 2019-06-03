import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as url from 'url';

import CastleApiClient from 'castle-api-client';

export const API = CastleApiClient(Constants.API_HOST);

export const createChatChannel = async ({ name }) => {
  const response = await API.graphqlAsync(
    `
      mutation($name: String!) {
        createChatChannel(name: $name) {
          channelId
        }
      }
    `,
    { name }
  );

  return response;
};

export const joinChatChannel = async ({ channelId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($channelId: ID!) {
        joinChatChannel(channelId: $channelId) {
          channelId
        }
      }
    `,
    { channelId }
  );

  return response;
};

export const leaveChatChannel = async ({ channelId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($channelId: ID!) {
        leaveChatChannel(channelId: $channelId) {
          channelId
        }
      }
    `,
    { channelId }
  );

  return response;
};

export const sendChannelChatMessage = async ({ message, channelId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($message: String!, $channelId: ID!) {
        sendChannelChatMessage(message: $message, channelId: $channelId)
      }
    `,
    { message, channelId }
  );

  return response;
};

export const sendUserChatMessage = async ({ message, otherUserId }) => {
  const response = await API.graphqlAsync(
    `
      mutation($message: String!, $otherUserId: ID!) {
        sendUserChatMessage(message: $message, otherUserId: $otherUserId)
      }
    `,
    { message, otherUserId }
  );

  return response;
};
