import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';

import { CastleChat, ConnectionStatus } from 'castle-chat-lib';

const CHAT_SERVICE_URL = 'https://castle-chat.onrender.com';

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const ChatSessionContext = React.createContext({
  messages: [],
  channel: null,
  handleConnect: (channel) => {},
  handleSendChannelMessage: (text) => {},
  animating: 2,
  start: () => {},
});

class ChatSessionContextProvider extends React.Component {
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
  }

  componentDidMount() {
    this.start();
  }

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

    const existingChannel = this.props.social.findSubscribedChannel({
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

  _handleConnectStatus = async (status) => {
    // console.log('status', status);
  };

  _handleMessagesAsync = async (allMessages) => {
    const messages = this.state.messages;
    let userIds = {};

    allMessages.forEach((m) => {
      if (!messages[m.channelId]) {
        messages[m.channelId] = [];
      }

      userIds[m.fromUserId] = true;

      // NOTE(jim): This is an unfortunate complication. On the first load you want to push elements
      // into the array, on the second load you want to perform an unshift. I'll need to ping Jesse
      // about this at some point.
      if (this._firstLoadComplete !== false) {
        messages[m.channelId].push(m);
      } else {
        messages[m.channelId].unshift(m);
      }
    });

    try {
      let users = await Actions.getUsers({ userIds: Object.keys(userIds) });
      await this.props.social.addUsers(users);
    } catch (e) {}

    this._firstLoadComplete = true;
    this.setState({ messages });
  };

  _handlePresenceAsync = async (event) => {
    if (!event.user_ids) {
      return;
    }

    this.props.social.setOnlineUserIds(event.user_ids);
  };

  render() {
    return (
      <ChatSessionContext.Provider value={this.state}>
        {this.props.children}
      </ChatSessionContext.Provider>
    );
  }
}

export { ChatSessionContext, ChatSessionContextProvider };
