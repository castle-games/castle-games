import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import GLCastle from '~/isometric/components/GLCastle';

const STYLES_LOADER_SCREEN = css``;

const STYLES_CASTLE_TEXT = css`
  font-family: ${Constants.font.game};
  color: ${Constants.colors.white};
  font-size: 32px;
  letter-spacing: 0.1px;
  text-align: center;
  padding-bottom: 56px;
`;

export default class GLLoaderScreen extends React.Component {
  render() {
    return (
      <div id={'loader-inner'} className={STYLES_LOADER_SCREEN}>
        <GLCastle />
        <div className={STYLES_CASTLE_TEXT}>Castle</div>
      </div>
    );
  }
}
