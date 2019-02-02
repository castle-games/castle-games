import * as React from 'react';
import CastleChat from 'castle-chat-lib';
import * as Actions from '~/common/actions';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';

export default class ChatContainer extends React.Component {
  static contextType = CurrentUserContext;

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      chatMessages: [],
    };
  }

  componentWillMount() {
    this._startChatAsync();
  }

  _startChatAsync = async () => {
    let { user } = this.context;
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

  _handleMessageAsync = async (msg) => {
    let roomName = msg.roomName;
    let fromUserId = msg.message.name;
    let messageBody = msg.message.body;

    this.setState((state) => {
      state.chatMessages.push(`${fromUserId}: ${messageBody}`);
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
