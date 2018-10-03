import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';

import App from './App';

import Storage from '~/common/storage';

import { injectGlobal } from 'react-emotion';

const injectGlobalStyles = () => injectGlobal`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  html, body {
    font-family: ${Constants.font.default};
    background: ${Constants.colors.black};
    font-size: 16px;

    @media (max-width: 728px) {
      font-size: 14px;
    }
  }
`;

const storage = new Storage('castle');

const run = async () => {
  injectGlobalStyles();
  const { currentPlaylist, me } = await Actions.getInitialData();

  const state = {
    logs: [],
    mediaUrl: '',
    playlist: currentPlaylist,
    media: null,
    viewer: me,
    local: null,
    searchQuery: '',
    searchResultsMedia: null,
    searchResultsPlaylists: null,
    sidebarMode: null, // current-playlists | dashboard | media-info | authentication | null
    pageMode: null, // browse | playlist | profile | sign-in | null
    profileMode: null, // media | playlist | null
    isMediaFavorited: false,
    isMediaExpanded: false,
    isOverlayActive: true,
    isScoreVisible: false,
  };

  ReactDOM.render(<App state={state} storage={storage} />, document.getElementById('root'));
};

run();
