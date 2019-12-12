import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { getSessionLink, getShortSessionLink } from '~/common/utilities';

import GameFavoriteControl from '~/components/game/GameFavoriteControl';
import MultiplayerInvite from '~/components/game/MultiplayerInvite';

const STYLES_CONTAINER = css`
  height: 48px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
  color: #222;
  font-size: 12px;
`;

const STYLES_TITLE = css`
  padding-right: 16px;
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 400;
  font-size: 18px;
  user-select: none;
`;

const STYLES_LEFT = css`
  padding-left: 16px;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 200px;
`;

const STYLES_RIGHT = css`
  display: flex;
  flex-shrink: 0;
  min-width: 200px;
  align-items: center;
  justify-content: flex-end;
`;

const STYLES_CTA = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_RECORDING_TEXT = css`
  margin-right: 8px;
  width: 32px;
  height: 32px;
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f00;
`;

const STYLES_RECORDING_PROCESSING = css`
  @keyframes color-change {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  animation: color-change infinite 1000ms;
`;

const CTA = (props) => {
  return (
    <span
      className={STYLES_CTA}
      style={{ ...props.style, color: props.active ? 'magenta' : null }}
      onClick={props.onClick}>
      {props.children}
    </span>
  );
};

export default class GameScreenActionsBar extends React.Component {
  static defaultProps = {
    game: null,
    sessionId: null,
    onChangeVolumme: null,
    onPostScreenshot: null,
    onViewSource: null,
    onViewDeveloper: null,
    recordingStatus: {
      status: 'ready',
    },
  };

  _renderRecordingStatus() {
    let { recordingStatus } = this.props;

    if (recordingStatus.status === 'ready') {
      return (
        <CTA style={{ marginLeft: 12 }} onClick={this.props.onPostScreenCapture}>
          <SVG.VideoCamera height="24px" />
        </CTA>
      );
    } else if (recordingStatus.status === 'processing') {
      return (
        <CTA style={{ marginLeft: 12 }} active={false}>
          <div className={STYLES_RECORDING_PROCESSING}>
            <SVG.VideoCamera
              height="24px"
              style={{
                fill: '#999',
              }}
            />
          </div>
        </CTA>
      );
    } else {
      return (
        <CTA style={{ marginLeft: 12, verticalAlign: 'top' }} active={false}>
          <div width="24px" height="24px" className={STYLES_RECORDING_TEXT}>
            {recordingStatus.secondsRemaining}
          </div>
        </CTA>
      );
    }
  }

  render() {
    let { game, sessionId, isAnonymousViewer } = this.props;
    let sessionLink = getSessionLink(game, sessionId);
    let shortSessionLink = getShortSessionLink(game, sessionId) || sessionLink;

    let volumeElement = <SVG.AudioOn height="20px" style={{ marginRight: 8 }} />;
    if (this.props.isMuted) {
      volumeElement = <SVG.AudioOff height="20px" style={{ marginRight: 8 }} />;
    }

    const isPostControlsVisible = game && game.gameId && !isAnonymousViewer;
    const title = game.title ? Strings.elide(game.title, 21) : 'Untitled';

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <div className={STYLES_LEFT}>
          <div className={STYLES_TITLE}>{title}</div>
          {this.props.game && isPostControlsVisible ? (
            <CTA style={{ marginRight: 8 }}>
              <GameFavoriteControl game={this.props.game} />
            </CTA>
          ) : null}
          {sessionLink ? (
            <MultiplayerInvite
              style={{ marginRight: 8 }}
              sessionLink={sessionLink}
              shortSessionLink={shortSessionLink}
            />
          ) : null}
          {this.props.onToggleMute ? (
            <CTA style={{ marginRight: 8 }} onClick={this.props.onToggleMute}>
              {volumeElement}
            </CTA>
          ) : null}
        </div>
        <div className={STYLES_RIGHT}>
          {this.props.onPostScreenshot && isPostControlsVisible ? (
            <CTA onClick={this.props.onPostScreenshot}>
              <SVG.Camera height="24px" />
            </CTA>
          ) : null}
          {this.props.onPostScreenCapture && isPostControlsVisible && false
            ? this._renderRecordingStatus()
            : null}
          {this.props.onGameMaximize ? (
            <CTA style={{ marginLeft: 12 }} onClick={this.props.onGameMaximize}>
              <SVG.Maximize2 height="22px" onClick={this.props.onGameMaximize} />
            </CTA>
          ) : null}
          {this.props.onViewDeveloper ? (
            <CTA
              style={{ marginLeft: 12 }}
              onClick={this.props.onViewDeveloper}
              active={this.props.developer}>
              <SVG.Tools height="24px" />
            </CTA>
          ) : null}
        </div>
      </div>
    );
  }
}
