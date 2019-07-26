import * as React from 'react';

import { css } from 'react-emotion';

import GameScreenActionsBar from '~/components/game/GameScreenActionsBar';
import GameScreenAlert from '~/components/game/GameScreenAlert';
import GameScreenDeveloperSidebar from '~/components/game/GameScreenDeveloperSidebar';
import GameScreenLayout from '~/components/game/GameScreenLayout';
import GameScreenMedia from '~/components/game/GameScreenMedia';
import GameScreenSidebar from '~/components/game/GameScreenSidebar';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';

export default class Game extends React.Component {
  render() {
    const elementActions = <GameScreenActionsBar />;

    const elementAlert = (
      <GameScreenAlert>There was an issue with loading your game.</GameScreenAlert>
    );

    const elementDeveloper = <GameScreenDeveloperSidebar />;

    const elementGame = <GameScreenMedia />;

    const elementGameSidebar = <GameScreenSidebar />;

    const elementHeader = <GameScreenWindowHeader />;

    return (
      <GameScreenLayout
        elementActions={elementActions}
        elementAlert={elementAlert}
        elementDeveloper={elementDeveloper}
        elementGame={elementGame}
        elementGameSidebar={elementGameSidebar}
        elementHeader={elementHeader}
      />
    );
  }
}
