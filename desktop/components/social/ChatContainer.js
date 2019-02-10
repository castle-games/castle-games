import * as React from 'react';
import { css } from 'react-emotion';

import * as Actions from '~/common/actions';
import { CastleChat, ConnectionStatus } from 'castle-chat-lib';
import ChatInput from '~/components/social/ChatInput';
import ChatMessagesList from '~/components/social/ChatMessagesList';
import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigationContext } from '~/contexts/NavigationContext';
import UIButton from '~/components/reusable/UIButton';

const STYLES_CONTAINER = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  background: ${Constants.colors.backgroundLeftContext};
`;

const STYLES_CONNECTING = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  padding-top: 32px;
  flex-direction: column;
`;

const ROOM_NAME = 'general';

class ChatContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      chatMessages: [],
      onlineUsers: [],
      connectionStatus: ConnectionStatus.CONNECTING,
    };

    this._handleMessagesLock = false;
  }

  componentWillMount() {
    this._startChatAsync();
  }

  _startChatAsync = async () => {
    let { user } = this.props;
    if (!user) {
      throw new Error('no user');
    }
    let userId = user.userId;
    if (!userId) {
      throw new Error('no userId');
    }

    let token = await Actions.getAccessTokenAsync();
    if (!token) {
      throw new Error('no token');
    }

    this._castleChat = new CastleChat();
    this._castleChat.init('http://chat.castle.games:5280/http-bind/', userId, token, [ROOM_NAME]);
    this._castleChat.setOnMessagesHandler(this._handleMessagesAsync);
    this._castleChat.setOnPresenceHandler(this._handlePresenceAsync);
    this._castleChat.setConnectionStatusHandler((status) => {
      this.setState({ connectionStatus: status });

      if (status === ConnectionStatus.DISCONNECTED) {
        this.setState({
          chatMessages: [],
          onlineUsers: [],
        });

        this.props.social.setOnlineUserIds({});
      }
    });
    this._castleChat.connect();
  };

  _sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

  _handleMessagesAsync = async (messages) => {
    while (this._handleMessagesLock) {
      await this._sleep(100);
    }

    // load all users first
    let userIdsToLoad = {};
    for (let i = 0; i < messages.length; i++) {
      let fromUserId = messages[i].message.name;
      let fromUser = this._getUserForId(fromUserId);
      if (!fromUser) {
        userIdsToLoad[fromUserId] = true;
      }
    }

    try {
      let users = await Actions.getUsers({ userIds: _.keys(userIdsToLoad) });
      this.props.social.addUsers(users);
    } catch (e) {}

    this._handleMessagesLock = true;

    this.setState((state) => {
      for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let roomName = msg.roomName;
        let fromUserId = msg.message.name;
        let messageBody = msg.message.body;
        let timestamp = msg.timestamp;

        state.chatMessages.push({
          key: Math.random(),
          userId: fromUserId,
          message: messageBody,
          roomName,
          timestamp,
        });
      }

      state.chatMessages.sort((a, b) => {
        return new Date(a.timestamp) - new Date(b.timestamp);
      });

      this._handleMessagesLock = false;
      return {
        chatMessages: state.chatMessages,
      };
    });
  };

  _handlePresenceAsync = async (event) => {
    if (event.roomName === ROOM_NAME) {
      this.setState({ onlineUsers: event.roster.map((user) => user.name) });

      let onlineUsersMap = {};
      event.roster.forEach((user) => {
        onlineUsersMap[user.name] = true;
      });
      this.props.social.setOnlineUserIds(onlineUsersMap);
    }
  };

  _onChangeInput = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  _onSubmit = (e) => {
    e.preventDefault();

    if (this._castleChat) {
      this._castleChat.sendMessage(ROOM_NAME, this.state.inputValue);
      this.setState({ inputValue: '' });
    }
  };

  _onClickConnect = () => {
    this._castleChat.connect();
  };

  _renderContent() {
    switch (this.state.connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return (
          <div>
            <ChatMessagesList
              messages={this.state.chatMessages}
              navigateToUserProfile={this.props.navigateToUserProfile}
            />
          </div>
        );
      case ConnectionStatus.CONNECTING:
        return <div className={STYLES_CONNECTING}>Global chat is connecting...</div>;
      case ConnectionStatus.DISCONNECTED:
        return (
          <div className={STYLES_CONNECTING}>
            <p style={{ marginBottom: 16 }}>Global chat is not connected.</p>
            <UIButton onClick={this._onClickConnect}>Reconnect</UIButton>
          </div>
        );
    }
  }

  render() {
    const readOnly = this.state.connectionStatus !== ConnectionStatus.CONNECTED;
    const placeholder = readOnly ? '' : 'Message global chat';
    return (
      <div className={STYLES_CONTAINER}>
        {this._renderContent()}
        <ChatInput
          value={this.state.inputValue}
          onChange={this._onChangeInput}
          onSubmit={this._onSubmit}
          readOnly={readOnly}
          placeholder={placeholder}
        />
      </div>
    );
  }
}

export default class ChatContainerWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <SocialContext.Consumer>
            {(social) => (
              <NavigationContext.Consumer>
                {(navigation) => (
                  <ChatContainer
                    user={currentUser.user}
                    social={social}
                    navigateToUserProfile={navigation.navigateToUserProfile}
                  />
                )}
              </NavigationContext.Consumer>
            )}
          </SocialContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
