import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';

import GameActionsBar from '~/components/game/GameActionsBar';
import GameWindow from '~/native/gamewindow';
import Logs from '~/common/logs';
import GLLoaderScreen from '~/isometric/components/GLLoaderScreen';

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
`;

const STYLES_LOADING_IMAGE = css`
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  opacity: 0.7;
`;

const jsUserToLuaUser = async (user) => ({
  userId: user.userId,
  username: user.username,
  name: user.name,
  photoUrl: user.photo ? user.photo.url : undefined,
});

const jsPostToLuaPost = async ({ postId, creator, media }) => ({
  postId,
  creator: await jsUserToLuaUser(creator),
  mediaUrl: media ? media.url : undefined,
  data: await Actions.postDataAsync({ postId }),
});

const jsGameToLuaGame = async ({ gameId, owner, title, url, description }) => ({
  gameId,
  owner: owner ? await jsUserToLuaUser(owner) : undefined,
  title,
  url,
  description,
});

class GameScreen extends React.Component {
  static defaultProps = {
    game: null,
    timeGameLoaded: 0,
    isLoggedIn: false,
    navigateToUserProfile: null,
  };

  state = {
    isMuted: false,
    loaded: true,
  };

  _gameContainerReference = null;

  constructor(props) {
    super(props);
    this._updateGameWindow(null, null);
    // This resize happens at the native level but Windows still needs some adjustment
    if (Utilities.isWindows()) {
      window.addEventListener('resize', this.updateGameWindowFrame);
    }
  }

  componentDidMount() {
    this.updateGameWindowFrame();
    window.addEventListener('CASTLE_GAME_LOADED', this._gameLoaded);
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateGameWindow(prevProps, prevState);
  }

  componentWillUnmount() {
    // don't call GameWindow.close(), because we might just be hiding the game.
    GameWindow.setVisible(false);
    window.removeEventListener('resize', this.updateGameWindowFrame);
    window.removeEventListener('CASTLE_GAME_LOADED', this._gameLoaded);
  }

  _gameLoaded = () => {
    console.log(`JS: Game '${this.props.game.url}' loaded`);
    GameWindow.setVisible(true);
    this.setState({ loaded: true });
  };

  _closeGame = async () => {
    // close window
    await GameWindow.close();
  };

  _openGame = async (url) => {
    await new Promise((resolve) => this.setState({ loaded: false }, resolve));

    Logs.system(`Loading game entry point: ${url}`);

    // Prepare the Lua format of the post
    const luaPost = this.props.post ? await jsPostToLuaPost(this.props.post) : undefined;

    // Set screen settings
    const { dimensions, scaling, upscaling, downscaling } = this.props.game.metadata || {};
    const screenSettings = {
      width: 800,
      height: 450,
      upscaling: 'on',
      downscaling: 'on',
    };
    if (dimensions) {
      if (dimensions === 'full') {
        screenSettings.width = 0;
        screenSettings.height = 0;
      } else {
        const [widthStr, heightStr] = dimensions.split('x');
        screenSettings.width = parseInt(widthStr) || 800;
        screenSettings.height = parseInt(heightStr) || 450;
      }
    }
    if (scaling) {
      screenSettings.upscaling = scaling;
      screenSettings.downscaling = scaling;
    }
    if (upscaling) {
      screenSettings.upscaling = upscaling;
    }
    if (downscaling) {
      screenSettings.downscaling = downscaling;
    }
    await NativeUtil.setScreenSettings(screenSettings); // Make sure to `await`!

    // Set initial data (read at various points in Lua code from `CASTLE_INITIAL_DATA`), then launch the game.
    // Make sure to `await` setting initial data before calling `.open`!
    await NativeUtil.putInitialData({
      graphics: {
        width: screenSettings.width,
        height: screenSettings.height,
      },
      audio: {
        volume: this.state.isMuted ? 0 : 1,
      },
      user: {
        isLoggedIn: this.props.isLoggedIn,
        me: this.props.isLoggedIn ? await jsUserToLuaUser(this.props.me) : undefined,
      },
      initialPost: luaPost,
      initialParams: this.props.gameParams ? this.props.gameParams : undefined,
      referrerGame: this.props.referrerGame
        ? await jsGameToLuaGame(this.props.referrerGame)
        : undefined,
    });

    // Launch the game window -- make sure to do all of the above first!
    await GameWindow.open({
      gameUrl: url,
      game: this.props.game,
      navigations: {
        navigateToEditPost: this.props.navigateToEditPost,
        navigateToGameUrl: this.props.navigateToGameUrl,
        navigateToGame: this.props.navigateToGame,
      },
    });

    // Triger the `castle.postopened` event afterward
    if (luaPost) {
      NativeUtil.sendLuaEvent('CASTLE_POST_OPENED', luaPost);
    }
  };

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
    this.updateGameWindowFrame();
  };

  updateGameWindowFrame = () => {
    if (this._gameContainerReference) {
      const rect = this._gameContainerReference.getBoundingClientRect();
      GameWindow.updateFrame(rect);
      if (this.state.loaded) {
        GameWindow.setVisible(true);
      }
    }
  };

  _toggleIsMuted = () => {
    const isMuted = !this.state.isMuted;
    NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', isMuted ? 0 : 1);
    this.setState({ isMuted });
  };

  render() {
    let actionsBarElement;
    if (!this.props.isFullScreen) {
      actionsBarElement = (
        <GameActionsBar
          game={this.props.game}
          timeGameLoaded={this.props.timeGameLoaded}
          navigateToUserProfile={this.props.navigateToUserProfile}
          clearCurrentGame={this.props.clearCurrentGame}
          onFullScreenToggle={() => this.props.setIsFullScreen(!this.props.isFullScreen)}
          reloadGame={this.props.reloadGame}
          onUpdateGameWindowFrame={this.updateGameWindowFrame}
        />
      );
    }

    let dpr = window.devicePixelRatio;
    const loadingImageStyle = {
      width: 301 / dpr,
      height: 78 / dpr,
    };

    let maybeLoadingAnimation;
    if (!this.state.loaded) {
      maybeLoadingAnimation = <GLLoaderScreen />;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={STYLES_GAME_CONTAINER}
          ref={(ref) => {
            this._gameContainerReference = ref;
            this.updateGameWindowFrame();
          }}>
          {maybeLoadingAnimation}
        </div>
        {actionsBarElement}
      </div>
    );
  }
}

export default class GameScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <NavigationContext.Consumer>
            {(navigation) => (
              <CurrentUserContext.Consumer>
                {(currentUser) => (
                  <GameScreen
                    game={navigation.game}
                    post={navigation.post}
                    gameParams={navigation.gameParams}
                    referrerGame={navigation.referrerGame}
                    timeGameLoaded={navigation.timeGameLoaded}
                    timeNavigatedToGame={navigation.timeLastNavigated}
                    navigateToUserProfile={navigator.navigateToUserProfile}
                    navigateToEditPost={navigator.navigateToEditPost}
                    navigateToGameUrl={navigator.navigateToGameUrl}
                    navigateToGame={navigator.navigateToGame}
                    isFullScreen={navigation.isFullScreen}
                    setIsFullScreen={navigator.setIsFullScreen}
                    reloadGame={navigator.reloadGame}
                    clearCurrentGame={navigator.clearCurrentGame}
                    isLoggedIn={currentUser.user !== null}
                    me={currentUser.user}
                    {...this.props}
                  />
                )}
              </CurrentUserContext.Consumer>
            )}
          </NavigationContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
