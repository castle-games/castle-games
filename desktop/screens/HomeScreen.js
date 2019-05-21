import * as React from 'react';
import * as Constants from '~/common/constants';
import * as ExperimentalFeatures from '~/common/experimental-features';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIHorizontalNavigation from '~/components/reusable/UIHorizontalNavigation';
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

class HomeScreen extends React.Component {
  static defaultProps = {
    featuredGames: [],
    featuredExamples: [],
    history: [],
    refreshHistory: async () => {},
  };

  state = {
    mode: ExperimentalFeatures.isEnabled('posts') ? 'posts' : 'games', // [posts] | games | examples | history
  };

  _container;

  componentDidMount() {
    this.props.refreshHistory();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.timeLastNavigated !== this.props.timeLastNavigated &&
      this.state.mode !== 'games'
    ) {
      this._setModeAndScrollToTop('games');
    }
  }

  _getNavigationItems = () => {
    const navigationItems = [];
    if (ExperimentalFeatures.isEnabled('posts') && this.props.viewer) {
      navigationItems.push({ label: 'Posts', key: 'posts' });
    }
    navigationItems.push({ label: 'Featured games', key: 'games' });
    navigationItems.push({ label: 'Examples', key: 'examples' });
    if (this.props.viewer) {
      navigationItems.push({ label: 'Your history', key: 'history' });
    }

    return navigationItems;
  };

  _handleNavigationChange = (selectedKey) => {
    this.setState({ mode: selectedKey });
  };

  _setModeAndScrollToTop = (mode) => {
    this.setState({ mode: mode }, () => {
      if (this._container) {
        this._container.scroll({ top: 0 });
      }
    });
  };

  render() {
    const recentGames = this.props.history
      ? this.props.history.map((historyItem) => {
          return { ...historyItem.game, key: historyItem.userStatusId };
        })
      : [];

    return (
      <div
        className={STYLES_CONTAINER}
        ref={(r) => {
          this._container = r;
        }}>
        <UIHorizontalNavigation
          items={this._getNavigationItems()}
          selectedKey={this.state.mode}
          onChange={this._handleNavigationChange}
        />
        {this.state.mode === 'posts' ? (
          <UIPostList
            viewer={this.props.viewer}
            gameItems={this.props.featuredGames}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this.props.navigateToGame}
            onSignInSelect={this.props.navigateToSignIn}
          />
        ) : null}
        {this.state.mode === 'games' ? (
          <UIGameGrid
            viewer={this.props.viewer}
            gameItems={this.props.featuredGames}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this.props.navigateToGame}
            onSignInSelect={this.props.navigateToSignIn}
          />
        ) : null}
        {this.state.mode === 'examples' ? (
          <UIGameGrid
            viewer={this.props.viewer}
            gameItems={this.props.featuredExamples}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this.props.navigateToGame}
            onSignInSelect={this.props.navigateToSignIn}
          />
        ) : null}
        {this.state.mode === 'history' ? (
          <UIGameGrid
            gameItems={recentGames}
            viewer={this.props.viewer}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this.props.navigateToGame}
            onSignInSelect={this.props.navigateToSignIn}
          />
        ) : null}
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
                viewer={currentUser ? currentUser.user : null}
                navigateToUserProfile={navigator.navigateToUserProfile}
                navigateToGame={navigator.navigateToGame}
                navigateToGameUrl={navigator.navigateToGameUrl}
                navigateToSignIn={navigator.navigateToSignIn}
                history={currentUser.userStatusHistory}
                refreshHistory={currentUser.refreshCurrentUser}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
