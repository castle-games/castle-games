import * as React from 'react';
import * as Actions from '~/common/actions';

// GameDataContext is a context of game objects we have loaded in the app.
// We use a react context for this cache because game objects can be locally mutated
// (e.g. favorited or unfavorited), and we want mounted components to be able to consume
// those updates.

const GameDataContextDefaults = {
  gameIdToGame: {},
  addGame: (game) => {},
  toggleFavorite: async (game) => {},
};

const GameDataContext = React.createContext(GameDataContextDefaults);

class GameDataContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...GameDataContextDefaults,
      ...props.value,
      addGame: this.addGame,
      toggleFavorite: this.toggleFavorite,
    };
  }

  addGame = (game) => {
    return this.setState((state) => {
      const gameIdToGame = { ...state.gameIdToGame };
      gameIdToGame[game.gameId] = game;

      return {
        ...state,
        gameIdToGame,
      };
    });
  };

  toggleFavorite = async (gameId) => {
    if (!gameId || !this.state.gameIdToGame[gameId]) {
      throw new Error(`Cannot toggle favorite game`);
    }
    // optimistically toggle
    await this.setState((state) => {
      const gameIdToGame = { ...state.gameIdToGame };
      const game = gameIdToGame[gameId];
      game.isFavorite = !game.isFavorite;
      gameIdToGame[gameId] = game;
      return {
        ...state,
        gameIdToGame,
      };
    });
    (async () => {
      const result = await Actions.toggleFavoriteGame(gameId);
      if (result && result.isFavorite !== this.state.gameIdToGame[gameId].isFavorite) {
        // update state again if it's not what we expected
        this.setState((state) => {
          const gameIdToGame = { ...state.gameIdToGame };
          const game = gameIdToGame[gameId];
          game.isFavorite = result.isFavorite;
          gameIdToGame[gameId] = game;
          return {
            ...state,
            gameIdToGame,
          };
        });
      }
    })();
  };

  render() {
    return (
      <GameDataContext.Provider value={this.state}>{this.props.children}</GameDataContext.Provider>
    );
  }
}

export { GameDataContext, GameDataContextProvider };
