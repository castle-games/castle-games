import * as React from 'react';
import * as ChatActions from '~/common/actions-chat';

const SocialContextDefaults = {
  userIdToUser: {},
  usernameToUser: {},
  onlineUserIds: {},
  addUser: (user) => {},
  addUsers: (users) => {},
  setOnlineUserIds: (userIds) => {},
  clearCurrentSubscribedChats: () => {},
  findChannel: (channel) => {},
  refreshChannelData: () => {},
  newUserJoinChannels: () => {},
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
      newUserJoinChannels: this.newUserJoinChannels,
      findSubscribedChannel: this.findSubscribedChannel,
      findChannel: this.findChannel,
      clearCurrentSubscribedChats: this.clearCurrentSubscribedChats,
    };
  }

  clearCurrentSubscribedChats = () => {
    this.setState({
      subscribedChatChannels: [],
      recentChatMessages: [],
    });
  };

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

  newUserJoinChannels = async () => {
    // NOTE(jim): General
    await ChatActions.joinChatChannel({
      channelId: 'channel-79c91814-c73e-4d07-8bc6-6829fad03d72',
    });

    // NOTE(jim): Random
    await ChatActions.joinChatChannel({
      channelId: 'channel-37c0532e-31a1-4558-9f3e-200337523859',
    });

    await this.refreshChannelData();
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

  findChannel = ({ name }) => {
    for (let i = 0; i < this.state.allChatChannels.length; i++) {
      const channel = this.state.allChatChannels[i];

      if (channel.name === name.toLowerCase()) {
        return channel;
      }
    }

    return null;
  };

  findSubscribedChannel = ({ channelId }) => {
    for (let i = 0; i < this.state.subscribedChatChannels.length; i++) {
      const channel = this.state.subscribedChatChannels[i];

      if (channel.channelId === channelId) {
        return channel;
      }
    }

    return null;
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
