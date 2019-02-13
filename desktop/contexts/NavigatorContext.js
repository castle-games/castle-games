import * as React from 'react';

export const NavigatorContextDefaults = {
  navigateToHome: () => {},
  navigateToGameUrl: async (url) => {},
  navigateToGame: async (game) => {},
  navigateToCurrentGame: () => {},
  navigateToCurrentUserProfile: () => {},
  navigateToUserProfile: async (user) => {},
  navigateToHistory: () => {},
};

export const NavigatorContext = React.createContext(NavigatorContextDefaults);
