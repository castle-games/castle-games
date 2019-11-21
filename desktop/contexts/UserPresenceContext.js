import * as React from 'react';

// UserPresenceContext is a cache of users we have loaded in the app,
// and whether they are currently online.
// We use a react context for this cache because user objects can be updated
// as a result of real-time chat events, and we want mounted components to be able to consume
// those updates without user input.

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
      const userIdToUser = { ...state.userIdToUser };
      users.forEach((user) => {
        userIdToUser[user.userId] = user;
      });

      return {
        ...state,
        userIdToUser,
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
