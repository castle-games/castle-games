import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Notifications from '~/common/notifications';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import _ from 'lodash';

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
  markChannelRead: (channelId) => {},
  ...EMPTY_CHAT_STATE,
};

const ChatContext = React.createContext(ChatContextDefaults);

class ChatContextManager extends React.Component {
  _firstLoadComplete = false;
  _messagesReadQueue;

  constructor(props) {
    super(props);
    this._messagesReadQueue = {};
    this._clearMessagesReadQueueDebounce = _.debounce(this._clearMessagesReadQueue, 300);
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
      markChannelRead: this.markChannelRead,
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
      await this.destroy();
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
    await this.destroy();
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
    await this._chat.connect();
  };

  destroy = async () => {
    if (this._chat) {
      await this._chat.disconnect();
    }
    this._chat = null;
    this._firstLoadComplete = false;
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
      fetchedChannel;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.name === name) {
        channelId = key;
        isSubscribed = channel.isSubscribed;
      }
    });
    if (!channelId) {
      // don't try to create a channel, but see if one exists with this name
      const response = await ChatActions.getAutocompleteAsync(name, ['channels']);
      if (!response || response.errors) {
        return;
      }
      if (response.chatChannels && response.chatChannels.length) {
        if (response.chatChannels[0].name === name) {
          fetchedChannel = response.chatChannels[0];
          channelId = fetchedChannel.channelId;
        }
      }
    }
    if (!isSubscribed) {
      await this._chat.joinChannelAsync(channelId);
    }
    if (fetchedChannel) {
      await this._addChannel({ ...fetchedChannel, isSubscribed: true });
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
    if (!this.props.userPresence.userIdToUser[user.userId]) {
      try {
        let users = await Actions.getUsers({ userIds: [user.userId] });
        await this.props.userPresence.addUsers(users);
      } catch (e) {}
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
        if (m.body && m.body.message) {
          for (let jj = 0; jj < m.body.message.length; jj++) {
            const component = m.body.message[jj];
            if (component.userId) {
              userIds[component.userId] = true;
            }
          }
        }
        if (!channels[m.channelId]) {
          // never seen this channel before, fetch the full channel object later
          channels[m.channelId] = {};
          unseenChannelIds[m.channelId] = true;
        } else {
          // we have already loaded this channel, mark it as unread
          channels[m.channelId].hasUnreadMessages = true;
        }
        if (!channels[m.channelId].messages) {
          channels[m.channelId].messages = [];
        }
        channelIds[m.channelId] = true;

        let channel = channels[m.channelId];
        if (m.isEdit) {
          const messageIndex = channel.messages.findIndex(
            (m2) => m2.chatMessageId === m.chatMessageId
          );
          if (messageIndex >= 0) {
            channel.messages[messageIndex] = m;
          }
        } else {
          channel.messages.push(m);
        }
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

    // lastly, show notifications if needed
    if (this._firstLoadComplete) {
      Notifications.showFromChatMessages(
        allUnsortedMessages,
        this.props.currentUser.user,
        this.state.channels
      );
    } else {
      this._firstLoadComplete = true;
    }
  };

  _handleConnectStatus = async (status) => {};

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
    let channel = { channelId: null, isSubscribed: false };
    Object.entries(this.state.channels).forEach(([key, c]) => {
      if (c.gameId && c.gameId === game.gameId) {
        channel = c;
      }
    });
    return channel;
  };

  findChannel = (name) => {
    let result = null;
    if (name) {
      let nameInvariant = name.toLowerCase();
      Object.entries(this.state.channels).forEach(([channelId, channel]) => {
        if (channel.name && channel.name === nameInvariant) {
          result = channel;
        }
      });
    }
    return result;
  };

  markChannelRead = (channelId) => {
    const channel = this.state.channels[channelId];
    if (channel && channel.hasUnreadMessages) {
      const lastMessage = this._mostRecentMessageInChannel(channelId);
      if (lastMessage) {
        this._messagesReadQueue[channelId] = lastMessage.chatMessageId;

        // immediately mark read locally
        this.setState((state) => {
          let channels = { ...state.channels };
          channels[channelId] = { ...channels[channelId], hasUnreadMessages: false };
          return {
            ...state,
            channels,
          };
        });

        // queue api call to mark as read
        this._clearMessagesReadQueueDebounce();
      }
    }
  };

  _clearMessagesReadQueue = async () => {
    let updatedChannels = {};
    let queueToClearPairs = Object.entries(this._messagesReadQueue);
    this._messagesReadQueue = {};
    for (let ii = 0; ii < queueToClearPairs.length; ii++) {
      const [channelId, messageId] = queueToClearPairs[ii];
      try {
        const updatedChannel = await ChatActions.markMessageRead(messageId);
        updatedChannels[channelId] = updatedChannel;
      } catch (_) {
        updatedChannels[channelId] = { hasUnreadMessages: false };
      }
    }
    this.setState((state) => {
      const channels = { ...state.channels };
      Object.entries(updatedChannels).forEach(([channelId, updates]) => {
        channels[channelId] = { ...channels[channelId], ...updates };
      });
      return {
        ...state,
        channels,
      };
    });
  };

  _mostRecentMessageInChannel = (channelId) => {
    // messages are sorted by date when they arrive.
    const channel = this.state.channels[channelId];
    if (channel && channel.messages && channel.messages.length) {
      return channel.messages[channel.messages.length - 1];
    }
    return null;
  };

  _handleChatNotification = (event) => {
    // TODO: replace this with something better
    let result;
    if (event.params.game) {
      result = this.findChannelForGame(event.params.game);
    } else {
      result = this.findChannel('lobby');
    }
    if (result) {
      this.setState(async (state) => {
        let c = { ...state.channels[result.channelId] };
        if (!c.messages) {
          c.messages = [];
        }
        c.messages.push({
          fromUserId: -1,
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
