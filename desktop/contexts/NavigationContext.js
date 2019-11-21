import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Analytics from '~/common/analytics';
import * as Browser from '~/common/browser';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as VoiceChat from '~/common/voicechat';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { DevelopmentContext, DevelopmentSetterContext } from '~/contexts/DevelopmentContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

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
  content: {
    mode: 'home', // game-meta | profile | home | browse | create | event | edit_post
    gameMetaShown: null,
    userProfileShown: null,
  },
  timeLastNavigated: 0,
  isShowingSignIn: false,
  playing: {
    gameUrl: '',
    game: null,
    sessionId: null,
    post: null,
    gameParams: null,
    referrerGame: null,
    timeLoaded: 0,
    isVisible: false,
    isFullScreen: false,
  },
  contentHistory: {
    stack: [],
    index: 0,
  },
  isChatExpanded: true,
  chatChannelId: null,
  voiceChannelId: null,
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
  openUrl: async (url, options) => {},
  showChatChannel: async (channelId, options) => {},
  connectToVoiceChannel: (channelId) => {},
  toggleIsChatExpanded: () => {},
  navigateToHome: () => {},
  navigateToGameUrl: async (url, options) => {},
  navigateToGame: async (game, options) => {},
  navigateToGameMeta: async (game) => {},
  navigateToCurrentGame: () => {},
  navigateToSignIn: () => {},
  navigateToCurrentUserProfile: () => {},
  navigateToContentMode: (mode) => {},
  navigateToUserProfile: async (user) => {},
  navigateToNotifications: () => {},
  navigateToCreate: () => {},
  navigateToEditPost: () => {},
  reloadGame: (onlyIfVisible) => {},
  softReloadGame: () => {},
  minimizeGame: () => {},
  clearCurrentGame: async () => {},
  setIsFullScreen: (isFullScreen) => {},
  setGameSessionId: (sessionId) => {},
  contentHistory: {
    isBackAvailable: () => false,
    isForwardAvailable: () => false,
    back: () => {},
    forward: () => {},
  },
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
        contentHistory: this._pushContentHistory(
          NavigationContextDefaults.contentHistory,
          NavigationContextDefaults.content
        ), // push initial history state
        ...props.value.navigation,
      },
      navigator: {
        ...NavigatorContextDefaults,
        ...props.value.navigator,
        navigateToContentMode: this.navigateToContentMode,
        showChatChannel: this.showChatChannel,
        connectToVoiceChannel: this.connectToVoiceChannel,
        toggleIsChatExpanded: this.toggleIsChatExpanded,
        navigateToHome: this.navigateToHome,
        navigateToGameUrl: this.navigateToGameUrl,
        navigateToGame: this.navigateToGame,
        navigateToGameMeta: this.navigateToGameMeta,
        navigateToCurrentGame: this.navigateToCurrentGame,
        navigateToCurrentUserProfile: this.navigateToCurrentUserProfile,
        navigateToSignIn: this.navigateToSignIn,
        navigateToUserProfile: this.navigateToUserProfile,
        navigateToNotifications: this.navigateToNotifications,
        navigateToCreate: this.navigateToCreate,
        navigateToEditPost: this.navigateToEditPost,
        openUrl: this.openUrl,
        reloadGame: this.reloadGame,
        softReloadGame: this.softReloadGame,
        minimizeGame: this.minimizeGame,
        clearCurrentGame: this.clearCurrentGame,
        setIsFullScreen: this.setIsFullScreen,
        setGameSessionId: this.setGameSessionId,
        contentHistory: {
          isBackAvailable: this.isBackAvailable,
          isForwardAvailable: this.isForwardAvailable,
          back: this.back,
          forward: this.forward,
        },
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
      this.setState((state) => {
        return {
          ...state,
          navigation: {
            ...state.navigation,
            isShowingSignIn: false,
          },
        };
      });
    }

    if (
      prevProps.currentUser.timeLastLoaded !== 0 &&
      prevProps.currentUser.timeLastLoaded !== this.props.currentUser.timeLastLoaded
    ) {
      // current user was refreshed
      const viewer = this.props.currentUser.user;
      if (viewer) {
        this.props.userPresence.addUser(viewer);
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

    // if we're navigating from one game to another, make sure to end the first game and properly record
    // the fact that it was closed (and also properly clear game-related properties like sessionId)
    if (this.state.navigation.playing.game !== NavigationContextDefaults.playing.game) {
      await this.clearCurrentGame();
    }

    const time = Date.now();
    const gameNavigationState = {
      game,
      gameUrl: url,
      isVisible: true,
      sessionId: game.sessionId,
      timeLoaded: time,
      post,
      gameParams,
      referrerGame,
      isFullScreen: false,
    };

    // track game launches
    Analytics.trackGameLaunch({ game, launchSource });

    // navigate to the game
    this.setState({
      navigation: {
        ...this.state.navigation,
        timeLastNavigated: time,
        playing: gameNavigationState,
        isShowingSignIn: !this.props.currentUser.user,
      },
    });
  };

  // navigator actions
  _navigateToContentMode = (mode, navigationParams) => {
    try {
      Analytics.trackNavigation({
        prevContentMode: this.state.navigation.content.mode,
        nextContentMode: mode,
      });
    } catch (e) {}

    this.setState((state) => {
      const newContent = {
        ...NavigationContextDefaults.content,
        mode,
        ...navigationParams,
      };
      return {
        ...state,
        navigation: {
          ...state.navigation,
          contentHistory: this._pushContentHistory(state.navigation.contentHistory, newContent),
          content: newContent,
          playing: {
            ...state.navigation.playing,
            isVisible: false,
          },
          timeLastNavigated: Date.now(),
          isShowingSignIn: !this.props.currentUser.user,
        },
      };
    });
  };

  setIsFullScreen = (isFullScreen) => {
    if (!this.state.navigation.playing.game) {
      // we aren't playing a game, this is a noop
      return;
    }
    this.setState({
      navigation: {
        ...this.state.navigation,
        playing: {
          ...this.state.navigation.playing,
          isFullScreen,
        },
      },
    });
  };

  setGameSessionId = (sessionId) => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        playing: {
          ...this.state.navigation.playing,
          sessionId,
        },
      },
    });
  };

  // assumes you have a channel id.
  // if not, use ChatContext.openChannel methods
  showChatChannel = async (channelId, options = {}) => {
    const autoExpand = options.autoExpand === undefined ? true : options.autoExpand;
    let chatChannelId = channelId || this.state.chatChannelId;
    return this.setState({
      navigation: {
        ...this.state.navigation,
        chatChannelId: channelId,
        isChatExpanded: autoExpand ? true : this.state.navigation.isChatExpanded,
      },
    });
  };

  connectToVoiceChannel = async (channelId) => {
    try {
      await this._connectToVoiceServerAsync(channelId);

      return this.setState({
        navigation: {
          ...this.state.navigation,
          voiceChannelId: channelId,
        },
      });
    } catch (e) {
      console.error('Error connecting to voice channel: ' + e);
      // TODO: show permission error
    }
  };

  navigateToGameMeta = async (game) => {
    // TODO: could cache rather than always fetching
    let fullGame;
    try {
      fullGame = await Actions.getGameByGameId(game.gameId);
    } catch (e) {
      // fall back to whatever we were given
      fullGame = game;
    }
    return this._navigateToContentMode('game-meta', {
      gameMetaShown: fullGame,
    });
  };

  toggleIsChatExpanded = () => {
    this.setState((state) => {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          isChatExpanded: !state.navigation.isChatExpanded,
        },
      };
    });
  };

  navigateToHome = () => this._navigateToContentMode('home');

  navigateToContentMode = (mode) => this._navigateToContentMode(mode);

  navigateToSignIn = () => {
    this.setState((state) => {
      return {
        ...state,
        navigation: {
          ...state.navigation,
          isShowingSignIn: true,
        },
      };
    });
  };

  navigateToNotifications = () => this._navigateToContentMode('notifications');

  navigateToCreate = () => this._navigateToContentMode('create');

  navigateToEditPost = (params) => this._navigateToContentMode('edit_post', { params });

  navigateToCurrentGame = () => {
    if (!this.state.navigation.playing.game) {
      throw new Error(`Cannot navigate to current game because there is no current game.`);
    }
    if (this.state.navigation.contentMode === 'edit_post' && this.state.navigation.content.params) {
      this.state.navigation.content.params.onCancel();
    }
    Analytics.trackGameMaximize();
    this.setState({
      navigation: {
        ...this.state.navigation,
        timeLastNavigated: Date.now(),
        playing: {
          ...this.state.navigation.playing,
          isVisible: true,
        },
      },
    });
  };

  minimizeGame = () => {
    if (this.state.navigation.playing.game) {
      Analytics.trackGameMinimize();
      // refresh the user's status history so we the current game properly appears in the recently played list
      this.props.currentUser.refreshCurrentUser();
      this.setState({
        navigation: {
          ...this.state.navigation,
          timeLastNavigated: Date.now(),
          playing: {
            ...this.state.navigation.playing,
            isVisible: false,
          },
        },
      });
    }
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

  navigateToCurrentUserProfile = () => {
    if (this.props.currentUser.user) {
      this.navigateToUserProfile(this.props.currentUser.user);
      this.props.currentUser.refreshCurrentUser();
    } else {
      this.navigateToSignIn();
    }
  };

  navigateToUserProfile = async (user) => {
    let fullUser = this.props.userPresence.userIdToUser[user.userId];
    if (!fullUser) {
      try {
        fullUser = await Actions.getUser({ userId: user.userId });
        this.props.userPresence.addUser(fullUser);
      } catch (e) {
        // fall back to whatever we were given
        fullUser = user;
      }
    } else {
      // async refresh this user but don't block
      (async () => {
        try {
          const updatedUser = await Actions.getUser({ userId: user.userId });
          this.props.userPresence.addUser(updatedUser);
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
    this._navigateToContentMode('profile', { userProfileShown: fullUser });
  };

  reloadGame = (onlyIfVisible) => {
    if (onlyIfVisible && !this.state.navigation.playing.isVisible) {
      // not currently viewing the game and `onlyIfVisible` was set,
      // so ignore this
      return;
    }
    if (this._reloadDebounceTimeout) {
      clearTimeout(this._reloadDebounceTimeout);
    }
    this._reloadDebounceTimout = setTimeout(() => {
      this.navigateToGameUrl(this.state.navigation.playing.game.url);
      this._reloadDebounceTimeout = null;
    }, 50);
  };

  softReloadGame = () => {
    this.setState({
      navigation: {
        ...this.state.navigation,
        playing: {
          ...this.state.navigation.playing,
          timeLoaded: Date.now(),
        },
      },
    });
  };

  clearCurrentGame = async () => {
    await GameWindow.close();
    this.setState((state, prevProps) => {
      const time = Date.now();
      const oldContentMode = state.navigation.content.mode;
      const newContentMode = oldContentMode === 'edit_post' ? 'home' : oldContentMode;
      // navigate away from the game
      Analytics.trackNavigation({
        prevContentMode: oldContentMode,
        nextContentMode: newContentMode,
      });
      // refresh the user's status history so we the current game properly appears in the recently played list
      prevProps.currentUser.refreshCurrentUser();
      // track the fact that a game was ended
      Analytics.trackGameEnd({ game: state.navigation.playing.game });
      this._connectToVoiceServerAsync(null);
      this.props.developmentSetter.clearEditableFiles();
      return {
        ...state,
        navigation: {
          ...state.navigation,
          content: {
            ...state.navigation.content,
            mode: newContentMode,
          },
          playing: {
            ...NavigationContextDefaults.playing,
            timeLoaded: time,
          },
          timeLastNavigated: time,
          voiceChannelId: null,
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

  isBackAvailable = () => {
    const { index, stack } = this.state.navigation.contentHistory;
    return index < stack.length - 1;
  };

  isForwardAvailable = () => {
    return this.state.navigation.contentHistory.index > 0;
  };

  back = () => {
    if (this.isBackAvailable()) {
      this.setState((state) => {
        const newIndex = state.navigation.contentHistory.index + 1;
        return {
          ...state,
          navigation: {
            ...state.navigation,
            contentHistory: {
              ...state.navigation.contentHistory,
              index: newIndex,
            },
            content: state.navigation.contentHistory.stack[newIndex],
          },
        };
      });
    }
  };

  forward = () => {
    if (this.isForwardAvailable()) {
      this.setState((state) => {
        const newIndex = state.navigation.contentHistory.index - 1;
        return {
          ...state,
          navigation: {
            ...state.navigation,
            contentHistory: {
              ...state.navigation.contentHistory,
              index: newIndex,
            },
            content: state.navigation.contentHistory.stack[newIndex],
          },
        };
      });
    }
  };

  _pushContentHistory = (contentHistory, newContent) => {
    let newHistory = {
      ...contentHistory,
    };
    if (newHistory.index > 0) {
      // drop the head
      newHistory.stack.splice(0, newHistory.index);
    }
    newHistory.stack.unshift({
      ...newContent,
    });
    if (newHistory.stack.length > 20) {
      // trim
      newHistory.stack.splice(20);
    }
    newHistory.index = 0;
    return newHistory;
  };

  _connectToVoiceServerAsync = async (channelId) => {
    if (channelId === this.state.navigation.voiceChannelId) {
      return;
    }

    if (channelId) {
      await VoiceChat.startVoiceChatAsync(channelId);
    } else {
      await VoiceChat.stopVoiceChatAsync();
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
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <DevelopmentContext.Consumer>
                {(development) => (
                  <DevelopmentSetterContext.Consumer>
                    {(developmentSetter) => (
                      <NavigationContextManager
                        userPresence={userPresence}
                        currentUser={currentUser}
                        development={development}
                        developmentSetter={developmentSetter}
                        {...this.props}
                      />
                    )}
                  </DevelopmentSetterContext.Consumer>
                )}
              </DevelopmentContext.Consumer>
            )}
          </CurrentUserContext.Consumer>
        )}
      </UserPresenceContext.Consumer>
    );
  }
}

export { NavigatorContext, NavigationContext, NavigationContextProvider };
