import * as React from 'react';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';

import GameScreenActionsBar from '~/components/game/GameScreenActionsBar';
import GameScreenAlert from '~/components/game/GameScreenAlert';
import GameScreenDeveloperSidebar from '~/components/game/GameScreenDeveloperSidebar';
import GameScreenLayout from '~/components/game/GameScreenLayout';
import GameScreenMedia from '~/components/game/GameScreenMedia';
import GameScreenSidebar from '~/components/game/GameScreenSidebar';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';

export default class Game extends React.Component {
  static defaultProps = {
    errorMessage: '',
  };

  state = {
    developer: false,
  };

  render() {
    const elementActions = (
      <GameScreenActionsBar
        onChangeVolume={this.props.onChangeVolume}
        onCreatePost={this.props.onCreatePost}
        onViewSource={this.props.onViewSource}
        onViewDeveloper={() => this.setState({ developer: !this.state.developer })}
        developer={this.state.developer}
      />
    );

    let maybeElementAlert;
    if (!Strings.isEmpty(this.props.errorMessage)) {
      maybeElementAlert = <GameScreenAlert>{this.props.errorMessage}</GameScreenAlert>;
    }

    let maybeElementDeveloper;
    if (this.state.developer) {
      maybeElementDeveloper = <GameScreenDeveloperSidebar game={this.props.game} />;
    }

    const elementGame = (
      <GameScreenMedia
        game={this.props.game}
        timeGameLoaded={this.props.timeGameLoaded}
        timeNavigatedToGame={this.props.timeNavigatedToGame}
        navigateToUserProfile={this.props.navigateToUserProfile}
        navigateToEditPost={this.props.navigateToEditPost}
        navigateToGameUrl={this.props.navigateToGameUrl}
        navigateToGame={this.props.navigateToGame}
        refreshCurrentUser={this.props.refreshCurrentUser}
      />
    );

    const elementGameSidebar = <GameScreenSidebar game={this.props.game} />;

    const elementHeader = (
      <GameScreenWindowHeader
        navigateToHome={this.props.navigateToHome}
        onGameMinimize={this.props.onGameMinimize}
        onGameMaximize={this.props.onGameMaximize}
        onGameDismiss={this.props.onGameDismiss}
      />
    );

    return (
      <GameScreenLayout
        elementActions={elementActions}
        elementAlert={maybeElementAlert}
        elementDeveloper={maybeElementDeveloper}
        elementGame={elementGame}
        elementGameSidebar={elementGameSidebar}
        elementHeader={elementHeader}
      />
    );
  }
}
