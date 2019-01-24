import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import GameActionsBar from '~/components/GameActionsBar';
import GameWindow from '~/native/gamewindow';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
`;

const STYLES_GAME_CONTAINER = css`
  width: 100%;
  height: 100%;
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  color: ${Constants.colors.white};
`;

class GameScreen extends React.Component {
  static defaultProps = {
    media: null,
  };
  _gameContainerReference = null;

  constructor(props) {
    super(props);
    this._updateGameWindow(null, null);
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateGameWindow(prevProps, prevState);
  }

  componentWillUnmount() {
    GameWindow.setVisible(false);
  }

  _updateGameWindow = async (prevProps, prevState) => {
    let newUrl = (this.props.media) ? this.props.media.mediaUrl : null;
    let oldUrl = (prevProps && prevProps.media) ? prevProps.media.mediaUrl : null;
    if (!newUrl) {
      // close window
      await GameWindow.close();
    } else if (newUrl !== oldUrl) {
      // close window and open new
      await GameWindow.close();
      await GameWindow.open(newUrl);
    }
    this._updateGameWindowFrame();
  }

  _updateGameWindowFrame = () => {
    if (this._gameContainerReference) {
      const rect = this._gameContainerReference.getBoundingClientRect();
      GameWindow.updateFrame(rect);
      GameWindow.setVisible(true);
    }
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_GAME_CONTAINER}
          ref={(ref) => { this._gameContainerReference = ref; }}>
          Its the game
        </div>
        <GameActionsBar />
      </div>
    );
  }
}

export default class GameScreenWithContext extends React.Component {
  static contextType = NavigationContext;
  render() {
    return (
      <GameScreen media={this.context.media} />
    );
  }
}
