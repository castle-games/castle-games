import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import GameActionsBar from '~/components/GameActionsBar';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const STYLES_GAME_CONTAINER = css`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  color: ${Constants.colors.white};
`;

export default class GameScreen extends React.Component {
  static defaultProps = {
    media: null,
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_GAME_CONTAINER}>
          Its the game
        </div>
        <GameActionsBar />
      </div>
    );
  }
}
