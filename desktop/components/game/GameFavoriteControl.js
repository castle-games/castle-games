import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { GameDataContext } from '~/contexts/GameDataContext';

const STYLES_CONTAINER = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const STYLES_STAR = css``;

class GameMetaFavoriteControl extends React.Component {
  static defaultProps = {
    toggleFavorite: async (game) => {},
    game: null,
  };

  _onClick = () => {
    this.props.toggleFavorite(this.props.game.gameId);
  };

  render() {
    const { game } = this.props;
    if (!game) return null;

    let svg = game.isFavorite ? (
      <SVG.StarFilled height={32} className={STYLES_STAR} />
    ) : (
      <SVG.StarEmpty height={32} className={STYLES_STAR} />
    );
    return (
      <div className={STYLES_CONTAINER} onClick={this._onClick}>
        {svg}
      </div>
    );
  }
}

export default class GameMetaFavoriteControlWithContext extends React.Component {
  render() {
    return (
      <GameDataContext.Consumer>
        {(gameData) => (
          <GameMetaFavoriteControl
            game={gameData.gameIdToGame[this.props.gameId]}
            toggleFavorite={gameData.toggleFavorite}
            {...this.props}
          />
        )}
      </GameDataContext.Consumer>
    );
  }
}
