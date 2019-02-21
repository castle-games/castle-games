import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import HomeMakeBanner from '~/components/home/HomeMakeBanner';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIHeading from '~/components/reusable/UIHeading';

// when a section is not expanded, show at most PREVIEW_GRID_SIZE games
const PREVIEW_GRID_SIZE = 4;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: ${Constants.colors.background};
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_SECTION = css`
  padding: 16px 16px 32px 16px;
`;

const STYLES_SEE_ALL = css`
  cursor: pointer;
  color: ${Constants.colors.action};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  text-decoration: underline;
  font: ${Constants.font.mono};
  text-transform: uppercase;
`;

class HomeScreen extends React.Component {
  static defaultProps = {
    featuredGames: [],
    history: [],
    refreshHistory: async () => {},
  };
  state = {
    mode: 'default', // default | history | games
  };

  componentDidMount() {
    this.props.refreshHistory();
  }

  _renderGameSection = (games, sectionTitle, featuredMode) => {
    const isSectionVisible = this.state.mode === 'default' || this.state.mode === featuredMode;
    if (!games || !games.length || !isSectionVisible) {
      return null;
    } else {
      let gameItems = games;
      let seeAllElement;
      if (this.state.mode === 'default') {
        gameItems = gameItems.slice(0, PREVIEW_GRID_SIZE);
        seeAllElement = (
          <div className={STYLES_SEE_ALL} onClick={() => this.setState({ mode: featuredMode })}>
            See All
          </div>
        );
      }
      return (
        <div className={STYLES_SECTION}>
          <UIHeading>{sectionTitle}</UIHeading>
          <div>
            <UIGameGrid
              gameItems={gameItems}
              onUserSelect={this.props.naviateToUserProfile}
              onGameSelect={this.props.navigateToGame}
            />
          </div>
          {seeAllElement}
        </div>
      );
    }
  };

  render() {
    const recentGames = this.props.history
      ? this.props.history.map((historyItem) => {
          return { ...historyItem.game, key: historyItem.userStatusId };
        })
      : null;
    const featuredGamesElement = this._renderGameSection(
      this.props.featuredGames,
      'Featured Games',
      'games'
    );
    const recentElement = this._renderGameSection(recentGames, 'Recent Games', 'history');
    const makeElement = this.state.mode === 'default' ? <HomeMakeBanner /> : null;

    return (
      <div className={STYLES_CONTAINER}>
        {makeElement}
        {recentElement}
        {featuredGamesElement}
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
