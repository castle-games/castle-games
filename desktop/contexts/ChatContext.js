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
  sendMessage: async (channelId, message) => {},
  openChannelWithName: async (name) => {},
  openChannelForUser: async (user) => {},
  openChannelForGame: async (game) => {},
  closeChannel: async (channelId) => {},
  findChannel: (channelName) => {},
  findChannelForGame: (game) => {},
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
      findChannel: this.findChannel,
      findChannelForGame: this.findChannelForGame,
    };
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  componentDidMount() {
    window.addEventListener('CASTLE_ADD_CHAT_NOTIFICATION', this._handleChatNotification);

    // TODO(jim): Easy way to test chat notifications.
    /*
    this._handleChatNotification({
      params: { message: 'Testing... https://castle.games lol' },
      type: 'NOTICE',
      timestamp: new Date().toString(),
    });
    */
  }

  componentWillUnmount() {
    window.removeEventListener('CASTLE_ADD_CHAT_NOTIFICATION', this._handleChatNotification);
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
    }

    let prevNavigationMode;
    if (prevProps && prevProps.navigation) {
      prevNavigationMode = prevProps.navigation.contentMode;
    }
    if (this.props.navigation.contentMode === 'game') {
      // refresh or autojoin game channel if the user navigated to a game.
      let isNewGame = false;
      let prevGame;
      if (prevProps && prevProps.navigation) {
        prevGame = prevProps.navigation.game;
      }
      if (prevNavigationMode !== 'game') {
        // navigated from non-game to game
        isNewGame = true;
      } else if (prevGame !== this.props.navigation.game) {
        // navigated from one game to another game
        isNewGame = true;
      }
      if (isNewGame) {
        this._joinOrCreateChannelForGame(this.props.navigation.game);
      }
    } else if (this.props.navigation.contentMode === 'chat') {
      let prevChannelId =
        prevProps && prevProps.navigation ? prevProps.navigation.chatChannelId : null;
      if (prevNavigationMode !== 'chat' || prevChannelId !== this.props.navigation.chatChannelId) {
        // TODO: only refresh the channel messages we care about
        this.refreshChannelData();
      }
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

  // checks if we have a channel with this name,
  // creates it if not, and navigates to it.
  openChannelWithName = async (name) => {
    let channelId,
      isSubscribed = false,
      createdChannel;
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
        createdChannel = response.data.createChatChannel;
        channelId = createdChannel.channelId;
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    if (createdChannel) {
      await this._addChannel({ ...createdChannel, isSubscribed: true });
    }
    return this.props.navigateToChat({ channelId });
  };

  // checks if we have a DM channel for this user,
  // creates it if not, and navigates to it.
  openChannelForUser = async (user) => {
    if (!user || !user.userId) return;

    let channelId,
      createdChannel,
      isSubscribed = false;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.otherUserId === user.userId) {
        channelId = key;
        isSubscribed = true; // DMs are always subscribed if present here
      }
    });
    if (!channelId) {
      const response = await ChatActions.createDMChatChannel({ otherUserId: user.userId });
      if (!response || response.errors) {
        return;
      }
      if (response.data && response.data.createDMChatChannel) {
        createdChannel = response.data.createDMChatChannel;
        channelId = createdChannel.channelId;
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    if (createdChannel) {
      await this._addChannel({ ...createdChannel, isSubscribed: true });
    }
    return this.props.navigateToChat({ channelId });
  };

  // checks if we have a chat channel for this game,
  // creates it if not, and navigates to it.
  openChannelForGame = async (game) => {
    if (!game || !game.gameId) return;

    const channelId = await this._joinOrCreateChannelForGame(game);
    return this.props.navigateToChat({ channelId });
  };

  closeChannel = async (channelId) => {
    await this._chat.leaveChannelAsync(channelId);
    let messageIdsCleared;
    await this.setState((state) => {
      let channels = { ...state.channels };
      if (channels[channelId]) {
        if (channels[channelId].messages) {
          messageIdsCleared = channels[channelId].messages.map((m) => m.chatMessageId);
        }
        if (channels[channelId].type === 'dm') {
          delete channels[channelId];
        } else {
          channels[channelId].messages = [];
          channels[channelId].isSubscribed = false;
        }
      }
      return {
        ...state,
        channels,
      };
    });
    if (messageIdsCleared && messageIdsCleared.length) {
      this._chat.unseeChatMessageIds(messageIdsCleared);
    }
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

    // fetch channels if we get messages from unknown channels.
    const newChannelIds = Object.keys(unseenChannelIds);
    if (newChannelIds.length) {
      await this.refreshChannelData();
      Object.entries(this.state.channels).forEach(([_, channel]) => {
        if (channel.otherUserId && !this.props.userPresence.userIdToUser[channel.otherUserId]) {
          userIds[channel.otherUserId] = true;
        }
      });
    }

    // request any users we've never seen before.
    const newUserIds = Object.keys(userIds);
    if (newUserIds.length) {
      try {
        let users = await Actions.getUsers({ userIds: newUserIds });
        await this.props.userPresence.addUsers(users);
      } catch (e) {}
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

  findChannelForGame = (game) => {
    let channelId,
      isSubscribed = false;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.gameId === game.gameId) {
        channelId = key;
        isSubscribed = channel.isSubscribed;
      }
    });
    return { channelId, isSubscribed };
  };

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

  _handleChatNotification = (event) => {
    // TODO: replace this with something better
    let result = this.findChannel('general');
    if (result) {
      this.setState(async (state) => {
        let c = { ...state.channels[result.channelId] };
        if (!c.messages) {
          c.messages = [];
        }
        c.messages.push({
          type: 'NOTICE',
          body: await ChatUtilities.formatMessageAsync(event.params.message),
          timestamp: new Date().toString(),
        });
        let channels = { ...state.channels };
        channels[result.channelId] = c;
        return {
          ...state,
          channels,
        };
      });
    }
  };

  _joinOrCreateChannelForGame = async (game) => {
    let { channelId, isSubscribed } = this.findChannelForGame(game);
    let createdChannel;
    if (!channelId) {
      const response = await ChatActions.createGameChatChannel({ gameId: game.gameId });
      if (!response || response.errors) {
        return;
      }
      if (response.data && response.data.createGameChatChannel) {
        createdChannel = response.data.createGameChatChannel;
        channelId = createdChannel.channelId;
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    if (createdChannel) {
      await this._addChannel({ ...createdChannel, isSubscribed: true });
    }
    return channelId;
  };

  _addChannel = async (channel) => {
    return this.setState((state) => {
      let channels = { ...state.channels };
      let existing = channels[channel.channelId] || {};
      channels[channel.channelId] = { ...existing, ...channel };
      return {
        ...state,
        channels,
      };
    });
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
