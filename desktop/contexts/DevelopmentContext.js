import * as React from 'react';

export const DevelopmentContextDefaults = {
  isDeveloping: false,
  setIsDeveloping: (isDeveloping) => {},
};

export const DevelopmentContext = React.createContext(DevelopmentContextDefaults);
