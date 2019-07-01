import * as React from 'react';

// UserPresenceContext is a cache of users we have loaded in the app,
// and whether they are currently online.

const UserPresenceContextDefaults = {
  userIdToUser: {},
  onlineUserIds: {},
  addUser: (user) => {},
  addUsers: (users) => {},
  setOnlineUserIds: (userIds) => {},
};

const UserPresenceContext = React.createContext(UserPresenceContextDefaults);

class UserPresenceContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...UserPresenceContextDefaults,
      ...props.value,
      addUser: this.addUser,
      addUsers: this.addUsers,
      setOnlineUserIds: this.setOnlineUserIds,
    };
  }

  addUser = (user) => {
    this.addUsers([user]);
  };

  addUsers = (users) => {
    return this.setState((state) => {
      users.forEach((user) => {
        state.userIdToUser[user.userId] = user;
      });

      return {
        ...state,
        userIdToUser: state.userIdToUser,
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
      <UserPresenceContext.Provider value={this.state}>
        {this.props.children}
      </UserPresenceContext.Provider>
    );
  }
}

export { UserPresenceContext, UserPresenceContextProvider };
