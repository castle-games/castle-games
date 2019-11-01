import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Notifications from '~/common/notifications';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as uuid from 'uuid/v4';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import _ from 'lodash';

const EMPTY_CHAT_STATE = {
  channels: {},
  channelOnlineCounts: {},
  channelOnlineUserIds: {},
};

const ChatContextDefaults = {
  sendMessage: async (channelId, plainMessage, messageToEdit = null) => {},
  toggleReaction: async (channelId, message, emojiShortName) => {},
  openChannelWithId: async (channelId) => {},
  openChannelWithName: async (name) => {},
  openChannelForUser: async (user) => {},
  openChannelForGame: async (game, options) => {},
  closeChannel: async (channelId) => {},
  findChannel: (channelName) => {},
  findChannelForGame: (game) => {},
  markChannelRead: (channelId) => {},
  ...EMPTY_CHAT_STATE,
};

const ChatContext = React.createContext(ChatContextDefaults);

class ChatContextManager extends React.Component {
  static defaultProps = {
    updateMultiplayerSessions: () => {},
  };

  _firstLoadComplete = false;
  _messagesReadQueue;
  _optimisticMessageIdsPending = {};

  constructor(props) {
    super(props);
    this._messagesReadQueue = {};
    this._clearMessagesReadQueueDebounce = _.debounce(this._clearMessagesReadQueue, 300);
    this.state = {
      ...ChatContextDefaults,
      ...props.value,
      sendMessage: this.sendMessage,
      toggleReaction: this.toggleReaction,
      openChannelWithId: this.openChannelWithId,
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
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
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

    let channelId = this.props.navigation.chatChannelId;
    let prevChannelId =
      prevProps && prevProps.navigation ? prevProps.navigation.chatChannelId : null;
    if (channelId && prevChannelId !== channelId) {
      this._refreshChannelIds([channelId]);
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
    this._chat.setOnUpdateHandler(this._handleUpdateAsync);
    await this._chat.connect();
    await this._refreshAllSubscribedChannels();
  };

  destroy = async () => {
    if (this._chat) {
      await this._chat.disconnect();
    }
    this._chat = null;
    this._firstLoadComplete = false;
    if (this._mounted) {
      this.setState((state) => {
        return {
          ...state,
          ...EMPTY_CHAT_STATE,
        };
      });
    }
  };

  openChannelWithId = async (channelId) => {
    let isSubscribed = false,
      fetchedChannel;
    Object.entries(this.state.channels).forEach(([key, channel]) => {
      if (channel.channelId === channelId) {
        isSubscribed = channel.isSubscribed;
      }
    });
    if (!isSubscribed) {
      fetchedChannel = await this._chat.joinChannelAsync(channelId);
    }
    if (fetchedChannel) {
      await this._addChannel({ ...fetchedChannel, isSubscribed: true });
    }
    return this.props.showChatChannel(channelId);
  };

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
    return this.props.showChatChannel(channelId);
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
    return this.props.showChatChannel(channelId);
  };

  // checks if we have a chat channel for this game,
  // creates it if not, and navigates to it.
  openChannelForGame = async (game, options) => {
    if (!game || !game.gameId || !game.chatChannelId) return false;

    const channelId = await this._observeChannelForGame(game);
    return this.props.showChatChannel(channelId, options);
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
        delete channels[channelId];
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

  sendMessage = async (channelId, plainMessage, messageToEdit = null) => {
    if (!this._chat) return;
    if (Strings.isEmpty(plainMessage)) {
      return;
    }
    if (plainMessage.charAt(0) === '+' && ChatUtilities.isEmojiBody(plainMessage.substring(1))) {
      // +:emoji: reacts to previous message
      const lastMessage = this._mostRecentMessageInChannel(channelId, true);
      if (lastMessage) {
        const emoji = plainMessage.substring(2, plainMessage.length - 1);
        this.toggleReaction(channelId, lastMessage, emoji);
      }
      return;
    }

    const body = await ChatUtilities.formatMessageAsync(plainMessage, {});
    const slashCommand = ChatUtilities.getSlashCommand(body);
    if (slashCommand.isCommand) {
      // capture any non-me command without sending.
      // TODO: handle various commands
      if (slashCommand.command !== 'me') {
        return;
      }
    }

    // immediately push optimistic message
    const optimisticMessage = this._createOptimisticMessageObject(channelId, body, messageToEdit);
    await this.setState((state) => {
      let channel = state.channels[channelId];
      if (!channel) {
        channel = {};
      }
      if (!channel.messages) {
        channel.messages = [];
      }
      this._addMessageToMessages(optimisticMessage, channel.messages);
      const channels = { ...state.channels };
      channels[channelId] = channel;
      return {
        ...state,
        channels,
      };
    });
    if (messageToEdit) {
      return this._chat.editMessageAsync(
        messageToEdit.chatMessageId,
        body,
        optimisticMessage.tempChatMessageId
      );
    } else {
      return this._chat.sendMessageAsync(channelId, body, optimisticMessage.tempChatMessageId);
    }
  };

  toggleReaction = async (channelId, message, emojiShortName) => {
    if (!this._chat) return;

    // immediately push optimistic update
    const optimisticMessage = this._createOptimisticReaction(message, emojiShortName);
    await this.setState((state) => {
      let channel = state.channels[channelId];
      this._addMessageToMessages(optimisticMessage, channel.messages);
      const channels = { ...state.channels };
      channels[channelId] = channel;
      return {
        ...state,
        channels,
      };
    });
    return ChatActions.toggleChatMessageReaction(message.chatMessageId, emojiShortName);
  };

  _createOptimisticMessageObject = (channelId, body, messageToEdit) => {
    const { user } = this.props.currentUser;
    const tempId = uuid();
    this._optimisticMessageIdsPending[tempId] = true;
    try {
      // this may have already been stringified to get sent over the air
      body = JSON.parse(body);
    } catch (_) {}
    const timestamp = messageToEdit ? messageToEdit.timestamp : new Date();
    return {
      ...messageToEdit,
      chatMessageId: messageToEdit ? messageToEdit.chatMessageId : tempId,
      tempChatMessageId: tempId,
      channelId,
      body,
      fromUserId: user.userId,
      createdTime: timestamp,
      timestamp,
      isEdit: messageToEdit !== null,
      isEdited: messageToEdit !== null,
    };
  };

  _createOptimisticReaction = (message, emojiShortName) => {
    const { user } = this.props.currentUser;
    let reactions = message.reactions || [];
    const existingReactionIdx = reactions.findIndex((item) => item.emoji === emojiShortName);
    if (existingReactionIdx !== -1) {
      const existingIndex = reactions[existingReactionIdx].userIds.indexOf(user.userId);
      if (existingIndex === -1) {
        reactions[existingReactionIdx].userIds.push(user.userId);
      } else {
        reactions[existingReactionIdx].userIds.splice(existingIndex, 1);
      }
    } else {
      reactions.push({
        emoji: emojiShortName,
        userIds: [user.userId],
      });
    }
    return {
      ...message,
      reactions,
      isReactionUpdate: true,
    };
  };

  _handleMessagesAsync = async (allUnsortedMessages) => {
    let channelIds = {},
      unseenChannelIds = {},
      userIds = {};

    await this.setState((state) => {
      let channels = { ...state.channels };
      for (let ii = 0, nn = allUnsortedMessages.length; ii < nn; ii++) {
        const m = allUnsortedMessages[ii];

        // gather any users we may need to fetch from this message
        this._gatherUserIdsFromMessage(m, userIds);

        if (!channels[m.channelId]) {
          // never seen this channel before, fetch the full channel object later
          channels[m.channelId] = {};
          unseenChannelIds[m.channelId] = true;
        } else if (this._firstLoadComplete && ChatUtilities.messageHasActivity(m)) {
          // we have already loaded this channel, mark it as unread
          channels[m.channelId].hasUnreadMessages = true;
        }
        if (!channels[m.channelId].messages) {
          channels[m.channelId].messages = [];
        }
        channelIds[m.channelId] = true;

        let channel = channels[m.channelId];
        this._addMessageToMessages(m, channel.messages);

        if (
          this._firstLoadComplete &&
          Notifications.chatMessageHasNotification(
            m,
            this.props.currentUser.user,
            this.props.currentUser.settings,
            channel,
            Notifications.NotificationType.BADGE
          )
        ) {
          channel.unreadNotificationCount = channel.unreadNotificationCount || 0;
          channel.unreadNotificationCount += 1;
        }
      }

      Object.keys(channelIds).forEach((channelId) => {
        // we added new messages to this channel, re-sort
        let channel = channels[channelId];
        channel.messages = channel.messages.sort((a, b) => {
          // default to 0 for createdTime so messages without a createdTime get left in the past
          let time1 = a.createdTime || 0;
          let time2 = b.createdTime || 0;
          return new Date(time1) - new Date(time2);
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
      await this._refreshChannelIds(newChannelIds);
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
        this.props.currentUser.settings,
        this.state.channels,
        this.props.userPresence.userIdToUser
      );
    } else {
      this._firstLoadComplete = true;
    }
  };

  _gatherUserIdsFromMessage = (m, userIds) => {
    const maybeAddUserId = (userId) => {
      if (userId && !this.props.userPresence.userIdToUser[userId]) {
        userIds[userId] = true;
      }
    };

    maybeAddUserId(m.fromUserId);
    if (m.body && m.body.message) {
      m.body.message.forEach((component) => maybeAddUserId(component.userId));
    }
    if (m.reactions) {
      m.reactions.forEach(({ emoji, userIds }) => {
        if (userIds) {
          userIds.forEach(maybeAddUserId);
        }
      });
    }
  };

  _handleConnectStatus = async (status) => {};

  _handlePresenceAsync = async (event) => {
    if (event.user_ids) {
      let onlineUserIds = {};
      event.user_ids.forEach((id) => {
        onlineUserIds[id] = true;
      });
      this.props.userPresence.setOnlineUserIds(onlineUserIds);
    }
    if (event.channel_online_counts && event.channel_online_user_ids) {
      this.setState({
        channelOnlineCounts: event.channel_online_counts,
        channelOnlineUserIds: event.channel_online_user_ids,
      });
    }
  };

  _refreshChannelIds = async (channelIds) => {
    const response = await ChatActions.getChannels(channelIds);
    if (response) {
      this._mergeChannelData(response);
    }
  };

  _refreshAllSubscribedChannels = async () => {
    const response = await ChatActions.getSubscribedChannels();
    if (response && response.data) {
      const { subscribedChatChannels } = response.data;
      this._mergeChannelData(subscribedChatChannels);
    }
  };

  _mergeChannelData = (updatedChannels) => {
    this.setState((state) => {
      let channels = { ...state.channels };
      if (updatedChannels) {
        updatedChannels.forEach((channel) => {
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
  };

  _addMessageToMessages = (m, messages) => {
    let didSubstituteMessage = false;

    // if incoming message is an edit, replace existing with the same id
    if (m.isEdit || m.isReactionUpdate) {
      const messageIndex = messages.findIndex((m2) => m2.chatMessageId === m.chatMessageId);
      if (messageIndex >= 0) {
        messages[messageIndex] = m;
        didSubstituteMessage = true;
      }
    }

    // if incoming message is an optimistic ack, replace local copy with server copy
    if (m.tempChatMessageId && this._optimisticMessageIdsPending[m.tempChatMessageId] === true) {
      const messageIndex = messages.findIndex((m2) => m2.tempChatMessageId === m.tempChatMessageId);
      if (messageIndex >= 0) {
        messages[messageIndex] = m;
        delete this._optimisticMessageIdsPending[m.tempChatMessageId];
        didSubstituteMessage = true;
      }
    }

    // append new message
    if (!didSubstituteMessage) {
      messages.push(m);
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
          channels[channelId] = {
            ...channels[channelId],
            hasUnreadMessages: false,
            unreadNotificationCount: 0,
          };
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
        updatedChannels[channelId] = { hasUnreadMessages: false, unreadNotificationCount: 0 };
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

  _mostRecentMessageInChannel = (channelId, countHiddenMessages = true) => {
    // messages are sorted by date when they arrive.
    const channel = this.state.channels[channelId];
    if (channel && channel.messages && channel.messages.length) {
      for (let ii = channel.messages.length - 1; ii >= 0; ii--) {
        let m = channel.messages[ii];
        // ignore fake notification messages and optimistic messages; ignore hidden messages
        const isOptimistic =
          m.tempChatMessageId && this._optimisticMessageIdsPending[m.tempChatMessageId];
        const isHidden = countHiddenMessages ? false : ChatUtilities.isMessageHidden(m);
        if (m.chatMessageId && !isOptimistic && !isHidden) {
          return m;
        }
      }
    }
    return null;
  };

  _observeChannelForGame = async (game) => {
    let { channelId } = this.findChannelForGame(game);
    let createdChannel;
    if (!channelId) {
      await this._chat.observeChannelAsync(game.chatChannelId);
      channelId = game.chatChannelId;
    }
    await this._refreshChannelIds([channelId]);
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

  _handleUpdateAsync = async (type, body) => {
    switch (type) {
      case 'app-notification-update': {
        const { notification, plainTextMessage, unseenCount } = body;
        this.props.appendAppNotification(notification);
        break;
      }
      case 'multiplayer-session-update': {
        let gameIdToGame = {};
        for (let i = 0; i < body.games.length; i++) {
          let game = body.games[i];
          gameIdToGame[game.gameId] = game;
        }

        for (let i = 0; i < body.sessions.length; i++) {
          let session = body.sessions[i];
          // make a copy of this game, since we might have multiple sessions of this one game
          session.game = JSON.parse(JSON.stringify(gameIdToGame[session.gameId]));
          session.game.sessionId = session.sessionId;
          session.game.sessionUsers = session.users;
        }

        this.props.updateMultiplayerSessions(body.sessions);
        break;
      }
    }
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
                        showChatChannel={navigator.showChatChannel}
                        updateMultiplayerSessions={
                          currentUser.contentActions.updateMultiplayerSessions
                        }
                        appendAppNotification={currentUser.appendAppNotification}
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
