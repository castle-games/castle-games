import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIGameSet from '~/components/reusable/UIGameSet';
import GameInfoModal from '~/components/GameInfoModal';

import * as SVG from '~/common/svg';

const STYLES_HOME_CONTAINER = css`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const STYLES_GAMES_CONTAINER = css`
  margin-top: 30px;
  width: 100%;
  overflow: hidden;
`;

const STYLES_MAKE_GAME_ICON = css`
  flex-shrink: 0;
  width: 204px;
  margin-left: 8px;
  margin-right: 8px;
  align-items: center;
  font-family: ${Constants.font.system};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  color: #BCBCBC;
  border-color: #C0C0C0;

  :hover {
    color: magenta;
    border-color: magenta;
  }
`;

const STYLES_CREATE_GAMES_HEADER = css`
  color: ${Constants.colors.text};

  :hover {
    color: magenta;
  }
`;

const STYLES_MAKE_TITLE = css`
  font-family: ${Constants.font.game};
  font-size: 16px;
  margin-right: 8px;
  cursor: pointer;
`;

const STYLES_MAKE_AUTHOR = css`
  font-family: ${Constants.font.system};
  margin-top: 4px;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;
`;

const STYLES_CREATE_ICON_TOP_AREA = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 224px;
  height: 124px;
  border-radius: 4px 4px 0px 0px;
  margin-top: 16px;
  cursor: pointer;
  border-top: 2px solid;
  border-left: 2px solid;
  border-right: 2px solid;
`;

const STYLES_CREATE_DESCRIPTION = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 2px solid;
  border-radius: 0px 0px 4px 4px;
  width: 224px;
  height: 64px;
  padding-left: 12px;
`;

class GamesHomeScreen extends React.Component {

  static defaultProps = {
    trendingGames: [],
    gamesUnderConstruction: [],
    newestGames: [],
    randomGames: [],
  };

  state = {
    gameInfoToShow: null,
  };

  _handleShowGameInfo = (game) => {
    this.setState({ gameInfoToShow: game })
  }

  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `home-${this.props.mode}`, ...options });
  };

  _handleCancelShowGameInfo = () => {
    this.setState({ gameInfoToShow: null })
  }

  render() {
    return (
      <div className={STYLES_HOME_CONTAINER}>
        <div className={STYLES_GAMES_CONTAINER}>
          <UIGameSet
            title="Trending Games"
            viewer={this.props.viewer}
            gameItems={this.props.trendingGames}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
            onShowGameInfo={this._handleShowGameInfo}
            onSignInSelect={this.props.navigateToSignIn}
          />
          <UIGameSet
            title="New Games"
            viewer={this.props.viewer}
            gameItems={this.props.newestGames}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
            onShowGameInfo={this._handleShowGameInfo}
            onSignInSelect={this.props.navigateToSignIn}
          />
          <UIGameSet
            title="More Games"
            viewer={this.props.viewer}
            gameItems={this.props.randomGames}
            onUserSelect={this.props.navigateToUserProfile}
            onGameSelect={this._navigateToGame}
            onShowGameInfo={this._handleShowGameInfo}
            onSignInSelect={this.props.navigateToSignIn}
          />
        </div>
        {this.state.gameInfoToShow ? (
          <div style={{'padding': '16px'}}>
            <GameInfoModal
              game={this.state.gameInfoToShow} 
              onCancel={this._handleCancelShowGameInfo}
              onUserSelect={this.props.navigateToUserProfile}
              onGameSelect={this._navigateToGame}
            />
          </div>
        ) : null}
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
                navigateToGameUrl={navigator.navigateToGameUrl}
                navigateToSignIn={navigator.navigateToSignIn}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
