import * as React from 'react';

export const NavigationContextDefaults = {
  contentMode: 'home',

  navigateToHome: () => {},

  gameUrl: '',
  game: null,
  timeGameLoaded: 0,
  navigateToGameUrl: async (url) => {},
  navigateToGame: async (game) => {},

  userProfileShown: null,
  navigateToCurrentUserProfile: () => {},
  navigateToUserProfile: (user) => {},

  navigateToHistory: () => {},
};

export const NavigationContext = React.createContext(NavigationContextDefaults);
