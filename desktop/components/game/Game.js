import * as React from 'react';

import { css } from 'react-emotion';

import GameScreenLayout from '~/components/game/GameScreenLayout';
import GameScreenAlert from '~/components/game/GameScreenAlert';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';

export default class Game extends React.Component {
  render() {
    const elementAlert = (
      <GameScreenAlert>There was an issue with loading your game.</GameScreenAlert>
    );

    const elementHeader = <GameScreenWindowHeader />;

    return <GameScreenLayout elementAlert={elementAlert} elementHeader={elementHeader} />;
  }
}
