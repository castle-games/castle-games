import * as React from 'react';

// GameDataContext is a context of game objects we have loaded in the app.
// We use a react context for this cache because game objects can be locally mutated
// (e.g. favorited or unfavorited), and we want mounted components to be able to consume
// those updates.

const GameDataContextDefaults = {
  gameIdToGame: {},
  addGame: (game) => {},
};

const GameDataContext = React.createContext(GameDataContextDefaults);

class GameDataContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...GameDataContextDefaults,
      ...props.value,
      addGame: this.addGame,
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

  render() {
    return (
      <GameDataContext.Provider value={this.state}>{this.props.children}</GameDataContext.Provider>
    );
  }
}

export { GameDataContext, GameDataContextProvider };
