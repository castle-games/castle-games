import * as React from 'react';

export const NavigationContextDefaults = {
  contentMode: 'home',
  timeLastNavigated: 0,
  gameUrl: '',
  game: null,
  timeGameLoaded: 0,
  userProfileShown: null,
};

export const NavigationContext = React.createContext(NavigationContextDefaults);
