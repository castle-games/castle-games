import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIPostList from '~/components/reusable/UIPostList';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_BOTTOM = css`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class PostsScreen extends React.Component {
  static defaultProps = {
    posts: null,
    reloadPosts: () => {},
    loadMorePosts: () => {},
    navigateToGame: () => {},
    navigateToUserProfile: () => {},
  };
  state = {
    isLoading: true,
  };

  _pageBottomElement;

  componentDidMount() {
    this._mounted = true;
    this.props.reloadPosts();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.posts !== prevProps.posts && this.state.isLoading) {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _handleScroll = (e) => {
    if (!this._mounted) return;

    const isBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (isBottom && !this.state.isLoading) {
      this.setState({ isLoading: true }, this.props.loadMorePosts);
    }
  };

  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `posts`, ...options });
  };

  _renderBottom = () => {
    let maybeLoading;
    if (this.state.isLoading) {
      maybeLoading = <div>Loading...</div>;
    }
    return (
      <div ref={(r) => (this._pageBottomElement = r)} className={STYLES_BOTTOM}>
        {maybeLoading}
      </div>
    );
  };

  render() {
    const { posts } = this.props;
    let maybePostList;
    if (posts) {
      maybePostList = (
        <UIPostList
          posts={posts}
          onUserSelect={this.props.navigateToUserProfile}
          onGameSelect={this._navigateToGame}
        />
      );
    }
    return (
      <div className={STYLES_CONTAINER} onScroll={this._handleScroll}>
        {maybePostList}
        {this._renderBottom()}
      </div>
    );
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
