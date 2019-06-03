import * as React from 'react';

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const ChatSessionContext = React.createContext({
  messages: [],
  channel: null,
  handleConnect: (channel) => {
    console.log(channel);
  },
});

class ChatSessionContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      channel: null,
      handleConnect: this._handleConnect,
    };
  }

  _handleConnect = (channel) => {
    this.setState({ channel });
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
