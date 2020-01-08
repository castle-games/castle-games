import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Utilities from '~/common/utilities';

import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import CurrentUserCache from '~/common/current-user-cache';

const RELOAD_TRENDING_GAMES_INTERVAL_MS = 1000 * 30;

const EMPTY_CURRENT_USER = {
  user: null,
  settings: {
    notifications: null,
    isSidebarExpanded: true,
  },
  timeLastLoaded: 0,
  userStatusHistory: [],
  content: {
    posts: null,
    allGames: null,
    featuredExamples: [],
    trendingGames: null,
    trendingGamesLastUpdatedTime: null,
    multiplayerSessions: [],
  },
  appNotifications: [],
};

const CurrentUserContextDefaults = {
  ...EMPTY_CURRENT_USER,
  setCurrentUser: async (user) => {},
  clearCurrentUser: async () => {},
  refreshCurrentUser: async (options) => {},
  contentActions: {
    loadAllGames: async (limit) => {},
    loadFeaturedExamples: async () => {},
    reloadTrendingGames: async () => {},
    updateMultiplayerSessions: async () => {},
    reloadPosts: () => {},
    loadMorePosts: () => {},
  },
  loadAppNotifications: async () => {},
  appendAppNotification: (n) => {},
  setAppNotificationsStatus: (notificationIds, status) => {},
  toggleIsSidebarExpanded: () => {},
  setIsSidebarExpanded: (isExpanded) => {},
};

const CurrentUserContext = React.createContext(CurrentUserContextDefaults);

class CurrentUserContextManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...CurrentUserContextDefaults,
      ...props.value,
      setCurrentUser: this.setCurrentUser,
      clearCurrentUser: this.clearCurrentUser,
      refreshCurrentUser: this.refreshCurrentUser,
      contentActions: {
        reloadPosts: this.reloadPosts,
        loadMorePosts: this.loadMorePosts,
        loadAllGames: this.loadAllGames,
        loadFeaturedExamples: this.loadFeaturedExamples,
        reloadTrendingGames: this.reloadTrendingGames,
        updateMultiplayerSessions: this.updateMultiplayerSessions,
      },
      loadAppNotifications: this.loadAppNotifications,
      appendAppNotification: this.appendAppNotification,
      setAppNotificationsStatus: this.setAppNotificationsStatus,
      toggleIsSidebarExpanded: this.toggleIsSidebarExpanded,
      setIsSidebarExpanded: this.setIsSidebarExpanded,
    };

    if (props.value && props.value.user && !this.state.timeLastLoaded) {
      this.state.timeLastLoaded = Date.now();
    }
    this._loadInitialData();
  }

  setCurrentUser = async (user) => {
    await this.setState({
      user,
      timeLastLoaded: Date.now(),
    });
    this._cacheCurrentUser();
    if (
      !this.state.userStatusHistory ||
      !this.state.userStatusHistory.length ||
      !this.state.settings
    ) {
      this.refreshCurrentUser();
    }
  };

  clearCurrentUser = async () => {
    CurrentUserCache.clear();
    Actions.logout();
    this.setState({
      ...EMPTY_CURRENT_USER,
      timeLastLoaded: Date.now(), // used to determine if you've previously signed in
    });
  };

  refreshCurrentUser = async (options) => {
    options = options || {};
    if (options.onlyIfStale) {
      const { timeLastLoaded } = this.state;
      if (timeLastLoaded && Date.now() - timeLastLoaded < 30 * 1000) {
        return;
      }
    }
    try {
      const result = await Actions.getCurrentUser();
      if (result.error || result.errors || !result.user) {
        throw new Error(`Unable to fetch current user: ${JSON.stringify(result, null, 2)}`);
      }
      const { user, settings, userStatusHistory } = result;
      this.setState(
        {
          user,
          settings: {
            ...this.state.settings,
            ...settings,
          },
          userStatusHistory,
          timeLastLoaded: Date.now(),
        },
        () => {
          amplitude.getInstance().setUserId(user.userId);
          this._cacheCurrentUser();
        }
      );
    } catch (e) {
      // TODO: failure case
      console.warn(e);
    }
  };

  _loadPosts = async ({ pageAfterPostId } = {}) => {
    if (!this._loadingPosts) {
      this._loadingPosts = true;
      try {
        let posts = await Actions.allPostsAsync({ pageAfterPostId });
        // TODO(jason): keep track of largest postId somewhere before shuffling
        // so that fetching the next page fetches correct
        // shuffle posts per page to make things interesting
        //posts = Utilities.shuffle(posts);
        await this.setState((state) => {
          if (pageAfterPostId !== null && pageAfterPostId !== undefined) {
            let existingPosts = state.content.posts || [];
            posts = existingPosts.concat(posts);
          }
          return {
            ...state,
            content: {
              ...state.content,
              posts,
            },
          };
        });
      } finally {
        this._loadingPosts = false;
      }
    }
  };

  loadAllGames = async (limit) => {
    let allGames = await Actions.getAllGames(limit);
    if (allGames) {
      await this.setState((state) => {
        return {
          ...state,
          content: {
            ...state.content,
            allGames,
          },
        };
      });
    }
  };

  loadFeaturedExamples = async () => {
    let featuredExamples = await Actions.getFeaturedExamples();
    if (featuredExamples) {
      await this.setState((state) => {
        return {
          ...state,
          content: {
            ...state.content,
            featuredExamples,
          },
        };
      });
    }
  };

  reloadTrendingGames = async () => {
    if (
      this.state.content.trendingGames &&
      Date.now() - this.state.content.trendingGamesLastUpdatedTime <
        RELOAD_TRENDING_GAMES_INTERVAL_MS
    ) {
      return;
    }

    const trendingGames = await Actions.getTrendingGames();
    if (trendingGames) {
      await this.setState((state) => {
        return {
          ...state,
          content: {
            ...state.content,
            trendingGames,
            trendingGamesLastUpdatedTime: Date.now(),
          },
        };
      });
    }
  };

  updateMultiplayerSessions = async (multiplayerSessions) => {
    await this.setState((state) => {
      return {
        ...state,
        content: {
          ...state.content,
          multiplayerSessions,
        },
      };
    });
  };

  reloadPosts = () => {
    this._loadPosts();
  };

  loadMorePosts = () => {
    let lastPostId;
    const { posts } = this.state.content;
    if (posts && posts.length > 0) {
      lastPostId = posts[posts.length - 1].postId;
    }
    this._loadPosts({ pageAfterPostId: lastPostId });
  };

  loadAppNotifications = async () => {
    let notifications = [];
    try {
      notifications = await Actions.appNotificationsAsync();
    } catch (e) {}
    if (notifications && notifications.length) {
      let userIds = notifications.reduce(this._gatherObjectsFromNotification, {});
      let newUserIds = Object.keys(userIds);
      if (newUserIds.length) {
        let users;
        try {
          users = await Actions.getUsers({ userIds: newUserIds });
        } catch (_) {}
        this.props.userPresence.addUsers(users);
      }
    }
    this.setState({
      appNotifications: notifications,
    });
  };

  appendAppNotification = (n) => {
    this.setState((state) => {
      let isNotificationEdit = false;
      let newNotifications = state.appNotifications.map((existing) => {
        if (existing.appNotificationId === n.appNotificationId) {
          isNotificationEdit = true;
          return n;
        } else {
          return existing;
        }
      });
      if (!isNotificationEdit) {
        newNotifications = state.appNotifications.concat([n]);
      }
      return {
        ...state,
        appNotifications: newNotifications,
      };
    });
  };

  setAppNotificationsStatus = async (notificationIds, status) => {
    this.setState(
      (state) => {
        return {
          ...state,
          appNotifications: state.appNotifications.map((n) => {
            return {
              ...n,
              status: notificationIds.includes(n.appNotificationId) ? status : n.status,
            };
          }),
        };
      },
      () => Actions.setAppNotificationsStatusAsync(notificationIds, status)
    );
  };

  toggleIsSidebarExpanded = () => {
    this.setState((state) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          isSidebarExpanded: !state.settings.isSidebarExpanded,
        },
      };
    }, this._cacheCurrentUser);
  };

  setIsSidebarExpanded = (isExpanded) => {
    this.setState((state) => {
      return {
        ...state,
        settings: {
          ...state.settings,
          isSidebarExpanded: isExpanded,
        },
      };
    }, this._cacheCurrentUser);
  };

  _gatherObjectsFromNotification = (userIds, n) => {
    userIds = userIds || {};
    const maybeAddUserId = (userId) => {
      if (userId && !this.props.userPresence.userIdToUser[userId]) {
        userIds[userId] = true;
      }
    };

    maybeAddUserId(n.authorUserId);
    if (n.body && n.body.message) {
      n.body.message.forEach((component) => maybeAddUserId(component.userId));
    }

    return userIds;
  };

  _cacheCurrentUser = () => {
    let { user, appNotifications, settings, userStatusHistory, timeLastLoaded } = this.state;
    CurrentUserCache.set({
      user,
      appNotifications,
      settings,
      userStatusHistory,
      timeLastLoaded,
    });
  };

  _loadInitialData = async () => {
    this.loadAppNotifications();
    this.refreshCurrentUser({ onlyIfStale: true });
  };

  render() {
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    );
  }
}

class CurrentUserContextProvider extends React.Component {
  render() {
    return (
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <CurrentUserContextManager userPresence={userPresence} {...this.props} />
        )}
      </UserPresenceContext.Consumer>
    );
  }
}

export { CurrentUserContext, CurrentUserContextProvider };
