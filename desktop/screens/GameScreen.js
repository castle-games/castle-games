import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';
import { NativeBinds } from '~/native/nativebinds';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';

import SplitterLayout from 'react-splitter-layout';
import GameActionsBar from '~/components/game/GameActionsBar';
import GameWindow from '~/native/gamewindow';
import Logs from '~/common/logs';
import GLLoaderScreen from '~/isometric/components/GLLoaderScreen';
import Tools from '~/components/game/Tools';

import ChatSidebar from '~/components/chat/ChatSidebar';
import Game from '~/components/game/Game';

import 'react-splitter-layout/lib/index.css';

// TODO(jim): Feature flag for new game screen.
const USE_NEW_GAME_SCREEN = false;

// TODO(jim): We're dealing with side effects rom the react-splitter-layout
// It should be removed.
const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .layout-pane {
    height: 100%;
  }
`;

// TODO(jim): We're dealing with side effects and extra DOM elements from the react-splitter
// layout. It should be removed.
const STYLES_GAME_AND_TOOLS_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .splitter-layout {
    position: relative;
  }
`;

const STYLES_GAME_CONTAINER = css`
  position: relative;
  height: 100%;
  min-height: 25%;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const STYLES_LOADING_OVERLAY_CONTAINER = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 14px;
`;

const STYLES_LOADING_OVERLAY_ELEMENT = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.logs.system};
  font-size: 10px;
`;

const jsUserToLuaUser = async (user) =>
  user
    ? {
        userId: user.userId,
        username: user.username,
        name: user.name,
        photoUrl: user.photo ? user.photo.url : undefined,
      }
    : undefined;

const jsPostToLuaPost = async ({ postId, creator, media }) => ({
  postId,
  creator: await jsUserToLuaUser(creator),
  mediaUrl: media ? media.url : undefined,
  data: await Actions.postDataAsync({ postId }),
});

const jsGameToLuaGame = async ({ gameId, owner, title, url, description }) => ({
  gameId,
  owner: await jsUserToLuaUser(owner),
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
    luaNetworkRequests: [
      // Some example data to test with in the browser
      // {
      //   method: 'GET',
      //   url: 'https://github.com/schazers/badboxart/commits/master',
      //   id: 1,
      // },
      // {
      //   method: 'GET',
      //   url: 'https://github.com/schazers/badboxart/commits/kek',
      //   id: 2,
      // },
    ],
    loadingPhase: 'initializing',
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
    window.addEventListener('CASTLE_GAME_LOADED', this._handleGameLoaded);
    window.addEventListener('GHOST_NETWORK_REQUEST', this._handleLuaNetworkRequest);
  }

  componentDidUpdate(prevProps, prevState) {
    this._updateGameWindow(prevProps, prevState);
  }

  componentWillUnmount() {
    // don't call GameWindow.close(), because we might just be hiding the game.
    GameWindow.setVisible(false);
    window.removeEventListener('resize', this.updateGameWindowFrame);
    window.removeEventListener('CASTLE_GAME_LOADED', this._handleGameLoaded);
    window.removeEventListener('GHOST_NETWORK_REQUEST', this._handleLuaNetworkRequest);
  }

  _prepareInitialGameData = async (screenSettings) => {
    // Prepare the Lua format of the post
    const luaPost = this.props.post ? await jsPostToLuaPost(this.props.post) : undefined;

    return {
      graphics: {
        width: screenSettings.width,
        height: screenSettings.height,
      },
      audio: {
        volume: this.state.isMuted ? 0 : 1,
      },
      user: {
        isLoggedIn: this.props.isLoggedIn,
        me: await jsUserToLuaUser(this.props.me),
      },
      initialPost: luaPost,
      initialParams: this.props.gameParams ? this.props.gameParams : undefined,
      game: this.props.game ? await jsGameToLuaGame(this.props.game) : undefined,
      referrerGame: this.props.referrerGame
        ? await jsGameToLuaGame(this.props.referrerGame)
        : undefined,
    };
  };

  _handleGameLoaded = () => {
    GameWindow.setVisible(true);
    this.setState({ loaded: true });
  };

  _handleLuaNetworkRequest = async (e) => {
    const { type, id, url, method } = e.params;
    if (type == 'start') {
      this.setState(({ luaNetworkRequests }) => ({
        luaNetworkRequests: !luaNetworkRequests.find((req) => req.url == url)
          ? [...luaNetworkRequests, { id, url, method }]
          : luaNetworkRequests,
        loadingPhase: 'loading',
      }));
    } else if (type == 'stop') {
      await Actions.delay(60);
      this.setState(({ luaNetworkRequests }) => ({
        luaNetworkRequests: luaNetworkRequests.filter((req) => req.id !== id),
      }));
    }
  };

  _closeGame = async () => {
    if (this._toolsReference) {
      this._toolsReference.clearState();
    }

    // close window
    await GameWindow.close();
  };

  _openGame = async (url, game) => {
    await new Promise((resolve) =>
      this.setState(
        { loaded: false, luaNetworkRequests: [], loadingPhase: 'initializing' },
        resolve
      )
    );

    if (this._toolsReference) {
      this._toolsReference.clearState();
    }

    Logs.system(`Loading game entry point: ${url}`);
    const screenSettings = Utilities.getScreenSettings(game);
    const initialData = await this._prepareInitialGameData(screenSettings);

    // Launch the game window, passing all of the initial settings
    await GameWindow.open({
      gameUrl: url,
      game: game,
      navigations: {
        navigateToEditPost: this.props.navigateToEditPost,
        navigateToGameUrl: this.props.navigateToGameUrl,
        navigateToGame: this.props.navigateToGame,
      },
      initialData,
      screenSettings,
    });

    // Triger the `castle.postopened` event afterward
    if (initialData.initialPost) {
      NativeUtil.sendLuaEvent('CASTLE_POST_OPENED', initialData.initialPost);
    }

    // load newest playing/making user status (don't await)
    this.props.refreshCurrentUser();
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
      await this._openGame(newUrl, this.props.game);
    } else if (newUrl === oldUrl && this.props.timeGameLoaded !== prevProps.timeGameLoaded) {
      // reload
      await this._closeGame();
      await this._openGame(oldUrl, prevProps.game);
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

  _handleFullScreen = () => {
    this.props.setIsFullScreen(!this.props.isFullScreen);

    // TODO(jim):
    // - works for Windows
    // - does not work for MacOS.
    // - will need someone with native knowledge to help.
    /*
    try {
      NativeUtil.setWindowFrameFullscreen(!this.props.isFullScreen);
    } catch (e) {
      console.log(e);
    }
    */
  };

  render() {
    if (USE_NEW_GAME_SCREEN) {
      return (
        <Game
          game={this.props.game}
          isFullScreen={this.props.isFullScreen}
          isMuted={this.state.isMuted}
          timeGameLoaded={this.props.timeGameLoaded}
          timeNavigatedToGame={this.props.timeNavigatedToGame}
          navigateToUserProfile={this.props.navigateToUserProfile}
          navigateToEditPost={this.props.navigateToEditPost}
          navigateToGameUrl={this.props.navigateToGameUrl}
          navigateToGame={this.props.navigateToGame}
          navigateToHome={this.props.navigateToHome}
          onGameDismiss={this.props.clearCurrentGame}
          onGameMaximize={this._handleFullScreen}
          onGameMinimize={this.props.minimizeGame}
          onToggleMute={this._toggleIsMuted}
          onCreatePost={this.props.navigateToEditPost}
          onReload={this.props.reloadGame}
          onViewSource={() => {}}
          refreshCurrentUser={this.props.refreshCurrentUser}
        />
      );
    }

    let actionsBarElement, topBarElement;
    if (!this.props.isFullScreen) {
      actionsBarElement = (
        <GameActionsBar
          game={this.props.game}
          timeGameLoaded={this.props.timeGameLoaded}
          navigateToUserProfile={this.props.navigateToUserProfile}
          minimizeGame={this.props.minimizeGame}
          clearCurrentGame={this.props.clearCurrentGame}
          onFullScreenToggle={this._handleFullScreen}
          reloadGame={this.props.reloadGame}
          onUpdateGameWindowFrame={this.updateGameWindowFrame}
          isMuted={this.state.isMuted}
          onToggleMute={this._toggleIsMuted}
        />
      );
    }

    let maybeLoadingAnimation, maybeLoadingOverlay;
    if (!this.state.loaded) {
      maybeLoadingAnimation = <GLLoaderScreen />;

      const { luaNetworkRequests, loadingPhase } = this.state;
      maybeLoadingOverlay = (
        <div className={STYLES_LOADING_OVERLAY_CONTAINER}>
          {luaNetworkRequests.length > 0 ? (
            luaNetworkRequests.map(({ url }) => (
              <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Fetching {url}...</div>
            ))
          ) : loadingPhase === 'initializing' ? (
            <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Initializing system...</div>
          ) : (
            <div className={STYLES_LOADING_OVERLAY_ELEMENT}>Starting game...</div>
          )}
        </div>
      );
    }

    let maybeChatSidebar;
    if (!this.props.isFullScreen) {
      maybeChatSidebar = <ChatSidebar game={this.props.game} />;
    }

    return (
      <SplitterLayout
        customClassName={STYLES_CONTAINER}
        vertical={false}
        percentage={false}
        primaryIndex={1}
        secondaryInitialSize={248}
        secondaryMinSize={248}
        onSecondaryPaneSizeChange={this.updateGameWindowFrame}>
        {maybeChatSidebar}
        <div className={STYLES_GAME_AND_TOOLS_CONTAINER}>
          <Tools
            ref={(ref) => (this._toolsReference = ref)}
            game={this.props.game}
            onLayoutChange={this.updateGameWindowFrame}>
            <div
              className={STYLES_GAME_CONTAINER}
              ref={(ref) => {
                this._gameContainerReference = ref;
                this.updateGameWindowFrame();
              }}>
              {maybeLoadingAnimation}
              {maybeLoadingOverlay}
            </div>
          </Tools>
          {actionsBarElement}
        </div>
      </SplitterLayout>
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
                    navigateToHome={navigator.navigateToHome}
                    minimizeGame={navigator.minimizeGame}
                    isFullScreen={navigation.isFullScreen}
                    setIsFullScreen={navigator.setIsFullScreen}
                    reloadGame={navigator.reloadGame}
                    clearCurrentGame={navigator.clearCurrentGame}
                    isLoggedIn={currentUser.user !== null}
                    me={currentUser.user}
                    refreshCurrentUser={currentUser.refreshCurrentUser}
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
