import * as React from 'react';
import { css } from 'react-emotion';

import * as Actions from '~/common/actions';
import CastleChat from 'castle-chat-lib';
import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';

const STYLES_CONTAINER = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
`;

const STYLES_MESSAGES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CHAT_ITEM = css`
  padding: 4px 0 0 8px;
  font-size: 10pt;
  cursor: default;
  min-height: 24px;

  :hover {
    background: ${Constants.colors.backgroundTint};
  }
`;

const STYLES_MESSAGE_USERNAME = css`
  font-weight: 700;
`;

class ChatContainer extends React.Component {
  static contextType = SocialContext;

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      chatMessages: [],
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
    this._castleChat.init('http://chat.castle.games:5280/http-bind/', userId, token, ['general']);
    this._castleChat.setOnMessagesHandler(this._handleMessagesAsync);
  };

  _sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  _handleMessagesAsync = async (messages) => {
    while (this._handleMessagesLock) {
      await this._sleep(100);
    }

    // load all users first
    let userIdsToLoad = {};
    for (let i = 0; i < messages.length; i++) {
      let fromUserId = messages[i].message.name;
      let fromUser = this.props.social.getUserForId(fromUserId);
      if (!fromUser) {
        userIdsToLoad[fromUserId] = true;
      }
    }

    try {
      let users = await Actions.getUsers({ userIds: _.keys(userIdsToLoad) });
      for (let i = 0; i < users.length; i++) {
        this.props.social.setUserForId(users[i].userId, users[i]);
      }
    } catch (e) {}

    this._handleMessagesLock = true;

    this.setState((state) => {
      for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let roomName = msg.roomName;
        let fromUserId = msg.message.name;
        let messageBody = msg.message.body;
        let timestamp = msg.timestamp;
        let fromUser = this.props.social.getUserForId(fromUserId);
        if (!fromUser) {
          fromUser = {
            username: fromUserId,
          };
        }

        state.chatMessages.push({
          key: Math.random(),
          user: fromUser,
          message: messageBody,
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

  _onChangeInput = (event) => {
    this.setState({ inputValue: event.target.value });
  };

  _onSubmit = (e) => {
    e.preventDefault();

    if (this._castleChat) {
      this._castleChat.sendMessage('general', this.state.inputValue);
      this.setState({ inputValue: '' });
    }
  };

  render() {
    const listItems = this.state.chatMessages.map((chatMessage) => (
      <div key={chatMessage.key} className={STYLES_CHAT_ITEM}>
        <span class={STYLES_MESSAGE_USERNAME}>{chatMessage.user.username}</span>:{' '}
        {chatMessage.message}
      </div>
    ));

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_MESSAGES_CONTAINER}>{listItems}</div>

        <form onSubmit={this._onSubmit}>
          <input type="text" value={this.state.inputValue} onChange={this._onChangeInput} />
          <input type="submit" value="Submit" />
        </form>
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
            {(social) => <ChatContainer user={currentUser.user} social={social} />}
          </SocialContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
