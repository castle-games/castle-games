import * as React from 'react';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Urls from '~/common/urls';
import * as SVG from '~/components/primitives/svg';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';

import DevelopmentLogs from '~/components/game/DevelopmentLogs';
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
  height: 32px;
  width: 100%;
  color: ${Constants.colors.white};
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
  background: #313131;
  flex-shrink: 0;
  color: ${Constants.colors.white};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_LOG_CONTAINER = css`
  background: #020202;
  width: 100%;
  display: flex;
  height: 172px;
  min-height: 96px;
  flex-direction: column;
`;

export default class GameActionsBar extends React.Component {
  static contextType = DevelopmentContext;
  state = {
    isMuted: false,
  };

  _lastDeveloperState = false;

  _handleToggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isMuted = !this.state.isMuted;
    NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', isMuted ? 0 : 1);
    this.setState({ isMuted });
  };

  _handleViewSource = (gameEntryPoint) => {
    NativeUtil.openExternalURL(Urls.githubUserContentToRepoUrl(gameEntryPoint));
  };

  componentDidUpdate(prevProps) {
    if (this._lastDeveloperState !== this.context.isDeveloping) {
      this.props.onUpdateGameWindowFrame();
    }

    this._lastDeveloperState = this.context.isDeveloping;
  }

  _renderDeveloping = () => {
    let { game } = this.props;

    return (
      <div className={STYLES_LOG_CONTAINER}>
        <DevelopmentLogs
          logs={this.context.logs}
          onClearLogs={this.context.setters.clearLogs}
          game={game}
        />
      </div>
    );
  };

  render() {
    let { game } = this.props;

    let developerPanelElement;
    if (this.context.isDeveloping) {
      developerPanelElement = this._renderDeveloping();
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
    let muteIcon = this.state.isMuted ? <SVG.Mute height="14px" /> : <SVG.Audio height="14px" />;
    let muteElement = (
      <span className={STYLES_BUTTON} style={{ marginLeft: 12 }} onClick={this._handleToggleMute}>
        {muteIcon}
      </span>
    );

    return (
      <div className={STYLES_CONTAINER}>
        {developerPanelElement}
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
            <UINavigationLink style={{ marginRight: 24 }} onClick={this.props.onFullScreenToggle}>
              Theater Mode
            </UINavigationLink>
            <UINavigationLink style={{ marginRight: 24 }} onClick={this.props.clearCurrentGame}>
              End game
            </UINavigationLink>
          </div>
        </div>
      </div>
    );
  }
}
