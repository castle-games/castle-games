import * as React from 'react';
import * as Constants from '~/common/constants';

import { injectGlobal } from 'react-emotion';

export const LOADER_TRANSITION_MS = 500;

export const injectGlobalLoaderStyles = () => injectGlobal`
  #loader {
    background: ${Constants.colors.white};
    position: absolute;
    height: 100vh;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    transition: ${LOADER_TRANSITION_MS}ms ease all;
  }
  #loader.loader--finished {
    opacity: 0;
    pointer-events: none;
  }
  #loader-inner {
    transition: ${LOADER_TRANSITION_MS}ms ease all;
  }
  #loader-inner.loader-inner--finished {

  }
`;
