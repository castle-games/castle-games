import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

const EMPTY_CHAT_STATE = {
  channels: {},
};

const ChatContextDefaults = {
  sendMessage: async (message) => {},
  openChannelWithName: async (name) => {},
  openChannelForUser: async (user) => {},
  openChannelForGame: async (game) => {},
  closeChannel: async (channelId) => {},
  findChannel: (channelName) => {}, // TODO: change
  refreshChannelData: () => {},
  ...EMPTY_CHAT_STATE,
};

const ChatContext = React.createContext(ChatContextDefaults);

class ChatContextManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...ChatContextDefaults,
      ...props.value,
      refreshChannelData: this.refreshChannelData,
      sendMessage: this.sendMessage,
      openChannelWithName: this.openChannelWithName,
      openChannelForUser: this.openChannelForUser,
      openChannelForGame: this.openChannelForGame,
      closeChannel: this.closeChannel,
      findSubscribedChannel: this.findSubscribedChannel,
      findChannel: this.findChannel,
    };
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  _update = async (prevProps, prevState) => {
    const prevUser = prevProps && prevProps.currentUser ? prevProps.currentUser.user : null;
    // user logged out
    if (prevUser && !this.props.currentUser.user) {
      this.destroy();
    }

    // user logged in
    if (!prevUser && this.props.currentUser.user) {
      await this.start();
      await this._newUserJoinChannels();
    }
  };

  start = async () => {
    let token = await Actions.getAccessTokenAsync();
    if (!token) {
      console.error('Cannot start chat without an access token.');
      return;
    }

    this._chat = new CastleChat();
    this._chat.init(Constants.CHAT_SERVICE_URL, Constants.API_HOST, token);
    this._chat.setOnMessagesHandler(this._handleMessagesAsync);
    this._chat.setOnPresenceHandler(this._handlePresenceAsync);
    this._chat.setConnectionStatusHandler(this._handleConnectStatus);
    this._chat.connect();
  };

  destroy = async () => {
    await this._chat.disconnect();
    this._chat = null;
    this.setState((state) => {
      return {
        ...state,
        ...EMPTY_CHAT_STATE,
      };
    });
  };

  // TODO: desktop notifications logic

  // TODO:
  // old _handleConnect and _handleConnectGameContext

  // checks if we have a channel with this name,
  // creates it if not, and navigates to it.
  openChannelWithName = async (name) => {
    let channelId,
      isSubscribed = false;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.name === name) {
        channelId = key;
        isSubscribed = channel.isSubscribed;
      }
    });
    if (!channelId) {
      const response = await ChatActions.createChatChannel({ name });
      if (!response || response.errors) {
        return;
      }
      if (response.data && response.data.createChatChannel) {
        channelId = response.data.createChatChannel.channelId;
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    return this.props.navigateToChat({ channelId });
  };

  // checks if we have a DM channel for this user,
  // creates it if not, and navigates to it.
  openChannelForUser = async (user) => {
    if (!user || !user.userId) return;

    let channelId;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.otherUserId === user.userId) {
        channelId = key;
      }
    });
    if (!channelId) {
      const response = await ChatActions.createDMChatChannel({ otherUserId: user.userId });
      if (!response || response.errors) {
        return;
      }
      if (response.data && response.data.createDMChatChannel) {
        channelId = response.data.createDMChatChannel.channelId;
      }
    }
    return this.props.navigateToChat({ channelId });
  };

  // checks if we have a chat channel for this game,
  // creates it if not, and navigates to it.
  openChannelForGame = async (game) => {
    if (!game || !game.gameId) return;

    let channelId,
      isSubscribed = false;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.gameId === game.gameId) {
        channelId = key;
        isSubscribed = channel.isSubscribed;
      }
    });
    if (!channelId) {
      const response = await ChatActions.createGameChatChannel({ gameId: game.gameId });
      if (!response || response.errors) {
        return;
      }
      if (response.data && response.data.createGameChatChannel) {
        channelId = response.data.createGameChatChannel.channelId;
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    return this.props.navigateToChat({ channelId });
  };

  closeChannel = async (channelId) => {
    await this._chat.leaveChannelAsync(channelId);
    this.setState((state) => {
      let channels = { ...state.channels };
      if (channels[channelId]) {
        delete channels[channelId];
      }
      return {
        ...state,
        channels,
      };
    });
  };

  sendMessage = async (channelId, message) => {
    if (!this._chat) return;
    if (Strings.isEmpty(message)) {
      return;
    }
    // TODO: second param was usernameToUser
    message = await ChatUtilities.formatMessageAsync(message, {});
    const slashCommand = ChatUtilities.getSlashCommand(message);
    if (slashCommand.isCommand) {
      // capture any non-me command without sending.
      // TODO: handle various commands
      if (slashCommand.command !== 'me') {
        return;
      }
    }
    return this._chat.sendMessageAsync(channelId, message);
  };

  _handleMessagesAsync = async (allUnsortedMessages) => {
    let channelIds = {},
      unseenChannelIds = {},
      userIds = {};

    await this.setState((state) => {
      let channels = { ...state.channels };
      for (let ii = 0, nn = allUnsortedMessages.length; ii < nn; ii++) {
        const m = allUnsortedMessages[ii];

        if (!this.props.userPresence.userIdToUser[m.fromUserId]) {
          userIds[m.fromUserId] = true;
        }
        if (!channels[m.channelId]) {
          channels[m.channelId] = {};
          unseenChannelIds[m.channelId] = true;
        }
        if (!channels[m.channelId].messages) {
          channels[m.channelId].messages = [];
        }
        channelIds[m.channelId] = true;

        let channel = channels[m.channelId];
        channel.messages.push(m);
      }

      Object.keys(channelIds).forEach((channelId) => {
        // we added new messages to this channel, re-sort
        let channel = channels[channelId];
        channel.messages = channel.messages.sort((a, b) => {
          return new Date(a.createdTime) - new Date(b.createdTime);
        });
      });

      return {
        ...state,
        channels,
      };
    });

    // request any users we've never seen before.
    const newUserIds = Object.keys(userIds);
    if (newUserIds.length) {
      try {
        let users = await Actions.getUsers({ userIds: newUserIds });
        await this.props.userPresence.addUsers(users);
      } catch (e) {}
    }

    // fetch channels if we get messages from unknown channels.
    const newChannelIds = Object.keys(unseenChannelIds);
    if (newChannelIds.length) {
      await this.refreshChannelData();
    }
  };

  _handleConnectStatus = async (status) => {
    // console.log('status', status);
  };

  _handlePresenceAsync = async (event) => {
    if (!event.user_ids) {
      return;
    }

    let onlineUserIds = {};
    event.user_ids.forEach((id) => {
      onlineUserIds[id] = true;
    });

    this.props.userPresence.setOnlineUserIds(onlineUserIds);
  };

  refreshChannelData = async () => {
    const response = await ChatActions.getAllChat();
    if (response && response.data) {
      const { subscribedChatChannels, allChatChannels } = response.data;
      this.setState((state) => {
        let channels = {};
        if (allChatChannels) {
          allChatChannels.forEach((channel) => {
            const existing = state.channels[channel.channelId] || {};
            channels[channel.channelId] = {
              ...existing,
              ...channel,
            };
          });
        }
        if (subscribedChatChannels) {
          subscribedChatChannels.forEach((channel) => {
            const existing = state.channels[channel.channelId] || {};
            channels[channel.channelId] = {
              ...existing,
              ...channel,
              isSubscribed: true,
            };
          });
        }
        return {
          ...state,
          channels,
        };
      });
    }
  };

  // TODO: audit
  findChannel = (name) => {
    let result = null;
    if (name) {
      let nameInvariant = name.toLowerCase();
      Object.entries(this.state.channels).forEach(([channelId, channel]) => {
        if (channel.name === nameInvariant) {
          result = channel;
        }
      });
    }
    return result;
  };

  // TODO: audit
  findSubscribedChannel = ({ channelId }) => {
    return this.state.channels.find(
      (channel) => channel.isSubscribed && channel.channelId === channelId
    );
  };

  // TODO: remove, put on server
  _newUserJoinChannels = async () => {
    if (!this._chat) return;
    // NOTE(jim): General
    await this._chat.joinChannelAsync('channel-79c91814-c73e-4d07-8bc6-6829fad03d72');
    // NOTE(jim): Random
    await this._chat.joinChannelAsync('channel-37c0532e-31a1-4558-9f3e-200337523859');
  };

  render() {
    return <ChatContext.Provider value={this.state}>{this.props.children}</ChatContext.Provider>;
  }
}

class ChatContextProvider extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <UserPresenceContext.Consumer>
            {(userPresence) => (
              <NavigationContext.Consumer>
                {(navigation) => (
                  <NavigatorContext.Consumer>
                    {(navigator) => (
                      <ChatContextManager
                        currentUser={currentUser}
                        userPresence={userPresence}
                        navigation={navigation}
                        navigateToChat={navigator.navigateToChat}
                        {...this.props}
                      />
                    )}
                  </NavigatorContext.Consumer>
                )}
              </NavigationContext.Consumer>
            )}
          </UserPresenceContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}

export { ChatContext, ChatContextProvider };
