import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.white};
  height: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default class GameActionsBar extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div>
          Its the game actions
        </div>
      </div>
    );
  }
}
