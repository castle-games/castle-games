import * as React from 'react';

export class Social {
  constructor() {
    this._userIdToUser = {};
  }

  getUserForId(userId) {
    if (userId == 'admin') {
      return {
        userId: 'admin',
        username: 'admin',
      };
    }

    return this._userIdToUser[userId];
  }

  setUserForId(userId, user) {
    this._userIdToUser[userId] = user;
  }
}

export const SocialContext = React.createContext({});
