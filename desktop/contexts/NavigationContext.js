import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Analytics from '~/common/analytics';
import * as Browser from '~/common/browser';
import * as ExecNode from '~/common/execnode';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';
import { SocialContext } from '~/contexts/SocialContext';

import GameWindow from '~/native/gamewindow';
import Logs from '~/common/logs';

/**
 *  NavigationContext is the state of where the app is currently navigated,
 *  i.e. what is being shown to the user right now.
 *
 *  This is the "read" side of NavigatorContext, so methods in NavigatorContext
 *  should have an effect on values here.
 */
const NavigationContextDefaults = {
  contentMode: 'home', // chat | game | profile | home | signin | notifications | create | edit_post
  timeLastNavigated: 0,
  gameUrl: '',
  game: null,
  post: null,
  gameParams: null,
  referrerGame: null,
  timeGameLoaded: 0,
  userProfileShown: null,
  isFullScreen: false,
  options: {},
  deferredNavigationState: null, // used when restoring navigation state after login
};

// NOTE(jim): Easy way to enforce signed in routes.
const AUTHENTICATED_ONLY_MODES = {
  chat: true,
  edit_post: true,
  create: true,
  notifications: true,
  history: true,
  posts: false,
  examples: false,
  game: false,
  profile: false,
  home: false,
  signin: false,
};

/**
 *  NavigatorContext contains methods for changing the navigation state of the app.
 *  this is the "write" side of NavigationContext, i.e. methods here should have
 *  an effect on the value of NavigationContext.
 *
 *  Navigator and Navigation are separate because some components only want to change
 *  the state but never read from it.
 */
const NavigatorContextDefaults = {
  openUrl: async (url) => {},
  navigateToChat: () => {},
  navigateToHome: () => {},
  navigateToGameUrl: async (url, options) => {},
  navigateToGame: async (game, options) => {},
  navigateToCurrentGame: () => {},
  navigateToSignIn: () => {},
  navigateToCurrentUserProfile: (options) => {},
  navigateToContentMode: (mode) => {},
  navigateToUserProfile: async (user) => {},
  navigateToNotifications: () => {},
  navigateToCreate: () => {},
  navigateToEditPost: () => {},
  reloadGame: (onlyIfVisible) => {},
  clearCurrentGame: async () => {},
  setIsFullScreen: (isFullScreen) => {},
};

const NavigatorContext = React.createContext(NavigatorContextDefaults);
const NavigationContext = React.createContext(NavigationContextDefaults);

class NavigationContextManager extends React.Component {
  _reloadDebounceTimeout;

  constructor(props) {
    super(props);
    this.state = {
      navigation: {
        ...NavigationContextDefaults,
        ...props.value.navigation,
      },
      navigator: {
        ...NavigatorContextDefaults,
        ...props.value.navigator,
        navigateToContentMode: this.navigateToContentMode,
        navigateToChat: this.navigateToChat,
        navigateToHome: this.navigateToHome,
        navigateToGameUrl: this.navigateToGameUrl,
        navigateToGame: this.navigateToGame,
        navigateToCurrentGame: this.navigateToCurrentGame,
        navigateToCurrentUserProfile: this.navigateToCurrentUserProfile,
        navigateToSignIn: this.navigateToSignIn,
        navigateToUserProfile: this.navigateToUserProfile,
        navigateToNotifications: this.navigateToNotifications,
        navigateToCreate: this.navigateToCreate,
        navigateToEditPost: this.navigateToEditPost,
        openUrl: this.openUrl,
        reloadGame: this.reloadGame,
        clearCurrentGame: this.clearCurrentGame,
        setIsFullScreen: this.setIsFullScreen,
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // user logged out
    if (prevProps.currentUser.user && !this.props.currentUser.user) {
      this.navigateToHome();
    }
    // user logged in
    if (!prevProps.currentUser.user && this.props.currentUser.user) {
      this._restoreDeferredState();
    }

    if (
      prevProps.currentUser.timeLastLoaded !== 0 &&
      prevProps.currentUser.timeLastLoaded !== this.props.currentUser.timeLastLoaded
    ) {
      // current user was refreshed
      const viewer = this.props.currentUser.user;
      if (viewer) {
        this.props.social.addUser(viewer);
        const userProfileShown = this.state.navigation.userProfileShown;
        if (userProfileShown && viewer.userId === userProfileShown.userId) {
          this.setState({
            navigation: {
              ...this.state.navigation,
              userProfileShown: viewer,
            },
          });
        }
      }
    }
  }

  // load game
  _loadGameAsync = async (
    game,
    { post = null, gameParams = null, referrerGame = null, launchSource = null } = {}
  ) => {
    let { url } = game;
    if (Strings.isEmpty(url)) {
      return;
    }

    // track game launches
    Analytics.trackGameLaunch({ game, launchSource });
    // navigate to the game
    const time = Date.now();
    this._navigateToContentMode('game', {
      game,
      gameUrl: url,
      timeGameLoaded: time,
      timeLastNavigated: time,
      post,
      gameParams,
      referrerGame,
    });
  };

  // navigator actions
  _navigateToContentMode = (mode, navigationParams) => {
    // NOTE(jim): Added this prevent the possibilty of an exception
    // throwing in an unforseen failure case.
    try {
      Analytics.trackNavigation({
        prevContentMode: this.state.navigation.contentMode,
        nextContentMode: mode,
      });
    } catch (e) {}

    if (!this.props.currentUser.user) {
      // NOTE(jim): All routes will be blocked unless a user is signed in.
      // can condition on AUTHENTICATED_ONLY_MODES if we want to only disallow certain routes.
      navigationParams = navigationParams || {};
      const originalParams = Object.assign({}, navigationParams);
      navigationParams = {
        deferredNavigationState: {
          mode,
          params: originalParams,
        },
      };
      mode = 'signin';
    }

    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: mode,
        userProfileShown: null,
        timeLastNavigated: Date.now(),
        deferredNavigationState: null,
        ...navigationParams,
      },
    });
  };

  setIsFullScreen = (isFullScreen) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        isFullScreen,
      },
    });
  };

  navigateToChat = () => this._navigateToContentMode('chat');

  navigateToHome = () => this._navigateToContentMode('home');

  navigateToContentMode = (mode) => this._navigateToContentMode(mode);

  navigateToSignIn = () => this._navigateToContentMode('signin');

  navigateToNotifications = () => this._navigateToContentMode('notifications');

  navigateToCreate = () => this._navigateToContentMode('create');

  navigateToEditPost = (params) => this._navigateToContentMode('edit_post', { params });

  navigateToCurrentGame = () => {
    if (!this.state.navigation.game) {
      throw new Error(`Cannot navigate to current game because there is no current game.`);
    }
    if (this.state.navigation.contentMode === 'edit_post') {
      this.state.navigation.params.onCancel();
    }
    this._navigateToContentMode('game');
  };

  navigateToGameUrl = async (gameUrl, options) => {
    gameUrl = gameUrl.replace('castle://', 'http://');
    let game;
    try {
      game = await Browser.resolveGameAtUrlAsync(gameUrl, {
        upload: this.props.development.isMultiplayerCodeUploadEnabled,
      });
    } catch (e) {
      // forward this error to the user
      Logs.error(e.message);
    }

    if (game && game.url) {
      this._loadGameAsync(game, options);
    } else {
      Logs.error(`There was a problem opening the game at this url: ${gameUrl}`);
      this.navigateToHome();
    }
  };

  navigateToGame = (game, options) => {
    if (!game || Strings.isEmpty(game.url)) {
      return;
    }
    if (game.gameId) {
      // this is a known game object, not an abstract url request
      this._loadGameAsync(game, options);
    } else {
      // this is an incomplete game object, so try to resolve it before loading
      this.navigateToGameUrl(game.url, options);
    }
  };

  navigateToCurrentUserProfile = (options) => {
    if (this.props.currentUser.user) {
      this.navigateToUserProfile(this.props.currentUser.user, options);
      this.props.currentUser.refreshCurrentUser();
    } else {
      // show sign in
      this._navigateToContentMode('signin');
    }
  };

  navigateToUserProfile = async (user, options) => {
    let fullUser = this.props.social.userIdToUser[user.userId];
    if (!fullUser) {
      try {
        fullUser = await Actions.getUser({ userId: user.userId });
        this.props.social.addUser(fullUser);
      } catch (e) {
        // fall back to whatever we were given
        fullUser = user;
      }
    } else {
      // async refresh this user but don't block
      (async () => {
        try {
          const updatedUser = await Actions.getUser({ userId: user.userId });
          this.props.social.addUser(updatedUser);
          this.setState((state) => {
            if (
              state.navigation.userProfileShown &&
              state.navigation.userProfileShown.userId == updatedUser.userId
            ) {
              // we're still viewing this profile, so add the refreshed profile data to
              // the navigation state.
              return {
                ...state,
                navigation: {
                  ...state.navigation,
                  userProfileShown: updatedUser,
                },
              };
            }
            return state;
          });
        } catch (_) {}
      })();
    }
    this._navigateToContentMode('profile', { userProfileShown: fullUser, options });
  };

  reloadGame = (onlyIfVisible) => {
    if (onlyIfVisible && this.state.navigation.contentMode !== 'game') {
      // not currently viewing the game and `onlyIfVisible` was set,
      // so ignore this
      return;
    }
    if (this._reloadDebounceTimeout) {
      clearTimeout(this._reloadDebounceTimeout);
    }
    this._reloadDebounceTimout = setTimeout(() => {
      this.navigateToGameUrl(this.state.navigation.game.url);
      this._reloadDebounceTimeout = null;
    }, 50);
  };

  clearCurrentGame = async () => {
    await GameWindow.close();
    this.setState((state) => {
      const time = Date.now();
      const oldContentMode = state.navigation.contentMode;
      const newContentMode =
        oldContentMode === 'game' || oldContentMode === 'edit_post' ? 'home' : oldContentMode;
      // navigate away from the game
      Analytics.trackNavigation({
        prevContentMode: oldContentMode,
        nextContentMode: newContentMode,
      });
      // track the fact that a game was ended
      Analytics.trackGameEnd({ game: state.navigation.game });
      return {
        ...state,
        navigation: {
          ...state.navigation,
          contentMode: newContentMode,
          game: NavigationContextDefaults.game,
          post: NavigationContextDefaults.post,
          gameParams: NavigationContextDefaults.gameParams,
          referrerGame: NavigationContextDefaults.referrerGame,
          gameUrl: NavigationContextDefaults.gameUrl,
          timeGameLoaded: time,
          timeLastNavigated: time,
        },
      };
    });
  };

  /**
   *  Generic url handler.
   *  If this is a url to a Castle game or a Castle post, opens the url inside Castle.
   *  Otherwise, routes the url to the machine's browser.
   *
   *  If options.allowCastleContentType == true, requests the url even if it doesn't
   *  look like a Castle url, and opens it as a game if it responds with a valid Castle
   *  content type. This is slower because we have to fetch the url again.
   */
  openUrl = async (url, options) => {
    const { isUrl, isCastleUrl, type, postId } = Urls.getCastleUrlInfo(url);
    let handled = false;
    if (isCastleUrl) {
      if (type === 'game') {
        handled = true;
        this.navigateToGameUrl(url, options);
      } else if (type === 'post') {
        handled = true;
        const post = await Actions.getPostById(postId);
        this._loadGameAsync(post.sourceGame, { post });
      }
    } else if (isUrl && options.allowCastleContentType) {
      const isCastleContentType = await Urls.doesUrlRespondWithCastleContentType(url);
      if (isCastleContentType) {
        handled = true;
        this.navigateToGameUrl(url, options);
      }
    }
    if (!handled) {
      // fall back to launching external browser
      NativeUtil.openExternalURL(url);
    }
  };

  _restoreDeferredState = () => {
    if (this.state.navigation.deferredNavigationState) {
      const { mode, params } = this.state.navigation.deferredNavigationState;
      if (params.gameUrl) {
        // re-resolve the game in case anything changed since they last tried to load it.
        this.navigateToGameUrl(params.gameUrl);
      } else {
        this._navigateToContentMode(mode, params);
      }
    } else {
      this.navigateToHome();
    }
  };

  render() {
    return (
      <NavigatorContext.Provider value={this.state.navigator}>
        <NavigationContext.Provider value={this.state.navigation}>
          {this.props.children}
        </NavigationContext.Provider>
      </NavigatorContext.Provider>
    );
  }
}

class NavigationContextProvider extends React.Component {
  render() {
    return (
      <SocialContext.Consumer>
        {(social) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <DevelopmentContext.Consumer>
                {(development) => (
                  <NavigationContextManager
                    social={social}
                    currentUser={currentUser}
                    development={development}
                    {...this.props}
                  />
                )}
              </DevelopmentContext.Consumer>
            )}
          </CurrentUserContext.Consumer>
        )}
      </SocialContext.Consumer>
    );
  }
}

export { NavigatorContext, NavigationContext, NavigationContextProvider };
