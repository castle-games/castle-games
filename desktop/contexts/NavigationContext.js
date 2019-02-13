import * as React from 'react';

/**
 *  NavigationContext is the state of where the app is currently navigated,
 *  i.e. what is being shown to the user right now.
 *
 *  This is the "read" side of NavigatorContext, so methods in NavigatorContext
 *  should have an effect on values here.
 */
export const NavigationContextDefaults = {
  contentMode: 'home', // game | profile | home | signin | history
  timeLastNavigated: 0,
  gameUrl: '',
  game: null,
  timeGameLoaded: 0,
  userProfileShown: null,
};

export const NavigationContext = React.createContext(NavigationContextDefaults);
