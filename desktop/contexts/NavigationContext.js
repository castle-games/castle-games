import * as React from 'react';

export const NavigationContextDefaults = {
  contentMode: 'home',
  timeLastNavigated: 0,

  navigateToHome: () => {},

  gameUrl: '',
  game: null,
  timeGameLoaded: 0,
  navigateToGameUrl: async (url) => {},
  navigateToGame: async (game) => {},
  navigateToCurrentGame: () => {},

  userProfileShown: null,
  navigateToCurrentUserProfile: () => {},
  navigateToUserProfile: async (user) => {},

  navigateToHistory: () => {},
};

export const NavigationContext = React.createContext(NavigationContextDefaults);
