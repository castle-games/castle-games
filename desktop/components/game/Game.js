import * as React from 'react';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as URLS from '~/common/urls';
import * as Utilities from '~/common/utilities';
import * as Bridge from '~/common/bridge';
import * as ScreenCapture from '~/common/screencapture';
import GameWindow from '~/native/gamewindow';

import { css } from 'react-emotion';
import { DevelopmentContext, DevelopmentSetterContext } from '~/contexts/DevelopmentContext';

import GameScreenActionsBar from '~/components/game/GameScreenActionsBar';
import GameScreenAlert from '~/components/game/GameScreenAlert';
import GameScreenDeveloperSidebar from '~/components/game/GameScreenDeveloperSidebar';
import GameScreenLayout from '~/components/game/GameScreenLayout';
import GameScreenSidebar from '~/components/game/GameScreenSidebar';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';

class Game extends React.Component {
  state = {
    isToolsVisible: false,
  };

  static defaultProps = {
    errorMessage: '',
  };

  componentDidMount() {
    window.addEventListener('CASTLE_TOOLS_UPDATE', this._handleToolsUpdate);
    NativeUtil.sendLuaEvent('CASTLE_TOOLS_NEEDS_SYNC', {});
  }

  componentWillUnmount() {
    window.removeEventListener('CASTLE_TOOLS_UPDATE', this._handleToolsUpdate);
  }

  _handleToolsUpdate = (e) => {
    if (this.state.isToolsVisible) {
      return;
    }

    const state = JSON.parse(e.params);

    let isToolsVisible = false;
    if (state.panes) {
      isToolsVisible = !!Object.values(state.panes).find(
        (element) => element.children && element.children.count > 0
      );
    }

    this.setState({ isToolsVisible });
  };

  _handleViewSource = (entry) => {
    NativeUtil.openExternalURL(URLS.githubUserContentToRepoUrl(entry));
  };

  _handlePostScreenshot = async () => {
    await Bridge.JS.postCreate({
      message: '',
      mediaType: 'capture',
      mediaUploadParams: { autoCrop: true },
    });
  };

  _handlePostScreenCapture = async () => {
    ScreenCapture.takeScreenCaptureAsync();

    // refocus the game window. otherwise on windows you'll have to click back into the game
    GameWindow.setVisible(false);
    GameWindow.setVisible(true);
  };

  _handleToggleDeveloper = () => {
    this.props.toggleIsDeveloping();
  };

  render() {
    const entryPoint = Utilities.getLuaEntryPoint(this.props.game);
    const isOpenSource = URLS.isOpenSource(entryPoint);

    const elementActions = (
      <GameScreenActionsBar
        game={this.props.game}
        sessionId={this.props.sessionId}
        isMuted={this.props.isMuted}
        isAnonymousViewer={this.props.isAnonymousViewer}
        recordingStatus={this.props.recordingStatus}
        onToggleMute={this.props.onToggleMute}
        onPostScreenshot={this._handlePostScreenshot}
        onPostScreenCapture={this._handlePostScreenCapture}
        onViewSource={isOpenSource ? () => this._handleViewSource(entryPoint) : null}
        onViewDeveloper={this._handleToggleDeveloper}
      />
    );

    let maybeElementAlert;
    if (!Strings.isEmpty(this.props.errorMessage)) {
      maybeElementAlert = <GameScreenAlert>{this.props.errorMessage}</GameScreenAlert>;
    }

    let maybeElementDeveloper;
    if (this.props.isDeveloping) {
      maybeElementDeveloper = (
        <GameScreenDeveloperSidebar
          onWindowSizeUpdate={this.props.onWindowSizeUpdate}
          isMultiplayerCodeUploadEnabled={this.props.isMultiplayerCodeUploadEnabled}
          setters={this.props.setters}
          logs={this.props.logs}
          editableFiles={this.props.editableFiles}
          editFile={this.props.editFile}
          game={this.props.game}
          onReload={this.props.onReload}
        />
      );
    }

    let maybeElementSidebar;
    if (this.state.isToolsVisible) {
      maybeElementSidebar = (
        <GameScreenSidebar
          onSetToolsRef={this.props.onSetToolsRef}
          onWindowSizeUpdate={this.props.onWindowSizeUpdate}
          game={this.props.game}
        />
      );
    }

    const elementHeader = (
      <GameScreenWindowHeader
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
        elementGameSidebar={maybeElementSidebar}
        elementHeader={elementHeader}
        onWindowSizeUpdate={this.props.onWindowSizeUpdate}>
        {this.props.children}
      </GameScreenLayout>
    );
  }
}

export default class GameWithContext extends React.Component {
  render() {
    return (
      <DevelopmentContext.Consumer>
        {(development) => (
          <DevelopmentSetterContext.Consumer>
            {(developmentSetters) => (
              <Game
                toggleIsDeveloping={developmentSetters.toggleIsDeveloping}
                isDeveloping={development.isDeveloping}
                logs={development.logs}
                editableFiles={development.editableFiles}
                editFile={developmentSetters.editFile}
                isMultiplayerCodeUploadEnabled={development.isMultiplayerCodeUploadEnabled}
                setters={developmentSetters}
                {...this.props}
              />
            )}
          </DevelopmentSetterContext.Consumer>
        )}
      </DevelopmentContext.Consumer>
    );
  }
}
