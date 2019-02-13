import * as React from 'react';

/**
 *  NavigatorContext contains methods for changing the navigation state of the app.
 *  this is the "write" side of NavigationContext, i.e. methods here should have
 *  an effect on the value of NavigationContext.
 *
 *  Navigator and Navigation are separate because some components only want to change
 *  the state but never read from it.
 */
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
