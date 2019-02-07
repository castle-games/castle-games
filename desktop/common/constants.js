import * as Utilities from '~/common/utilities';

export const API_HOST = 'https://new-castle-server.app.render.com';

export const colors = {
  text: `#000`,
  background: `#e4e0e0`,
  background2: `#D9D9D9`,
  background3: `#CECECE`,
  white: `#fff`,
  black: `#000`,
  action: `blue`,
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

export const font = Utilities.isWindows()
  ? {
      // no custom fonts on windows
      default: `avenir next, avenir, helvetica neue, helvetica,  ubuntu, roboto, noto, segoe ui, arial, sans-serif`,
      heading: `avenir next, avenir, helvetica neue, helvetica,  ubuntu, roboto, noto, segoe ui, arial, sans-serif`,
      mono: `Consolas, monaco, monospace`,
    }
  : {
      default: `'sf-body', -apple-system, BlinkMacSystemFont, sans-serif`,
      heading: `'sf-heading', -apple-system, BlinkMacSystemFont, sans-serif`,
      mono: `'sf-mono', Consolas, monaco, monospace`,
    };

export const TRANSPARENT_GIF_DATA_URL =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
