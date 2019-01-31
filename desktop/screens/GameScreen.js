import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import GameActionsBar from '~/components/game/GameActionsBar';
import GameWindow from '~/native/gamewindow';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { HistoryContext } from '~/contexts/HistoryContext';
import { NavigationContext } from '~/contexts/NavigationContext';
import * as NativeUtil from '~/native/nativeutil';
import Share from '~/common/share';
import * as Utilities from '~/common/utilities';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  width: 100%;
  height: 100%;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
`;

// the height and padding force this element
// to maintain 16:9 aspect ratio.
const STYLES_GAME_CONTAINER = css`
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  position: relative;
  align-items: center;
  justify-content: center;
  display: flex;
  color: ${Constants.colors.white};
`;

class GameScreen extends React.Component {
  static defaultProps = {
    game: null,
    timeGameLoaded: 0,
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
    window.addEventListener('resize', this._updateGameWindowFrame);
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateGameWindow(prevProps, prevState);
  }

  componentWillUnmount() {
    GameWindow.setVisible(false);
    window.removeEventListener('resize', this._updateGameWindowFrame);
  }

  _closeGame = async () => {
    // close window
    await GameWindow.close();
    Share.removeEventListeners();
  };

  _openGame = async (url) => {
    Share.addEventListeners();
    await GameWindow.open(url);
    this.props.history.addItem(this.props.game);
    // TODO: restore this behavior
    /*
      const userPlayData = { gameUrl, ...game };
      Logs.system(`Loading project at ${gameUrl}`);

      amplitude.getInstance().logEvent('OPEN_LUA', {
        gameUrl,
      });

      const isLocal = Urls.isPrivateUrl(gameUrl);
      const sidebarMode = isLocal ? 'development' : 'current-context';
      // Don't `await` this since we don't want to make it take longer to get the game
      UserPlay.startAsync(userPlayData);
      */
      // Sync state for new Ghost instance
    NativeUtil.sendLuaEvent('CASTLE_SET_LOGGED_IN', this.props.isLoggedIn);
    NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', this.state.isMuted ? 0 : 1);
  }

  _updateGameWindow = async (prevProps, prevState) => {
    let newUrl = Utilities.getLuaEntryPoint(this.props.game);
    let oldUrl = prevProps ? Utilities.getLuaEntryPoint(prevProps.game) : null;

    if (!newUrl) {
      // just close old game
      await this._closeGame();
    } else if (!oldUrl && this.props.timeNavigatedToGame !== this.props.timeGameLoaded) {
      // resume previously-loaded game
      // by calling this._updateGameWindowFrame() later.
    } else if (newUrl !== oldUrl) {
      // close game and open new
      await this._closeGame();
      await this._openGame(newUrl);
    } else if (newUrl === oldUrl && this.props.timeGameLoaded !== prevProps.timeGameLoaded) {
      // reload
      await this._closeGame();
      await this._openGame(oldUrl);
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
          ref={(ref) => {
            this._gameContainerReference = ref;
            this._updateGameWindowFrame();
          }}>
        </div>
        <GameActionsBar
          game={this.props.game}
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
                    game={navigation.game}
                    timeGameLoaded={navigation.timeGameLoaded}
                    timeNavigatedToGame={navigation.timeLastNavigated}
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
