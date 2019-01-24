import * as React from 'react';

export const NavigationContextDefaults = {
  contentMode: 'home',

  navigateToHome: () => {},

  mediaUrl: '',
  media: null,
  navigateToMediaUrl: async (url) => {},
  navigateToMedia: async (media) => {},

  userProfileShown: null,
  navigateToCurrentUserProfile: () => {},
  navigateToUserProfile: (user) => {},
};

export const NavigationContext = React.createContext(NavigationContextDefaults);
