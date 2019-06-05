import * as React from 'react';
import * as ChatActions from '~/common/actions-chat';

const SocialContextDefaults = {
  userIdToUser: {},
  usernameToUser: {},
  onlineUserIds: {},
  addUser: (user) => {},
  addUsers: (users) => {},
  setOnlineUserIds: (userIds) => {},
  refreshChannelData: () => {},
  recentChatMessages: [],
  subscribedChatChannels: [],
  allChatChannels: [],
};

const SocialContext = React.createContext(SocialContextDefaults);

class SocialContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...SocialContextDefaults,
      ...props.value,
      addUser: this.addUser,
      addUsers: this.addUsers,
      setOnlineUserIds: this.setOnlineUserIds,
      refreshChannelData: this.refreshChannelData,
    };
  }

  refreshChannelData = async () => {
    const response = await ChatActions.getAllChat();
    if (response) {
      if (response.data) {
        if (response.data.subscribedChatChannels && response.data.allChatChannels) {
          this.setState({
            ...response.data,
          });
        }
      }
    }
  };

  addUser = (user) => {
    this.setState((state) => {
      state.userIdToUser[user.userId] = user;
      state.usernameToUser[user.username] = user;
      return {
        ...state,
        userIdToUser: state.userIdToUser,
        usernameToUser: state.usernameToUser,
      };
    });
  };

  addUsers = (users) => {
    return this.setState((state) => {
      users.forEach((user) => {
        state.userIdToUser[user.userId] = user;
        state.usernameToUser[user.username] = user;
      });

      return {
        ...state,
        userIdToUser: state.userIdToUser,
        usernameToUser: state.usernameToUser,
      };
    });
  };

  setOnlineUserIds = (userIds) => {
    this.setState({
      onlineUserIds: userIds,
    });
  };

  render() {
    return (
      <SocialContext.Provider value={this.state}>{this.props.children}</SocialContext.Provider>
    );
  }
}

export { SocialContext, SocialContextProvider };
