import * as React from 'react';

export const DevelopmentContextDefaults = {
  isDeveloping: false,
  setIsDeveloping: (isDeveloping) => {},

  logs: [],
  clearLogs: () => {},
};

export const DevelopmentContext = React.createContext(DevelopmentContextDefaults);
