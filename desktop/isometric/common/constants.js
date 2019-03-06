export const cubeSize = 15;
export const maxLoopLimit = 4000;
export const maxJSValue = 9999999;
export const directionChoices = ['NE', 'SE', 'SW', 'NW'];

export const links = {
  download: {
    mac: `https://github.com/expo/ghost-releases/raw/master/castle-macosx.app.zip`,
    windows: `https://github.com/expo/ghost-releases/raw/master/CastleSetup.exe`,
  },
};

export const colors = {
  text: `rgb(36,39,41)`,
  background: `rgb(250,250,251)`,
  sidebar: `rgb(213,213,213)`,
  white: `#FAFAFB`,
  subsection: `rgba(228,230,232, 0.8)`,
  foreground: `#E4E6E8`,
  action: `blue`,
  brand1: `#00ffff`, // cyan
  brand2: `#ff00ff`, // magenta
  brand3: '#8F79D8', // violet
  brand4: '#ffff00', // yellow
};

export const typescale = {
  lvl1: '4.209rem', // 67.34px - mobile: 50.50px
  lvl2: '3.157rem', // 50.52px - mobile: 37.89px
  lvl3: '2.369rem', // 37.90px - mobile: 28.42px
  lvl4: '1.777rem', // 28.43px - mobile: 16.00px
  lvl5: '1.333rem', // 21.33px - mobile: 12.00px
  lvl6: '1rem', //---- 16.00px - mobile: 9.00px
  lvl7: '0.75rem', //- 12.00px - mobile: 6.75px
};

export const linescale = {
  lvl1: '1',
  lvl2: '1',
  lvl3: '1.2',
  lvl4: '1.25',
  lvl5: '1.45',
  lvl6: '1.5',
  lvl7: '1.5',
};

export const directionValues = {
  NE: {
    x: 0,
    z: -1,
  },
  SE: { x: 1, z: 0 },
  SW: { x: 0, z: 1 },
  NW: { x: -1, z: 0 },
};

export const inverseDirections = {
  NE: 'SW',
  SE: 'NW',
  SW: 'NE',
  NW: 'SE',
};

export const directionRotationValues = {
  NW: Math.PI / 2,
  SW: Math.PI / 1,
  NE: Math.PI / 0.5,
  SE: Math.PI / (2 / 3),
};

export const directionCoordinates = {
  x: {
    SE: 1,
    SW: 0,
    NW: -1,
    NE: 0,
  },
  z: {
    SE: 0,
    SW: 1,
    NW: 0,
    NE: -1,
  },
};
