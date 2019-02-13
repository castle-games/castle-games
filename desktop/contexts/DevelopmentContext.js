import * as React from 'react';

/**
 *  DevelopmentContext contains the "making game" state of the app.
 */
export const DevelopmentContextDefaults = {
  isDeveloping: false,
  setIsDeveloping: (isDeveloping) => {},

  logs: [],
  clearLogs: () => {},
};

export const DevelopmentContext = React.createContext(DevelopmentContextDefaults);
