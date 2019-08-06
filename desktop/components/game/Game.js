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
import GameScreenSidebar from '~/components/game/GameScreenSidebar';
import GameScreenWindowHeader from '~/components/game/GameScreenWindowHeader';

export default class Game extends React.Component {
  static contextType = DevelopmentContext;

  static defaultProps = {
    errorMessage: '',
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

  _handleToggleDeveloper = () => {
    this.context.setters.toggleIsDeveloping();

    // NOTE(jim): call update once the screen has updated.
    window.setTimeout(() => {
      this.props.onWindowSizeUpdate();
    });
  };

  render() {
    const entryPoint = Utilities.getLuaEntryPoint(this.props.game);
    const isOpenSource = URLS.isOpenSource(entryPoint);

    const elementActions = (
      <GameScreenActionsBar
        isMuted={this.props.isMuted}
        onToggleMute={this.props.onToggleMute}
        onPostScreenshot={this._handlePostScreenshot}
        onViewSource={isOpenSource ? () => this._handleViewSource(entryPoint) : null}
        onViewDeveloper={this._handleToggleDeveloper}
      />
    );

    let maybeElementAlert;
    if (!Strings.isEmpty(this.props.errorMessage)) {
      maybeElementAlert = <GameScreenAlert>{this.props.errorMessage}</GameScreenAlert>;
    }

    let maybeElementDeveloper;
    if (this.context.isDeveloping) {
      maybeElementDeveloper = (
        <GameScreenDeveloperSidebar
          onWindowSizeUpdate={this.props.onWindowSizeUpdate}
          isMultiplayerCodeUploadEnabled={this.context.isMultiplayerCodeUploadEnabled}
          setters={this.context.setters}
          logs={this.context.logs}
          game={this.props.game}
          onReload={this.props.onReload}
        />
      );
    }

    const elementGameSidebar = (
      <GameScreenSidebar
        onSetToolsRef={this.props.onSetToolsRef}
        onWindowSizeUpdate={this.props.onWindowSizeUpdate}
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
        elementGameSidebar={elementGameSidebar}
        elementHeader={elementHeader}
        onWindowSizeUpdate={this.props.onWindowSizeUpdate}>
        {this.props.children}
      </GameScreenLayout>
    );
  }
}
