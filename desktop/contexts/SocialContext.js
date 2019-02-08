import * as React from 'react';

export const SocialContextDefaults = {
  userIdToUser: {},
  onlineUserIds: {},
  addUser: (user) => {},
  addUsers: (users) => {},
  setOnlineUserIds: (userIds) => {},
};

export const SocialContext = React.createContext(SocialContextDefaults);
