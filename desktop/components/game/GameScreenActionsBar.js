import * as React from 'react';
import * as GameSVG from '~/components/primitives/game-screen-svg';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 48px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
  color: #222;
  font-size: 12px;
`;

export default class GameScreenActionsBar extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER}>&nbsp;</div>;
  }
}
