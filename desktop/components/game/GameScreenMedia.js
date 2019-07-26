import * as React from 'react';
import * as Utilities from '~/common/utilities';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import GameWindow from '~/native/gamewindow';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: #000000;
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

export default class GameScreenMedia extends React.Component {
  static defualtProps = {
    game: null,
    timeGameLoaded: 0,
    navigateToUserProfile: null,
    navigateToEditPost: null,
    navigateToGameUrl: null,
    navigateToGame: null,
    refreshCurrentUser: null,
  };

  state = {
    isMuted: false,
    loaded: true,
    luaNetworkRequests: [],
    loadingPhase: 'initializing',
  };

  constructor(props) {
    super(props);
    this.update();

    if (Utilities.isWindows()) {
      window.addEventListener('resize', this.update);
    }
  }

  componentDidMount() {
    this.update();
    window.addEventListener('CASTLE_GAME_LOADED', this._handleGameLoaded);
    window.addEventListener('GHOST_NETWORK_REQUEST', this._handleLuaNetworkRequest);
  }

  componentWillUnmount() {
    GameWindow.setVisible(false);
    window.removeEventListener('resize', this.update);
    window.removeEventListener('CASTLE_GAME_LOADED', this._handleGameLoaded);
    window.removeEventListener('GHOST_NETWORK_REQUEST', this._handleLuaNetworkRequest);
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateWithProps(prevProps, prevState);
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

  updateWithProps = async (prevProps, prevState) => {
    let newUrl = Utilities.getLuaEntryPoint(this.props.game);
    let oldUrl = prevProps ? Utilities.getLuaEntryPoint(prevProps.game) : null;

    if (!newUrl) {
      // just close old game
      await this.close();
    } else if (!oldUrl && this.props.timeNavigatedToGame !== this.props.timeGameLoaded) {
      // resume previously-loaded game
      // by calling this.update() later.
    } else if (newUrl !== oldUrl) {
      // close game and open new
      await this.close();
      await this.open(newUrl, this.props.game);
    } else if (newUrl === oldUrl && this.props.timeGameLoaded !== prevProps.timeGameLoaded) {
      // reload
      await this.close();
      await this.open(oldUrl, prevProps.game);
    }

    this.update();
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
      return;
    }

    if (type == 'stop') {
      await Actions.delay(60);
      this.setState(({ luaNetworkRequests }) => ({
        luaNetworkRequests: luaNetworkRequests.filter((req) => req.id !== id),
      }));
      return;
    }
  };

  open = async () => {
    await new Promise((resolve) =>
      this.setState(
        { loaded: false, luaNetworkRequests: [], loadingPhase: 'initializing' },
        resolve
      )
    );

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
    if (this.props.refreshCurrentUser) {
      this.props.refreshCurrentUser();
    }
  };

  _game = null;

  get = () => {
    return this._game;
  };

  _setRef = (ref) => {
    this._game = ref;
    this.update();
  };

  close = async () => {
    await GameWindow.close();
  };

  update = () => {
    if (this._game) {
      const rect = this._game.getBoundingClientRect();

      GameWindow.updateFrame(rect);
      if (this.state.loaded) {
        GameWindow.setVisible(true);
      }
    }
  };

  _handleGameLoaded = () => {
    GameWindow.setVisible(true);
    this.setState({ loaded: true });
  };

  render() {
    return <div ref={this._setRef} className={STYLES_CONTAINER} />;
  }
}
