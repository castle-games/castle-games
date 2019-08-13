import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIGameSet from '~/components/reusable/UIGameSet';
import UIPostList from '~/components/reusable/UIPostList';

const SCROLL_BOTTOM_OFFSET = 20;

const STYLES_HOME_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CONTENT_CONTAINER = css`
  margin-top: 16px;
  width: 100%;
`;

const STYLES_SUB_NAVIGATION_BAR = css`
  display: flex;
  flex-direction: row;
`;

const STYLES_SUB_NAVIGATION_ITEM = css`
  font-weight: 400;
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  padding: 4px 24px 16px 24px;
  color: #a0a0a0;

  cursor: pointer;
`;

const STYLES_REFRESH_BUTTON = css`
  color: black;
  border: 1px solid black;
  border-radius: 3px;
  margin: 0px 8px 16px 24px;
  padding: 4px 4px 0px 4px;

  cursor: pointer;
`;

const STYLES_REFRESH_BUTTON_ACTIVE = css`
  background: #c0c0c0;
`;

const STYLES_REFRESH_BUTTON_INACTIVE = css`
  color: #a0a0a0;
  border: 1px solid #a0a0a0;
  border-radius: 3px;
  margin: 0px 8px 16px 24px;
  padding: 4px 4px 0px 4px;
`;

const STYLES_SUB_NAVIGATION_ITEM_ACTIVE = css`
  color: black;
`;

const STYLES_GAMES_CONTAINER = css`
  margin-bottom: 16px;
`;

const STYLES_POSTS_CONTAINER = css`
  margin-bottom: 24px;
`;

const STYLES_ALL_GAMES_LOADING_INDICATOR = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl6};
  margin: 8px 0px 0px 24px;
`;

const STYLES_BOTTOM = css`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_SECTION_TITLE = css`
  font-weight: 400;
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  padding: 0px 24px 16px 24px;
`;

class GamesHomeScreen extends React.Component {
  static defaultProps = {
    posts: null,
    allGames: null,
    reloadPosts: () => {},
    loadMorePosts: () => {},
    loadAllGames: () => {},
    trendingGames: [],
  };

  state = {
    subNavMode: 'home',
    isLoadingPosts: true,
    isLoadingAllGames: true,
    isHoveringOnRefresh: false,
    isHoveringOnHome: false,
    isHoveringOnAllGames: false,
    refreshingHomepage: false,
  };

  async componentDidMount() {
    this._mounted = true;
    this._refreshHomepage();
    if (!this.props.allGames || this.props.allGames.length < 35) {
      // no games have been loaded yet, preload the first ~page
      this.props.loadAllGames(35);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.posts !== prevProps.posts && this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: false });
    }

    if (
      this.props.allGames &&
      this.props.allGames !== prevProps.allGames &&
      this.state.isLoadingAllGames &&
      this.props.allGames.length > 35
    ) {
      this.setState({ isLoadingAllGames: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _refreshHomepage = async () => {
    if (this.state.subNavMode !== 'home') {
      return;
    }

    this.setState({ refreshingHomepage: true });
    this.props.reloadPosts();
    await this.props.reloadTrendingGames();
    this.setState({ refreshingHomepage: false });
  };

  _changeSubNavMode = (newSubNavMode) => {
    if (newSubNavMode === 'allGames') {
      this.setState({ isLoadingAllGames: true });
      this.props.loadAllGames();
    }
    this.setState({ subNavMode: newSubNavMode });
  };

  _handleSetHoverOnRefresh = (shouldSetHovering) => {
    this.setState({ isHoveringOnRefresh: shouldSetHovering });
  };

  _handleSetHoverOnHome = (shouldSetHovering) => {
    this.setState({ isHoveringOnHome: shouldSetHovering });
  };

  _handleSetHoverOnAllGames = (shouldSetHovering) => {
    this.setState({ isHoveringOnAllGames: shouldSetHovering });
  };

  _handleScroll = (e) => {
    if (!this._mounted) return;

    // add 1000 so that as person scrolls at a reasonable browsing speed, things load before they get there
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop <=
      e.target.clientHeight + SCROLL_BOTTOM_OFFSET + 1000;
    if (isBottom && !this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: true }, this.props.loadMorePosts);
    }
  };

  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `home`, ...options });
  };

  _renderBottom = () => {
    let maybeLoading;
    if (this.state.subNavMode === 'home' && this.state.isLoadingPosts) {
      maybeLoading = <div>Loading...</div>;
    }
    return <div className={STYLES_BOTTOM}>{maybeLoading}</div>;
  };

  render() {
    const { posts } = this.props;
    let maybePostList;
    if (posts) {
      maybePostList = (
        <UIPostList
          posts={posts}
          navigator={this.props.navigator}
          onUserSelect={this.props.navigateToUserProfile}
          onGameSelect={this._navigateToGame}
        />
      );
    }
    return (
      <div className={STYLES_HOME_CONTAINER} onScroll={this._handleScroll}>
        <div className={STYLES_CONTENT_CONTAINER}>
          <div className={STYLES_SUB_NAVIGATION_BAR}>
            <div
              className={
                this.state.isHoveringOnRefresh && this.state.subNavMode === 'home'
                  ? `${STYLES_REFRESH_BUTTON} ${STYLES_REFRESH_BUTTON_ACTIVE}`
                  : this.state.subNavMode === 'home'
                  ? STYLES_REFRESH_BUTTON
                  : STYLES_REFRESH_BUTTON_INACTIVE
              }
              onMouseEnter={() => this._handleSetHoverOnRefresh(true)}
              onMouseLeave={() => this._handleSetHoverOnRefresh(false)}
              onClick={() => this._refreshHomepage()}>
              {this.state.refreshingHomepage ? (
                <SVG.Ellipsis size={'24px'} />
              ) : (
                <SVG.Refresh size={'24px'} />
              )}
            </div>
            <div
              className={
                this.state.isHoveringOnHome || this.state.subNavMode === 'home'
                  ? `${STYLES_SUB_NAVIGATION_ITEM} ${STYLES_SUB_NAVIGATION_ITEM_ACTIVE}`
                  : STYLES_SUB_NAVIGATION_ITEM
              }
              onMouseEnter={() => this._handleSetHoverOnHome(true)}
              onMouseLeave={() => this._handleSetHoverOnHome(false)}
              onClick={() => this._changeSubNavMode('home')}>
              Home
            </div>
            <div
              className={
                this.state.isHoveringOnAllGames || this.state.subNavMode === 'allGames'
                  ? `${STYLES_SUB_NAVIGATION_ITEM} ${STYLES_SUB_NAVIGATION_ITEM_ACTIVE}`
                  : STYLES_SUB_NAVIGATION_ITEM
              }
              onMouseEnter={() => this._handleSetHoverOnAllGames(true)}
              onMouseLeave={() => this._handleSetHoverOnAllGames(false)}
              onClick={() => this._changeSubNavMode('allGames')}>
              All Games
            </div>
          </div>
          <div className={STYLES_GAMES_CONTAINER}>
            {this.state.subNavMode === 'home' ||
            (this.state.subNavMode === 'allGames' && this.props.allGames) ? (
              <UIGameSet
                title=""
                numRowsToElide={this.state.subNavMode === 'home' ? 3 : -1}
                viewer={this.props.viewer}
                gameItems={
                  this.state.subNavMode === 'home' ? this.props.trendingGames : this.props.allGames
                }
                onUserSelect={this.props.navigateToUserProfile}
                onGameSelect={this._navigateToGame}
                onSignInSelect={this.props.navigateToSignIn}
              />
            ) : null}
            {this.state.subNavMode == 'allGames' && this.state.isLoadingAllGames ? (
              <div className={STYLES_ALL_GAMES_LOADING_INDICATOR}>Loading games...</div>
            ) : null}
          </div>
          {this.state.subNavMode === 'home' ? (
            <div className={STYLES_POSTS_CONTAINER}>
              <div className={STYLES_SECTION_TITLE}>What people are up to...</div>
              {maybePostList}
            </div>
          ) : null}
        </div>
        {this._renderBottom()}
      </div>
    );
  }
}

export default class GamesHomeScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <GamesHomeScreen
                viewer={currentUser ? currentUser.user : null}
                navigateToUserProfile={navigator.navigateToUserProfile}
                navigateToGame={navigator.navigateToGame}
                navigateToSignIn={navigator.navigateToSignIn}
                posts={currentUser.content.posts}
                allGames={currentUser.content.allGames}
                loadAllGames={currentUser.loadAllGames}
                trendingGames={currentUser.content.trendingGames}
                reloadTrendingGames={currentUser.reloadTrendingGames}
                reloadPosts={currentUser.reloadPosts}
                loadMorePosts={currentUser.loadMorePosts}
                navigator={navigator}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
