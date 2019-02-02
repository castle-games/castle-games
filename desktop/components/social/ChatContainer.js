import * as React from 'react';
import CastleChat from 'castle-chat-lib';
import * as Actions from '~/common/actions';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';

class ChatContainer extends React.Component {
  static contextType = SocialContext;

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      chatMessages: [],
    };

    this._handleMessageLock = false;
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
    this._castleChat.setOnMessageHandler(this._handleMessageAsync);
  };

  _sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  _handleMessageAsync = async (msg) => {
    while (this._handleMessageLock) {
      await this._sleep(100);
    }

    this._handleMessageLock = true;

    let roomName = msg.roomName;
    let fromUserId = msg.message.name;
    let messageBody = msg.message.body;

    let fromUser = this.props.social.getUserForId(fromUserId);
    if (!fromUser) {
      try {
        fromUser = await Actions.getUser({ userId: fromUserId });
        this.props.social.setUserForId(fromUserId, fromUser);
      } catch (e) {
        fromUser = {
          username: fromUserId,
        };
      }
    }
    //
    this.setState((state) => {
      state.chatMessages.push(`${fromUser.username}: ${messageBody}`);
      this._handleMessageLock = false;
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
    const listItems = this.state.chatMessages.map((chatMessage) => <li>{chatMessage}</li>);

    return (
      <div>
        <div>{listItems}</div>

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
