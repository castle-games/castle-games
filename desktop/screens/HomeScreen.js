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
    isLoadingPosts: true,
    refreshingHomepage: false,
  };

  async componentDidMount() {
    this._mounted = true;
    this._refreshHomepage();
    if (!this.props.content.allGames || this.props.content.allGames.length < 35) {
      // no games have been loaded yet, preload the first ~page
      this.props.contentActions.loadAllGames(35);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.content.posts !== prevProps.content.posts && this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _refreshHomepage = async () => {
    this.setState({ refreshingHomepage: true });
    this.props.contentActions.reloadPosts();
    await this.props.contentActions.reloadTrendingGames();
    this.setState({ refreshingHomepage: false });
  };

  _handleScroll = (e) => {
    if (!this._mounted) return;

    // add a buffer so that as person scrolls at a reasonable browsing speed, things load before they get there
    const isBottom =
      e.target.scrollHeight - e.target.scrollTop <=
      e.target.clientHeight + SCROLL_BOTTOM_OFFSET + Constants.card.imageHeight * 2;
    if (isBottom && !this.state.isLoadingPosts) {
      this.setState({ isLoadingPosts: true }, this.props.contentActions.loadMorePosts);
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
    if (this.state.isLoadingPosts) {
      maybeLoading = <div>Loading...</div>;
    }
    return <div className={STYLES_BOTTOM}>{maybeLoading}</div>;
  };

  render() {
    const { posts, multiplayerSessions } = this.props.content;
    const multiplayerGames = multiplayerSessions
      ? multiplayerSessions.map((session) => session.game)
      : null;
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
      <div className={STYLES_HOME_CONTAINER} onScroll={this._handleScroll}>
        {this._renderUpdateBanner()}
        <div className={STYLES_CONTENT_CONTAINER}>
          {multiplayerGames && multiplayerGames.length > 0 ? (
            <div className={STYLES_MULTIPLAYER_SESSIONS_CONTAINER}>
              <div className={STYLES_SECTION_TITLE}>Active Multiplayer Game Sessions</div>
              <UIGameSet
                title=""
                numRowsToElide={-1}
                gameItems={multiplayerGames}
                onUserSelect={this.props.navigateToUserProfile}
                onGameSelect={this._navigateToGame}
              />
            </div>
          ) : null}
          <div className={STYLES_SECTION_TITLE}>Games</div>
          <div className={STYLES_GAMES_CONTAINER}>
            <UIGameSet
              numRowsToElide={3}
              gameItems={this.props.content.trendingGames}
              onUserSelect={this.props.navigateToUserProfile}
              onGameSelect={this._navigateToGameMeta}
            />
          </div>
          <div className={STYLES_POSTS_CONTAINER}>
            <div className={STYLES_SECTION_TITLE}>What people are up to...</div>
            {maybePostList}
          </div>
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
