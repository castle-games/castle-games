import * as React from 'react';

export const CurrentUserContextDefaults = {
  user: null,
  setCurrentUser: (user) => {},
  clearCurrentUser: () => {},
};

export const CurrentUserContext = React.createContext(CurrentUserContextDefaults);
