export const API_HOST = 'https://api.castle.games';

const brand = {
  fuchsia: `#ff00ff`,
};

export const colors = {
  text: `#000`,
  text2: `#6e6e6e`,
  background: `#FAFAFB`,
  background3: `#EFF0F1`,
  background4: `#D6D9DC`,
  backgroundLeftContext: `#C0C0C2`,
  white: `#fff`,
  black: `#000`,
  action: `blue`,
  error: '#f00',
  userStatus: {
    online: `#62D96B`,
    // online: `#2EE6D6`, -- cyan option
    offline: `#666`,
  },
};

export const logs = {
  default: colors.text,
  error: colors.error,
  remote: `#00a55d`,
  system: brand.fuchsia,
};

export const typescale = {
  lvl1: '4.209rem', // 67.34px - mobile: 50.50px
  lvl2: '3.157rem', // 50.52px - mobile: 37.89px
  lvl3: '2.369rem', // 37.90px - mobile: 28.42px
  lvl4: '1.777rem', // 28.43px - mobile: 16.00px
  lvl5: '1.333rem', // 21.33px - mobile: 12.00px
  lvl6: '1rem', //---- 16.00px - mobile: 9.00px
  lvl7: '0.75rem', //- 12.00px - mobile: 6.75px
  base: '1rem',
};

export const linescale = {
  lvl1: '1',
  lvl2: '1',
  lvl3: '1.2',
  lvl4: '1.25',
  lvl5: '1.45',
  lvl6: '1.5',
  lvl7: '1.5',
  base: '1.5',
};

export const font = {
  default: `'sf-body', -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica,  ubuntu, roboto, noto, segoe ui, arial, sans-serif`,
  heading: `'sf-heading', -apple-system, BlinkMacSystemFont, avenir next, avenir, helvetica neue, helvetica,  ubuntu, roboto, noto, segoe ui, arial, sans-serif`,
  mono: `'sf-mono', Consolas, monaco, monospace`,
};

export const TRANSPARENT_GIF_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
