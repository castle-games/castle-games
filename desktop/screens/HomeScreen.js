import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import HomeUpdateBanner from '~/components/HomeUpdateBanner';
import UIGameSet from '~/components/reusable/UIGameSet';
import UIPostList from '~/components/reusable/UIPostList';

const SCROLL_BOTTOM_OFFSET = 200;

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

const STYLES_ERROR_CONTAINER = css`
  margin-bottom: 16px;

  p {
    padding: 0 24px 16px 24px;
  }
`;

const STYLES_ERROR_LINK = css`
  text-decoration: underline;
  cursor: pointer;
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

const STYLES_LOADING_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20%;
  font-family: ${Constants.font.heading};
  color: ${Constants.REFACTOR_COLORS.subdued};
  font-size: ${Constants.typescale.lvl5};
  line-height: ${Constants.linescale.lvl5};
`;

class HomeScreen extends React.Component {
  static defaultProps = {
    content: {
      posts: null,
      allGames: null,
      trendingGames: [],
      multiplayerSessions: [],
    },
    updateAvailable: null,
  };

  state = {
    isLoadingPosts: false,
    isReloading: false,
    loadingError: null,
  };

  async componentDidMount() {
    this._mounted = true;
    this._reload();
    this._preloadMoreContent();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.content.posts !== prevProps.content.posts && this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _reload = async () => {
    if (!this.state.isReloading) {
      await this.setState({ isReloading: true, isLoadingPosts: true, loadingError: null });
      let loadingError = null;
      try {
        await this.props.contentActions.reloadPosts();
        await this.props.contentActions.reloadTrendingGames();
      } catch (e) {
        loadingError = e;
      }
      this._mounted && this.setState({ isReloading: false, isLoadingPosts: false, loadingError });
    }
  };

  _preloadMoreContent = () => {
    if (!this.props.content.allGames || this.props.content.allGames.length < 35) {
      // no games have been loaded yet, preload the first ~page
      try {
        this.props.contentActions.loadAllGames(35);
      } catch (_) {}
    }
    if (!this.props.content.featuredExamples || !this.props.content.featuredExamples.length) {
      try {
        this.props.contentActions.loadFeaturedExamples();
      } catch (_) {}
    }
  };

  _handleScroll = (e) => {
    if (!this._mounted) return;

    const isBottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + SCROLL_BOTTOM_OFFSET;
    if (isBottom && this.props.content.posts.length > 0 && !this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: true }, async () => {
        try {
          this.props.contentActions.loadMorePosts();
        } catch (_) {
          this._mounted && this.setState({ isLoadingPosts: false });
        }
      });
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

  _renderGamesSection = () => {
    const { trendingGames, multiplayerSessions } = this.props.content;
    const multiplayerGames = multiplayerSessions
      ? multiplayerSessions.map((session) => session.game)
      : null;
    let gamesToShow = [];
    if (multiplayerGames && multiplayerGames.length > 0) {
      gamesToShow = gamesToShow.concat(multiplayerGames);
    }
    if (trendingGames && trendingGames.length) {
      gamesToShow = gamesToShow.concat(trendingGames);
    }
    if (gamesToShow.length) {
      return (
        <div className={STYLES_GAMES_CONTAINER}>
          <div className={STYLES_SECTION_TITLE}>Games</div>
          <UIGameSet
            numRowsToElide={3}
            gameItems={gamesToShow}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGameMeta}
            onGameSessionSelect={this._navigateToGame}
          />
        </div>
      );
    } else if (this.state.loadingError) {
      return (
        <div className={STYLES_ERROR_CONTAINER}>
          <div className={STYLES_SECTION_TITLE}>Welcome to Castle</div>
          <p>
            We had an issue loading the Castle home screen, which might mean you are disconnected
            from the internet.
          </p>
          <p>
            You can still{' '}
            <span className={STYLES_ERROR_LINK} onClick={this.props.navigateToCreate}>
              create games
            </span>{' '}
            while offline!
          </p>
        </div>
      );
    }
  };

  _renderPostsSection = () => {
    const { posts } = this.props.content;
    if (posts) {
      return (
        <div className={STYLES_POSTS_CONTAINER}>
          <div className={STYLES_SECTION_TITLE}>What people are up to...</div>
          <UIPostList
            posts={posts}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
          />
        </div>
      );
    }
    return null;
  };

  _renderBottom = () => {
    let maybeLoading;
    if (this.state.isLoadingPosts) {
      maybeLoading = <div>Loading...</div>;
    }
    return <div className={STYLES_BOTTOM}>{maybeLoading}</div>;
  };

  render() {
    if (
      this.state.isReloading &&
      (!this.props.content.trendingGames || !this.props.content.trendingGames.length)
    ) {
      // block screen on first load
      return <div className={STYLES_LOADING_CONTAINER}>Loading...</div>;
    }
    return (
      <div className={STYLES_HOME_CONTAINER} onScroll={this._handleScroll}>
        {this._renderUpdateBanner()}
        <div className={STYLES_CONTENT_CONTAINER}>
          {this._renderGamesSection()}
          {this._renderPostsSection()}
        </div>
        {this._renderBottom()}
      </div>
    );
  }
}

export default class HomeScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <HomeScreen
                navigateToUserProfile={navigator.navigateToUserProfile}
                navigateToGame={navigator.navigateToGame}
                navigateToGameMeta={navigator.navigateToGameMeta}
                navigateToCreate={navigator.navigateToCreate}
                content={currentUser.content}
                contentActions={currentUser.contentActions}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
