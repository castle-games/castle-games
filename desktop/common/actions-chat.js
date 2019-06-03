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

export const joinChatChannel = async ({ channelId }) => {};
export const leaveChatChannel = async ({ channelId }) => {};
export const sendChannelChatMessage = async ({ message, channelId }) => {};
export const sendUserChatMessage = async ({ message, otherUserId }) => {};
