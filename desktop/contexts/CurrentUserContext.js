import * as React from 'react';
import * as Actions from '~/common/actions';

const CurrentUserContextDefaults = {
  user: null,
  timeLastLoaded: 0,
  userStatusHistory: [],
  setCurrentUser: (user) => {},
  clearCurrentUser: async () => {},
  refreshCurrentUser: async () => {},
  content: {
    posts: null,
  },
  reloadPosts: () => {},
  loadMorePosts: () => {},
};

const CurrentUserContext = React.createContext(CurrentUserContextDefaults);

class CurrentUserContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...CurrentUserContextDefaults,
      ...props.value,
      setCurrentUser: this.setCurrentUser,
      clearCurrentUser: this.clearCurrentUser,
      refreshCurrentUser: this.refreshCurrentUser,
      reloadPosts: this.reloadPosts,
      loadMorePosts: this.loadMorePosts,
    };

    if (props.value && props.value.user) {
      this.state.timeLastLoaded = Date.now();
    }
  }

  setCurrentUser = (user) => {
    this.setState({
      user,
      timeLastLoaded: Date.now(),
    });
  };

  clearCurrentUser = async () => {
    await Actions.logout();
    this.setState({
      user: null,
      timeLastLoaded: 0,
      userStatusHistory: [],
      content: CurrentUserContextDefaults.content,
    });
  };

  refreshCurrentUser = async () => {
    const viewer = await Actions.getViewer();
    if (!viewer) {
      return;
    }
    const userStatusHistory = await Actions.getUserStatusHistory(viewer.userId);

    this.setState({
      user: viewer,
      userStatusHistory,
      timeLastLoaded: Date.now(),
    });
  };

  _loadPosts = async ({ pageAfterPostId } = {}) => {
    if (!this._loadingPosts) {
      this._loadingPosts = true;
      try {
        let posts = await Actions.allPostsAsync({ pageAfterPostId });
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

  render() {
    return (
      <CurrentUserContext.Provider value={this.state}>
        {this.props.children}
      </CurrentUserContext.Provider>
    );
  }
}

export { CurrentUserContext, CurrentUserContextProvider };
