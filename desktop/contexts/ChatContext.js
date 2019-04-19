import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Actions from '~/common/actions';
import * as Strings from '~/common/strings';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import { NativeBinds } from '~/native/nativebinds';

const CHAT_SERVICE_URL = 'https://chat.castle.games:5285/http-bind/';
const ROOM_NAME = 'general';
const NOTIFICATIONS_USER_ID = -1;
const TEST_MESSAGE = null;

const NotificationLevel = {
  NONE: 0,
  TAG: 1,
  EVERY: 2,
};

const ChatContextDefaults = {
  messages: [],
  users: [],
  status: ConnectionStatus.CONNECTING,
  send: (message) => {},
  connect: () => {},
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const ChatContext = React.createContext(ChatContextDefaults);

class ChatContextProvider extends React.Component {
  _chat = null;
  _handleMessagesLock = false;

  constructor(props) {
    super(props);
    this.state = {
      ...ChatContextDefaults,
      send: this._handleSubmit,
      connect: this._handleConnect,
    };
  }

  componentWillMount() {
    if (!this.props.currentUser) {
      return;
    }

    this.startChatService(this.props.currentUser.userId);
    window.addEventListener('CASTLE_ADD_CHAT_NOTIFICATION', this._addChatNotificationAsync);
  }

  componentWillUnmount() {
    window.removeEventListener('CASTLE_ADD_CHAT_NOTIFICATION', this._addChatNotificationAsync);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.currentUser && this.props.currentUser) {
      if (!this._chat) {
        this.startChatService(this.props.currentUser.userId);
      }
    }
  }

  _acquireLockAsync = async () => {
    while (this._handleMessagesLock) {
      await sleep(100);
    }
    this._handleMessagesLock = true;
  };

  _releaseLock = () => {
    this._handleMessagesLock = false;
  };

  _addChatNotificationAsync = async (event) => {
    await this._acquireLockAsync();

    this.setState((state) => {
      state.messages.push({
        richMessage: { message: [{ text: event.params.message }] },
        roomName: ROOM_NAME,
        userId: NOTIFICATIONS_USER_ID,
        timestamp: new Date().toString(),
        key: Math.random(),
      });

      state.messages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      this._releaseLock();

      return {
        messages: state.messages,
      };
    });
  };

  _getUserForId = (userId) => {
    if (userId == 'admin') {
      return {
        userId: 'admin',
        username: 'admin',
      };
    }

    return this.props.social.userIdToUser[userId];
  };

  _triggerLocalNotifications = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];

      let title = 'Castle Chat';
      let fromUserId = message.message.name;
      if (this.props.social.userIdToUser[fromUserId]) {
        title = `${title} from @${this.props.social.userIdToUser[fromUserId].username}`;
      }

      NativeBinds.showDesktopNotification({
        title,
        body: ChatUtilities.messageToString(message, this.props.social),
      });
    }
  };

  _getNotificationLevel = () => {
    if (!this.props.currentUser) {
      return NotificationLevel.NONE;
    }

    let notifications = this.props.currentUser.notifications;
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

  startChatService = async (userId) => {
    if (Strings.isEmpty(userId)) {
      console.error('Cannot start chat without a logged in user.');
      return;
    }

    let token = await Actions.getAccessTokenAsync();
    if (!token) {
      console.error('Cannot start chat without an access token.');
      return;
    }

    this._chat = new CastleChat();
    this._chat.init(CHAT_SERVICE_URL, userId, token, [ROOM_NAME]);

    this._chat.setOnMessagesHandler(this._handleMessagesAsync);
    this._chat.setOnPresenceHandler(this._handlePresenceAsync);
    this._chat.setConnectionStatusHandler((status) => {
      this.setState({ status });

      if (status === ConnectionStatus.DISCONNECTED) {
        this.setState({
          messages: [],
          users: [],
        });

        // NOTE(jim): Fix this somewehre else.
        this.props.social.setOnlineUserIds({});
      }
    });

    this._chat.connect();
  };

  _handleSubmit = async (message) => {
    if (this._chat) {
      this._chat.sendMessageAsync(ROOM_NAME, message);
    }
  };

  _handleConnect = async () => {
    if (this._chat) {
      this._chat.connect();
    }
  };

  _handlePresenceAsync = async (event) => {
    if (event.roomName === ROOM_NAME) {
      this.setState({ users: event.roster.map((user) => user.name) });

      let onlineUsersMap = {};
      event.roster.forEach((user) => {
        onlineUsersMap[user.name] = true;
      });

      this.props.social.setOnlineUserIds(onlineUsersMap);
    }
  };

  _handleMessagesAsync = async (messages) => {
    if (TEST_MESSAGE) {
      messages.push({
        message: {
          name: '1',
          body: TEST_MESSAGE,
        },
        roomName: ROOM_NAME,
        timestamp: new Date().toString(),
      });
    }

    // load all users first
    let userIdsToLoad = {};
    let localNotifications = [];
    let notificationLevel = this._getNotificationLevel();
    let { currentUser } = this.props;

    for (let i = 0; i < messages.length; i++) {
      let fromUserId = messages[i].message.name;
      let fromUser = this._getUserForId(fromUserId);
      if (!fromUser) {
        userIdsToLoad[fromUserId] = true;
      }

      messages[i].richMessage = ChatUtilities.convertToRichMessage(messages[i].message.body);
      if (messages[i].richMessage.message) {
        for (let j = 0; j < messages[i].richMessage.message.length; j++) {
          let richMessagePart = messages[i].richMessage.message[j];
          if (richMessagePart.userId) {
            let fromUser = this._getUserForId(richMessagePart.userId);
            if (!fromUser) {
              userIdsToLoad[richMessagePart.userId] = true;
            }

            if (
              notificationLevel === NotificationLevel.TAG &&
              fromUserId !== currentUser.userId &&
              !messages[i].message.delay &&
              richMessagePart.userId === this.props.currentUser.userId
            ) {
              localNotifications.push(messages[i]);
            }
          }
        }
      }

      if (
        notificationLevel === NotificationLevel.EVERY &&
        fromUserId !== currentUser.userId &&
        !messages[i].message.delay
      ) {
        localNotifications.push(messages[i]);
      }
    }

    try {
      let users = await Actions.getUsers({ userIds: _.keys(userIdsToLoad) });
      await this.props.social.addUsers(users);
    } catch (e) {}

    if (localNotifications.length > 0) {
      this._triggerLocalNotifications(localNotifications);
    }

    await this._acquireLockAsync();

    this.setState((state) => {
      for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let roomName = msg.roomName;
        let fromUserId = msg.message.name;
        let richMessage = msg.richMessage;
        let timestamp = msg.timestamp;

        if (richMessage) {
          state.messages.push({
            key: Math.random(),
            userId: fromUserId,
            richMessage,
            roomName,
            timestamp,
          });
        }
      }

      state.messages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      this._releaseLock();
      return {
        messages: state.messages,
      };
    });
  };

  render() {
    return <ChatContext.Provider value={this.state}>{this.props.children}</ChatContext.Provider>;
  }
}

export { ChatContext, ChatContextProvider };
