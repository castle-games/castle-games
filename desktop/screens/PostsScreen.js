import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIButton from '~/components/reusable/UIButton';
import UIPostList from '~/components/reusable/UIPostList';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 64px;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

class PostsScreen extends React.Component {
  state = {
    posts: null,
    firstPage: false,
  };

  _loadingPosts = false;

  componentDidMount() {
    this._loadPostsAsync();
  }

  _loadPostsAsync = async ({ pageAfterPostId } = {}) => {
    if (!this._loadingPosts) {
      this._loadingPosts = true;
      try {
        this.setState({
          posts: await Actions.allPostsAsync({ pageAfterPostId }),
          firstPage: pageAfterPostId === null || pageAfterPostId === undefined,
        });
      } finally {
        this._loadingPosts = false;
      }
    }
  };

  _handleFirstPage = () => {
    this.setState({ posts: null });
    this._loadPostsAsync();
  };

  _handleNextPage = () => {
    let lastPostId;
    if (this.state.posts.length > 0) {
      lastPostId = this.state.posts[this.state.posts.length - 1].postId;
    }
    this.setState({ posts: null });
    this._loadPostsAsync({
      pageAfterPostId: lastPostId,
    });
  };

  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `posts`, ...options });
  };

  _renderLoading = () => {
    return (
      <div className={STYLES_CONTAINER}>
        <div>Loading...</div>
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    if (posts) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIButton onClick={this._handleFirstPage}>
            {this.state.firstPage ? 'Refresh' : '◄ First page'}
          </UIButton>
          <UIPostList
            posts={posts}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
          />
          <UIButton onClick={this._handleNextPage}>Next page ►</UIButton>
        </div>
      );
    } else {
      return this._renderLoading();
    }
  }
}

export default class PostsScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <PostsScreen
            navigateToUserProfile={navigator.navigateToUserProfile}
            navigateToGame={navigator.navigateToGame}
            {...this.props}
          />
        )}
      </NavigatorContext.Consumer>
    );
  }
}
