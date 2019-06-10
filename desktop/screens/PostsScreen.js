import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
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
  static defaultProps = {
    posts: null,
    reloadPosts: () => {},
    loadMorePosts: () => {},
    navigateToGame: () => {},
    navigateToUserProfile: () => {},
  };

  componentDidMount() {
    this.props.reloadPosts();
  }

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
    const { posts } = this.props;
    if (posts) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIButton onClick={this.props.reloadPosts}>Refresh</UIButton>
          <UIPostList
            posts={posts}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
          />
          <UIButton onClick={this.props.loadMorePosts}>Next page ►</UIButton>
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
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <PostsScreen
                navigateToUserProfile={navigator.navigateToUserProfile}
                navigateToGame={navigator.navigateToGame}
                posts={currentUser.content.posts}
                reloadPosts={currentUser.reloadPosts}
                loadMorePosts={currentUser.loadMorePosts}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
