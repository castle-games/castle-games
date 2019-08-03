import * as React from 'react';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as URLS from '~/common/urls';
import * as Utilities from '~/common/utilities';
import * as Bridge from '~/common/bridge';

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
  _game;
  _tools;

  static defaultProps = {
    errorMessage: '',
  };

  state = {
    developer: false,
  };

  _handleViewSource = (entry) => {
    NativeUtil.openExternalURL(URLS.githubUserContentToRepoUrl(entry));
  };

  _handlePostScreenshot = async () => {
    await Bridge.JS.postCreate({
      message: 'I took a screenshot!',
      mediaType: 'capture',
      mediaUploadParams: { autoCrop: true },
    });
  };

  _setGameRef = (ref) => {
    this._game = ref;
  };

  _setToolsRef = (ref) => {
    this._tools = ref;
  };

  _getGameRef = () => {
    return this._game;
  };

  _getToolsRef = () => {
    return this._tools;
  };

  render() {
    const entryPoint = Utilities.getLuaEntryPoint(this.props.game);
    const isOpenSource = URLS.isOpenSource(entryPoint);

    const elementActions = (
      <GameScreenActionsBar
        onToggleMute={this.props.onToggleMute}
        onPostScreenshot={this._handlePostScreenshot}
        onViewSource={isOpenSource ? () => this._handleViewSource(entryPoint) : null}
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
      maybeElementDeveloper = (
        <GameScreenDeveloperSidebar
          game={this.props.game}
          getGameRef={this._getGameRef}
          onReload={this.props.onReload}
        />
      );
    }

    const elementGame = (
      <GameScreenMedia
        ref={this._setGameRef}
        getToolsFunctions={this._getToolsRef}
        theater={this.props.isFullScreen}
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

    const elementGameSidebar = (
      <GameScreenSidebar
        getGameFunctions={this._getGameRef}
        setToolsRef={this._setToolsRef}
        game={this.props.game}
      />
    );

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
