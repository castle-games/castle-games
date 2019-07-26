import * as React from 'react';

import { css } from 'react-emotion';

import GameScreenLayout from '~/components/game/GameScreenLayout';
import GameScreenAlert from '~/components/game/GameScreenAlert';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';
import GameScreenDeveloperSidebar from '~/components/game/GameScreenDeveloperSidebar';
import GameScreenActionsBar from '~/components/game/GameScreenActionsBar';

export default class Game extends React.Component {
  render() {
    const elementAlert = (
      <GameScreenAlert>There was an issue with loading your game.</GameScreenAlert>
    );

    const elementHeader = <GameScreenWindowHeader />;

    const elementDeveloper = <GameScreenDeveloperSidebar />;

    const elementActions = <GameScreenActionsBar />;

    return (
      <GameScreenLayout
        elementAlert={elementAlert}
        elementHeader={elementHeader}
        elementDeveloper={elementDeveloper}
        elementActions={elementActions}
      />
    );
  }
}
