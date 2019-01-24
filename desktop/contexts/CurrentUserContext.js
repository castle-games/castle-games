import * as React from 'react';

export const CurrentUserContextDefaults = {
  user: null,
};

export const CurrentUserContext = React.createContext(CurrentUserContextDefaults);
