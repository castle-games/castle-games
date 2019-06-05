import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as SVG from '~/components/primitives/svg';
import * as Utilities from '~/common/utilities';
import * as Bridge from '~/common/bridge';

import { css } from 'react-emotion';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';

import DevelopmentConsole from '~/components/game/DevelopmentConsole';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  width: 100%;
`;

const STYLES_BUTTON = css`
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  :hover {
    color: ${Constants.colors.brand2};
  }

  svg {
    transform: scale(1);
    transition: 200ms ease transform;

    :hover {
      transform: scale(1.1);
    }
  }
`;

const STYLES_GAME_STRIP = css`
  color: ${Constants.colors.white};
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_GAME_STRIP_LEFT = css`
  font-family: ${Constants.font.mono};
  min-width: 25%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 11px;
  line-height: 10px;
  letter-spacing: 0.1px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const STYLES_GAME_STRIP_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
`;

const STYLES_EMPHASIS_CHOICE = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.white};
  background: #313131;
  flex-shrink: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default class GameActionsBar extends React.Component {
  static contextType = DevelopmentContext;

  _lastDeveloperState = false;

  _handleToggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onToggleMute();
  };

  _handleViewSource = (gameEntryPoint) => {
    NativeUtil.openExternalURL(Urls.githubUserContentToRepoUrl(gameEntryPoint));
  };

  _handlePostScreenshot = async () => {
    await Bridge.JS.postCreate({
      message: 'I took a screenshot!',
      mediaType: 'capture',
      mediaUploadParams: { autoCrop: true },
    });
  };

  componentDidUpdate(prevProps) {
    if (this._lastDeveloperState !== this.context.isDeveloping) {
      this.props.onUpdateGameWindowFrame();
    }

    this._lastDeveloperState = this.context.isDeveloping;
  }

  render() {
    let { game, isMuted } = this.props;

    let developerPanelElement;
    if (this.context.isDeveloping) {
      developerPanelElement = <DevelopmentConsole game={game} reloadGame={this.props.reloadGame} />;
    }
    let maybeViewSourceElement;
    const entryPoint = Utilities.getLuaEntryPoint(game);
    if (Urls.isOpenSource(entryPoint)) {
      maybeViewSourceElement = (
        <UINavigationLink
          style={{ marginRight: 24 }}
          onClick={() => this._handleViewSource(entryPoint)}>
          View Source
        </UINavigationLink>
      );
    }
    let muteIcon = isMuted ? <SVG.Mute height="14px" /> : <SVG.Audio height="14px" />;
    let muteElement = (
      <span className={STYLES_BUTTON} style={{ marginLeft: 12 }} onClick={this._handleToggleMute}>
        {muteIcon}
      </span>
    );

    let maybePostScreenshotElement = (
      <UINavigationLink style={{ marginRight: 24 }} onClick={this._handlePostScreenshot}>
        Post screenshot
      </UINavigationLink>
    );

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_GAME_STRIP}>
          <div
            className={STYLES_EMPHASIS_CHOICE}
            style={{ backgroundColor: this.context.isDeveloping ? `#020202` : null }}
            onClick={() => this.context.setters.setIsDeveloping(!this.context.isDeveloping)}>
            <UINavigationLink
              style={{
                padding: '0 24px 0 24px',
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
              }}>
              {!this.context.isDeveloping ? `Develop` : `Hide Development Console`}
            </UINavigationLink>
          </div>
          <div className={STYLES_GAME_STRIP_LEFT}>{muteElement}</div>
          <div className={STYLES_GAME_STRIP_RIGHT}>
            {maybeViewSourceElement}
            {maybePostScreenshotElement}
            <UINavigationLink style={{ marginRight: 24 }} onClick={this.props.onFullScreenToggle}>
              Theater Mode (ESC)
            </UINavigationLink>
            <UINavigationLink style={{ marginRight: 24 }} onClick={this.props.clearCurrentGame}>
              End game
            </UINavigationLink>
          </div>
        </div>
        {developerPanelElement}
      </div>
    );
  }
}
