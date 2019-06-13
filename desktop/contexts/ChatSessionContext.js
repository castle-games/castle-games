import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NativeBinds } from '~/native/nativebinds';

import StringReplace from 'react-string-replace';

const GENERAL_CHANNEL_ID = `channel-79c91814-c73e-4d07-8bc6-6829fad03d72`;
const DIRECT_MESSAGE_PREFIX = 'dm-';
const NOTIFICATIONS_USER_ID = -1;
const TEST_MESSAGE = null;
const NotificationLevel = {
  NONE: 0,
  TAG: 1,
  EVERY: 2,
};

const CHAT_SERVICE_URL = 'https://castle-chat.onrender.com';

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const ChatSessionContext = React.createContext({
  messages: {},
  channel: null,
  handleConnect: (channel) => {},
  handleSendChannelMessage: (text) => {},
  animating: 2,
});

class ChatSessionContextManager extends React.Component {
  _chat;
  _firstLoadComplete = false;
  _unlockAnimation = true;

  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      channel: null,
      animating: 2,
      handleConnect: this._handleConnect,
      start: this.start,
      handleSendChannelMessage: this._handleSendChannelMessage,
      destroy: this.destroy,
    };
    this._update();
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

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  comonentWillUnmount() {
    window.removeEventListener('CASTLE_ADD_CHAT_NOTIFICATION', this._handleChatNotification);
  }

  _getNotificationLevel = () => {
    const { user } = this.props.currentUser;
    if (!user) {
      return NotificationLevel.NONE;
    }

    let notifications = user.notifications;
    if (!notifications || !notifications.desktop) {
      return NotificationLevel.NONE;
    }

    let result = NotificationLevel.NONE;
    for (let i = 0; i < notifications.desktop.length; i++) {
      let preference = notifications.desktop[i];
      if (preference.type === 'chat_tagged' && preference.frequency === 'every') {
        result = NotificationLevel.TAG;
      }

      if (preference.type === 'chat_all' && preference.frequency === 'every') {
        return NotificationLevel.EVERY;
      }
    }

    return result;
  };

  _update = async (prevProps, prevState) => {
    const prevUser = prevProps && prevProps.currentUser ? prevProps.currentUser.user : null;
    // user logged out
    if (prevUser && !this.props.currentUser.user) {
      this.destroy();
    }
    // user logged in
    if (!prevUser && this.props.currentUser.user) {
      await this.start();
      await this.props.newUserJoinChannels();
    }
  };

  _handleConnect = async (channel) => {
    if (!this._unlockAnimation) {
      return;
    }

    let showEntryAnimation = false;
    if (this.state.channel) {
      showEntryAnimation = true;
      this.setState({ animating: 3 });
      await sleep(200);
    }

    const existingChannel = this.props.findSubscribedChannel({
      channelId: channel.channelId,
    });
    if (!existingChannel) {
      const response = await ChatActions.joinChatChannel({ channelId: channel.channelId });
      await this._chat.loadRecentMessagesAsync();
    }

    this._unlockAnimation = false;

    this.setState({ animating: 1, channel }, async () => {
      if (showEntryAnimation) {
        await sleep(200);
      }
      this.setState({ animating: 2 });
      this._unlockAnimation = true;
    });
  };

  start = async () => {
    let token = await Actions.getAccessTokenAsync();
    if (!token) {
      console.error('Cannot start chat without an access token.');
      return;
    }

    this._chat = new CastleChat();
    this._chat.init(CHAT_SERVICE_URL, Constants.API_HOST, token);
    this._chat.setOnMessagesHandler(this._handleMessagesAsync);
    this._chat.setOnPresenceHandler(this._handlePresenceAsync);
    this._chat.setConnectionStatusHandler(this._handleConnectStatus);
    this._chat.connect();
    await this._chat.loadRecentMessagesAsync();
  };

  destroy = () => {
    this._chat.disconnect();
    this._chat = null;
    this.setState({ messages: {}, channel: null });
    this._firstLoadComplete = false;
  };

  _handleSendChannelMessage = async (message) => {
    if (Strings.isEmpty(message)) {
      return;
    }

    ChatActions.sendChannelChatMessage({ message, channelId: this.state.channel.channelId });
  };

  _handleChatNotification = async (event) => {
    const messages = { ...this.state.messages };

    if (!messages[GENERAL_CHANNEL_ID]) {
      messages[GENERAL_CHANNEL_ID] = [];
    }

    messages[GENERAL_CHANNEL_ID].push({
      type: 'NOTICE',
      text: event.params.message,
      timestamp: new Date().toString(),
    });

    this.setState({ messages });
  };

  _handleConnectStatus = async (status) => {
    // console.log('status', status);
  };

  _triggerLocalNotifications = (notifications) => {
    const { userIdToUser } = this.props;

    notifications.forEach(({ title, message, fromUserId }) => {
      if (fromUserId) {
        const fromUser = userIdToUser[fromUserId];
        return NativeBinds.showDesktopNotification({
          title: `${title} from @${fromUser.username}`,
          body: `${message}`,
        });
      }

      return NativeBinds.showDesktopNotification({
        title,
        body: `${message}`,
      });
    });
  };

  _handleMessagesAsync = async (allMessages) => {
    const { currentUser, subscribedChatChannels } = this.props;
    const { messages } = this.state;
    const viewer = currentUser.user;

    if (!viewer) {
      return;
    }

    if (!subscribedChatChannels.length) {
      return;
    }

    let notificationLevel = this._getNotificationLevel();
    let notifications = [];
    let newChannels = [];
    let userIds = {};

    allMessages.forEach(async (m) => {
      // TODO(jim): Move this logic to the server at some point.
      if (m.channelId.startsWith(DIRECT_MESSAGE_PREFIX)) {
        let channelUserIds = m.channelId.replace(DIRECT_MESSAGE_PREFIX, '').split(',');
        const isViewer = channelUserIds.find((id) => viewer.userId === id);
        const isOtherUser = channelUserIds.find((id) => m.message.name === id);

        // NOTE(jim): Leave the channel. Don't save the message.
        if (!isViewer && !isOtherUser) {
          await ChatActions.leaveChatChannel({ channelId: m.channelId });
          return;
        }
      }

      const isSubscribed = subscribedChatChannels.find((c) => c.channelId === m.channelId);

      // NOTE(jim): I shouldn't even have to check.
      if (!isSubscribed) {
        return;
      }

      if (!messages[m.channelId]) {
        messages[m.channelId] = [];

        if (this._firstLoadComplete) {
          newChannels.push(m.channelId);
        }
      }

      userIds[m.fromUserId] = true;
      const messageJSON = JSON.parse(m.message.body);
      const fromUserId = m.message.name;
      const text = messageJSON.message ? messageJSON.message[0].text : '';

      // NOTE(jim): Notified every time someone tags you in a channel.
      StringReplace(text, /@([a-zA-Z0-9_-]+)/g, (match, i) => {
        if (
          notificationLevel === NotificationLevel.TAG &&
          String(fromUserId) !== String(viewer.userId) &&
          !m.message.delay &&
          match === viewer.username
        ) {
          notifications.push({
            title: 'Castle Chat',
            fromUserId,
            message: text,
          });
        }

        return match;
      });

      // NOTE(jim): Notified every time someone chats in a channel.
      if (
        notificationLevel === NotificationLevel.EVERY &&
        String(fromUserId) !== String(viewer.userId) &&
        !m.message.delay
      ) {
        notifications.push({
          title: 'Castle Chat',
          fromUserId,
          message: text,
        });
      }

      // NOTE(jim): Schema for the props the rendering component needs.
      let requiredMessageProps = {
        type: 'MESSAGE',
        fromUserId: m.fromUserId,
        chatMessageId: m.chatMessageId,
        text: text,
        timestamp: m.timestamp,
      };

      // NOTE(jim): the array is reversed in the wrong direction on first load.
      if (this._firstLoadComplete) {
        messages[m.channelId].push(requiredMessageProps);
      } else {
        messages[m.channelId].unshift(requiredMessageProps);
      }
    });

    try {
      let users = await Actions.getUsers({ userIds: Object.keys(userIds) });
      await this.props.addUsersToSocial(users);
    } catch (e) {}

    // NOTE(jim): Do not send notifications when messages first load.
    if (notifications.length > 0 && this._firstLoadComplete) {
      this._triggerLocalNotifications(notifications);
    }

    this._firstLoadComplete = true;
    this.setState({ messages }, async () => {
      if (newChannels.length) {
        await this.props.refreshChannelData();
      }
    });
  };

  _handlePresenceAsync = async (event) => {
    if (!event.user_ids) {
      return;
    }

    let onlineUserIds = {};
    event.user_ids.forEach((id) => {
      onlineUserIds[id] = true;
    });
    this.props.setOnlineUserIds(onlineUserIds);
  };

  render() {
    return (
      <ChatSessionContext.Provider value={this.state}>
        {this.props.children}
      </ChatSessionContext.Provider>
    );
  }
}

class ChatSessionContextProvider extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <SocialContext.Consumer>
            {(social) => (
              <ChatSessionContextManager
                currentUser={currentUser}
                userIdToUser={social.userIdToUser}
                subscribedChatChannels={social.subscribedChatChannels}
                findSubscribedChannel={social.findSubscribedChannel}
                setOnlineUserIds={social.setOnlineUserIds}
                addUsersToSocial={social.addUsers}
                refreshChannelData={social.refreshChannelData}
                newUserJoinChannels={social.newUserJoinChannels}
                {...this.props}
              />
            )}
          </SocialContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}

export { ChatSessionContext, ChatSessionContextProvider };
