import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIGameSet from '~/components/reusable/UIGameSet';

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

const STYLES_ALL_GAMES_LOADING_INDICATOR = css`
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl6};
  margin: 8px 0px 0px 24px;
`;

const STYLES_SECTION_TITLE = css`
  font-weight: 400;
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  padding: 0px 24px 16px 24px;
`;

class BrowseScreen extends React.Component {
  static defaultProps = {
    content: {
      allGames: null,
    },
  };

  state = {
    isLoading: true,
  };

  async componentDidMount() {
    this._mounted = true;
    this._reload();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.content.allGames &&
      this.props.content.allGames !== prevProps.content.allGames &&
      this.state.isLoading &&
      this.props.content.allGames.length > 35
    ) {
      this.setState({ isLoading: false });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  _reload = async () => {
    this.setState({ isLoading: true });
    await this.props.contentActions.loadAllGames();
    this.setState({ isLoading: false });
  };

  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `browse`, ...options });
  };

  _navigateToGameMeta = (game, options) => {
    return this.props.navigateToGameMeta(game, { launchSource: `browse`, ...options });
  };

  render() {
    return (
      <div className={STYLES_HOME_CONTAINER}>
        <div className={STYLES_CONTENT_CONTAINER}>
          <div className={STYLES_SECTION_TITLE}>All Games</div>
          <div className={STYLES_GAMES_CONTAINER}>
            {this.props.content.allGames ? (
              <UIGameSet
                numRowsToElide={-1}
                gameItems={this.props.content.allGames}
                onUserSelect={this.props.navigateToUserProfile}
                onGameSelect={this._navigateToGameMeta}
              />
            ) : null}
            {this.state.isLoading ? (
              <div className={STYLES_ALL_GAMES_LOADING_INDICATOR}>Loading games...</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default class BrowseScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <BrowseScreen
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
