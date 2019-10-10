import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import HomeUpdateBanner from '~/components/HomeUpdateBanner';
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
  margin-top: 24px;
  width: 100%;
`;

const STYLES_GAMES_CONTAINER = css`
  margin-bottom: 16px;
`;

const STYLES_MULTIPLAYER_SESSIONS_CONTAINER = css`
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
    multiplayerSessions: [],
    mode: 'home',
    updateAvailable: null,
  };

  state = {
    isLoadingPosts: true,
    isLoadingAllGames: true,
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

    const prevMode = prevProps.mode;
    if (this.props.mode !== prevMode) {
      if (this.props.mode === 'allGames') {
        this.setState({ isLoadingAllGames: true });
      }
      this._refreshHomepage();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _refreshHomepage = async () => {
    this.setState({ refreshingHomepage: true });

    if (this.props.mode === 'home') {
      this.props.reloadPosts();
      await this.props.reloadTrendingGames();
    } else if (this.props.mode === 'allGames') {
      await this.props.loadAllGames();
    }

    this.setState({ refreshingHomepage: false });
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

  _navigateToGameMeta = (game, options) => {
    return this.props.navigateToGameMeta(game, { launchSource: `home`, ...options });
  };

  _renderUpdateBanner = () => {
    return this.props.updateAvailable ? (
      <HomeUpdateBanner
        updateAvailable={this.props.updateAvailable}
        onNativeUpdateInstall={this.props.onNativeUpdateInstall}
      />
    ) : null;
  };

  _renderBottom = () => {
    let maybeLoading;
    if (this.props.mode === 'home' && this.state.isLoadingPosts) {
      maybeLoading = <div>Loading...</div>;
    }
    return <div className={STYLES_BOTTOM}>{maybeLoading}</div>;
  };

  render() {
    const { posts, multiplayerSessions } = this.props;
    const multiplayerGames = multiplayerSessions
      ? multiplayerSessions.map((session) => session.game)
      : null;
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
    let title = this.props.mode === 'home' ? 'Games' : 'All Games';
    return (
      <div className={STYLES_HOME_CONTAINER} onScroll={this._handleScroll}>
        {this._renderUpdateBanner()}
        <div className={STYLES_CONTENT_CONTAINER}>
          {multiplayerGames && multiplayerGames.length > 0 ? (
            <div className={STYLES_MULTIPLAYER_SESSIONS_CONTAINER}>
              <div className={STYLES_SECTION_TITLE}>Active Multiplayer Game Sessions</div>
              <UIGameSet
                title=""
                numRowsToElide={-1}
                viewer={this.props.viewer}
                gameItems={multiplayerGames}
                onUserSelect={this.props.navigateToUserProfile}
                onGameSelect={this._navigateToGame}
                onSignInSelect={this.props.navigateToSignIn}
              />
            </div>
          ) : null}
          <div className={STYLES_SECTION_TITLE}>{title}</div>
          <div className={STYLES_GAMES_CONTAINER}>
            {this.props.mode === 'home' ||
            (this.props.mode === 'allGames' && this.props.allGames) ? (
              <UIGameSet
                numRowsToElide={this.props.mode === 'home' ? 3 : -1}
                viewer={this.props.viewer}
                gameItems={
                  this.props.mode === 'home' ? this.props.trendingGames : this.props.allGames
                }
                onUserSelect={this.props.navigateToUserProfile}
                onGameSelect={this._navigateToGameMeta}
                onSignInSelect={this.props.navigateToSignIn}
              />
            ) : null}
            {this.props.mode == 'allGames' && this.state.isLoadingAllGames ? (
              <div className={STYLES_ALL_GAMES_LOADING_INDICATOR}>Loading games...</div>
            ) : null}
          </div>
          {this.props.mode === 'home' ? (
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
                navigateToGameMeta={navigator.navigateToGameMeta}
                navigateToSignIn={navigator.navigateToSignIn}
                posts={currentUser.content.posts}
                allGames={currentUser.content.allGames}
                loadAllGames={currentUser.loadAllGames}
                trendingGames={currentUser.content.trendingGames}
                reloadTrendingGames={currentUser.reloadTrendingGames}
                multiplayerSessions={currentUser.content.multiplayerSessions}
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
