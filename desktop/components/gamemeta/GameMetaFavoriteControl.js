import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { css } from 'react-emotion';
import { GameDataContext } from '~/contexts/GameDataContext';

const STYLES_CONTAINER = css`
  min-width: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const STYLES_INTERACTABLE = css`
  cursor: pointer;
  :hover {
    p {
      text-decoration: underline;
    }
  }
`;

const STYLES_STAR = css`
  margin-right: 2px;
`;

class GameMetaFavoriteControl extends React.Component {
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

    let label;
    let interactable = true;
    if (!viewer || viewer.isAnonymous) {
      interactable = false;
      label = 'Sign up to add this game as a favorite';
    } else if (hovering && clicked) {
      label = game.isFavorite ? 'Favorited' : 'Unfavorited';
    } else if (hovering) {
      label = game.isFavorite ? 'Unfavorite' : 'Favorite';
    } else {
      label = game.isFavorite ? 'Favorited' : 'Favorite';
    }

    let containerStyles = interactable
      ? `${STYLES_CONTAINER} ${STYLES_INTERACTABLE}`
      : STYLES_CONTAINER;
    let svg = game.isFavorite ? (
      <SVG.StarFilled height={16} className={STYLES_STAR} />
    ) : (
      <SVG.StarEmpty height={16} className={STYLES_STAR} />
    );
    return (
      <div
        className={containerStyles}
        onMouseOver={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false, clicked: false })}
        onClick={interactable ? this._onClick : null}>
        {svg}
        <p>{label}</p>
      </div>
    );
  }
}

export default class GameMetaFavoriteControlWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <GameDataContext.Consumer>
            {(gameData) => (
              <GameMetaFavoriteControl
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
