import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Browser from '~/common/browser';
import * as ExecNode from '~/common/execnode';
import * as Strings from '~/common/strings';
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
  contentMode: 'home', // game | profile | home | signin | notifications | create | edit_post
  timeLastNavigated: 0,
  gameUrl: '',
  game: null,
  timeGameLoaded: 0,
  userProfileShown: null,
  isFullScreen: false,
  options: {},
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
  navigateToHome: () => {},
  navigateToGameUrl: async (url) => {},
  navigateToGame: async (game) => {},
  navigateToCurrentGame: () => {},
  navigateToSignIn: () => {},
  navigateToCurrentUserProfile: (options) => {},
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
        reloadGame: this.reloadGame,
        clearCurrentGame: this.clearCurrentGame,
        setIsFullScreen: this.setIsFullScreen,
      },
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // NOTE(jim): Only on log out, navigate to home.
    if (prevProps.currentUser.user && !this.props.currentUser.user) {
      this.navigateToHome();
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
  _loadGameAsync = async (game) => {
    let { url } = game;
    if (Strings.isEmpty(url)) {
      return;
    }
    const time = Date.now();
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'game',
        game,
        gameUrl: url,
        timeGameLoaded: time,
        timeLastNavigated: time,
      },
    });
  };

  // navigator actions
  _navigateToContentMode = (mode) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: mode,
        userProfileShown: null,
        timeLastNavigated: Date.now(),
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

  navigateToHome = () => this._navigateToContentMode('home');

  navigateToSignIn = () => this._navigateToContentMode('signin');

  navigateToNotifications = () => this._navigateToContentMode('notifications');

  navigateToCreate = () => this._navigateToContentMode('create');

  navigateToEditPost = (params) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'edit_post',
        params,
      },
    });
  };

  navigateToCurrentGame = () => {
    if (!this.state.navigation.game) {
      throw new Error(`Cannot navigate to current game because there is no current game.`);
    }
    if (this.state.navigation.contentMode === 'edit_post') {
      this.state.navigation.params.onCancel();
    }
    this._navigateToContentMode('game');
  };

  navigateToGameUrl = async (gameUrl) => {
    gameUrl = gameUrl.replace('castle://', 'http://');
    let game;
    try {
      game = await Browser.resolveGameAtUrlAsync(gameUrl, {
        upload: this.props.development.isMultiplayerCodeUploadEnabled,
      });
    } catch (e) {
      // forward this error to the user
      Logs.error(e.message);
      return;
    }

    if (game && game.url) {
      this._loadGameAsync(game);
    } else {
      Logs.error(`There was a problem opening the game at this url: ${gameUrl}`);
    }
  };

  navigateToGame = (game) => {
    if (!game || Strings.isEmpty(game.url)) {
      return;
    }
    if (game.gameId) {
      // this is a known game object, not an abstract url request
      this._loadGameAsync(game);
    } else {
      // this is an incomplete game object, so try to resolve it before loading
      this.navigateToGameUrl(game.url);
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
        } catch (_) {}
      })();
    }
    this.setState({
      navigation: {
        ...this.state.navigation,
        contentMode: 'profile',
        userProfileShown: fullUser,
        timeLastNavigated: Date.now(),
        options,
      },
    });
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
      return {
        ...state,
        navigation: {
          ...state.navigation,
          contentMode: newContentMode,
          game: NavigationContextDefaults.game,
          gameUrl: NavigationContextDefaults.gameUrl,
          timeGameLoaded: time,
          timeLastNavigated: time,
        },
      };
    });
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
