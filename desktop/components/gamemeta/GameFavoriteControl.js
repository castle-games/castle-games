import * as React from 'react';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { css } from 'react-emotion';
import { GameDataContext } from '~/contexts/GameDataContext';

const STYLES_CONTAINER = css`
  min-width: 72px;
`;

const STYLES_ACTION = css`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_LABEL = css``;

class GameFavoriteControl extends React.Component {
  static defaultProps = {
    toggleFavorite: async (game) => {},
    game: null,
    viewer: null,
  };

  state = {
    hovering: false,
    clicked: false,
  };

  _onClick = () => {
    this.props.toggleFavorite(this.props.game.gameId);
    return this.setState({ clicked: true });
  };

  render() {
    const { game, viewer } = this.props;
    const { hovering, clicked } = this.state;

    if (!game) return null;

    // TODO: star full or star empty
    let label;
    let interactable = true;
    if (!viewer || viewer.isAnonymous) {
      interactable = false;
      label = 'Sign up to add this game as a favorite';
    } else if (hovering && clicked) {
      label = game.isFavorite ? 'Favorited' : 'Removed';
    } else if (hovering) {
      label = game.isFavorite ? 'Remove Favorite' : 'Add Favorite';
    } else {
      label = game.isFavorite ? 'Favorited' : 'Add Favorite';
    }

    let labelStyles = interactable ? STYLES_ACTION : STYLES_LABEL;
    return (
      <div
        className={STYLES_CONTAINER}
        onMouseOver={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false, clicked: false })}>
        <p className={labelStyles} onClick={interactable ? this._onClick : null}>
          {label}
        </p>
      </div>
    );
  }
}

export default class GameFavoriteControlWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <GameDataContext.Consumer>
            {(gameData) => (
              <GameFavoriteControl
                game={gameData.gameIdToGame[this.props.gameId]}
                toggleFavorite={gameData.toggleFavorite}
                viewer={currentUser.user}
                {...this.props}
              />
            )}
          </GameDataContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
