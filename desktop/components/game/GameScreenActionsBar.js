import * as React from 'react';
import * as SVG from '~/components/primitives/svg';
import * as Constants from '~/common/constants';
import { getSessionLink, getShortSessionLink } from '~/common/utilities';

import { css } from 'react-emotion';

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

const STYLES_CHAT_FIELD = css`
  font-size: 14px;
  line-height: 14px;
  flex-shrink: 0;
  width: 188px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px 4px 16px;
  background: rgba(255, 255, 255, 0.8);
  color: #999;
`;

const STYLES_LEFT = css`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 200px;
`;

const STYLES_MIDDLE = css`
  width: 100%;
  min-width: 20%;
  text-align: center;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  min-width: 200px;
  text-align: right;
`;

const STYLES_CTA = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
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
        <CTA style={{ marginRight: 24 }} onClick={this.props.onPostScreenCapture}>
          <SVG.VideoCamera
            height="32px"
            style={{
              marginRight: 8,
            }}
          />
        </CTA>
      );
    } else if (recordingStatus.status === 'processing') {
      return (
        <CTA style={{ marginRight: 24 }} active={false}>
          <div className={STYLES_RECORDING_PROCESSING}>
            <SVG.VideoCamera
              height="32px"
              style={{
                marginRight: 8,
                fill: '#999',
              }}
            />
          </div>
        </CTA>
      );
    } else {
      return (
        <CTA style={{ marginRight: 24, verticalAlign: 'top' }} active={false}>
          <div width="32px" height="32px" className={STYLES_RECORDING_TEXT}>
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

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <div className={STYLES_LEFT} style={{ paddingLeft: 16 }}>
          {sessionLink ? (
            <MultiplayerInvite
              style={{ marginRight: 18 }}
              sessionLink={sessionLink}
              shortSessionLink={shortSessionLink}
            />
          ) : null}
          {this.props.onToggleMute ? (
            <CTA style={{ marginRight: 24 }} onClick={this.props.onToggleMute}>
              {volumeElement}
            </CTA>
          ) : null}
        </div>
        <div className={STYLES_MIDDLE}>
          {this.props.onPostScreenshot && isPostControlsVisible ? (
            <CTA style={{ marginRight: 24 }} onClick={this.props.onPostScreenshot}>
              <SVG.Camera height="32px" style={{ marginRight: 8 }} />
            </CTA>
          ) : null}

          {this.props.onPostScreenCapture && isPostControlsVisible && false
            ? this._renderRecordingStatus()
            : null}
        </div>
        <div className={STYLES_RIGHT}>
          {this.props.onViewSource ? (
            <CTA style={{ marginRight: 24 }} onClick={this.props.onViewSource}>
              <SVG.Source height="20px" style={{ marginRight: 8 }} />
            </CTA>
          ) : null}

          {this.props.onViewDeveloper ? (
            <CTA onClick={this.props.onViewDeveloper} active={this.props.developer}>
              <SVG.Tools height="20px" style={{ marginRight: 8 }} />
            </CTA>
          ) : null}
        </div>
      </div>
    );
  }
}
