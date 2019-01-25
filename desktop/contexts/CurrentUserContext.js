import * as React from 'react';

export const CurrentUserContextDefaults = {
  user: null,
  setCurrentUser: (user) => {},
  clearCurrentUser: () => {},
  refreshCurrentUser: async () => {},
};

export const CurrentUserContext = React.createContext(CurrentUserContextDefaults);
