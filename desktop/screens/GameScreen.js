import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import GameActionsBar from '~/components/GameActionsBar';
import GameWindow from '~/native/gamewindow';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { HistoryContext } from '~/contexts/HistoryContext';
import { NavigationContext } from '~/contexts/NavigationContext';
import * as NativeUtil from '~/native/nativeutil';

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
    isLoggedIn: false,
    history: null,
  };
  state = {
    isMuted: false,
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

    // TODO: metadata: entryPoint should always be defined by this point
    if (prevProps && prevProps.media && prevProps.media.entryPoint) {
      oldUrl = prevProps.media.entryPoint;
    }
    if (this.props.media && this.props.media.entryPoint) {
      newUrl = this.props.media.entryPoint;
    }

    if (!newUrl) {
      // close window
      await GameWindow.close();
    } else if (newUrl !== oldUrl) {
      // close window and open new
      await GameWindow.close();
      await GameWindow.open(newUrl);
      this.props.history.addItem(this.props.media);
      // TODO: restore this behavior
      /*
      const userPlayData = { mediaUrl, ...media };
      Logs.system(`Loading project at ${mediaUrl}`);

      amplitude.getInstance().logEvent('OPEN_LUA', {
        mediaUrl,
      });

      const isLocal = Urls.isPrivateUrl(mediaUrl);
      const sidebarMode = isLocal ? 'development' : 'current-context';
      // Don't `await` this since we don't want to make it take longer to get the media
      UserPlay.startAsync(userPlayData); 
      */
      // Sync state for new Ghost instance
      NativeUtil.sendLuaEvent('CASTLE_SET_LOGGED_IN', this.props.isLoggedIn);
      NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', this.state.isMuted ? 0 : 1);
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

  _toggleIsMuted = () => {
    const isMuted = !this.state.isMuted;
    NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', isMuted ? 0 : 1);
    this.setState({ isMuted });
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_GAME_CONTAINER}
          ref={(ref) => { this._gameContainerReference = ref; }}>
          Its the game
        </div>
        <GameActionsBar
          media={this.props.media}
          isMuted={this.state.isMuted}
          onToggleMute={this._toggleIsMuted}
        />
      </div>
    );
  }
}

export default class GameScreenWithContext extends React.Component {
  render() {
    return (
      <NavigationContext.Consumer>
        {navigation => (
          <HistoryContext.Consumer>
            {history => (
              <CurrentUserContext.Consumer>
                {currentUser => (
                  <GameScreen
                    media={navigation.media}
                    history={history}
                    isLoggedIn={currentUser.user !== null}
                  />
                )}
              </CurrentUserContext.Consumer>
            )}
          </HistoryContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}