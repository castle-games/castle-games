import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import HomeMakeBanner from '~/components/home/HomeMakeBanner';
import { NavigatorContext } from '~/contexts/NavigatorContext';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIHeading from '~/components/reusable/UIHeading';

const MAX_NUM_FEATURED_GAMES = 16;

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

export default class HomeScreen extends React.Component {
  static contextType = NavigatorContext;
  static defaultProps = {
    featuredGames: [],
  };

  _getFeaturedGames = () => {
    const { featuredGames } = this.props;
    let result;
    if (featuredGames) {
      result = featuredGames;
      if (result.length > MAX_NUM_FEATURED_GAMES) {
        result = result.slice(0, MAX_NUM_FEATURED_GAMES);
      }
    }
    return result;
  };

  render() {
    const featuredGames = this._getFeaturedGames();

    return (
      <div className={STYLES_CONTAINER}>
        <HomeMakeBanner />
        <div className={STYLES_SECTION}>
          <UIHeading>Play Games</UIHeading>
          <div>
            <UIGameGrid
              gameItems={featuredGames}
              onUserSelect={this.context.naviateToUserProfile}
              onGameSelect={this.context.navigateToGame}
            />
          </div>
        </div>
      </div>
    );
  }
}
