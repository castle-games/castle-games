import * as React from 'react';
import * as Window from '~/common/window';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';
import * as URLS from '~/common/urls';

import { css } from 'react-emotion';

import DevelopmentLogs from '~/components/game/DevelopmentLogs';

const path = Utilities.path();

const BORDER_COLOR = '#333';
const BACKGROUND_COLOR = '#000';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  border-left: 1px solid ${BORDER_COLOR};
  background: ${BACKGROUND_COLOR};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  font-family: ${Constants.REFACTOR_FONTS.system};
`;

const STYLES_LOGS = css`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
`;

const STYLES_INFO_HEADING = css`
  width: 100%;
  font-size: 11px;
  padding: 16px 16px 16px 16px;
  flex-shrink: 0;
  border-bottom: 1px solid ${BORDER_COLOR};
  color: #fff;
`;

const STYLES_INFO_HEADING_ROW = css`
  width: 100%;
  font-size: 11px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  line-height: 1.225;
  cursor: pointer;
`;

const STYLES_INFO_TEXT = css`
  padding: 16px 0 0 0;
  font-size: 11px;
`;

const STYLES_INFO_TEXT_TITLE = css`
  font-weight: 700;
  padding-right: 16px;
  flex-shrink: 0;
`;

const STYLES_INFO_TEXT_BODY = css`
  margin-top: 8px;
  line-height: 1.225;
`;

const STYLES_INFO_TEXT_DESCRIPTION = css`
  overflow-wrap: break-word;
  min-width: 10%;
  width: 100%;
`;

const STYLES_SECTION_HEADER = css`
  position: absolute;
  top: 0;
  width: 100%;
  height: 24px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  flex-shrink: 0;
  color: #fff;
  border-bottom: 1px solid ${BORDER_COLOR};
`;

const STYLES_COL = css`
  position: relative;
  width: 100%;
  min-height: 10%;
  min-width: 25%;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #000000 0%, #181818 74%);
`;

const STYLES_COL_RIGHT = css`
  border-left: 1px solid ${BORDER_COLOR};
  flex-shrink: 0;
`;

const STYLES_SCROLL = css`
  height: 100%;
  padding-top: 24px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const STYLES_HEADING_LEFT = css`
  min-width: 10%;
  width: 100%;
  font-weight: 700;
`;

const STYLES_HEADING_RIGHT = css`
  flex-shrink: 0;
  text-align: right;
`;

const STYLES_CTA = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.white};
  flex-shrink: 0;
  display: inline-flex;
  user-select: none;
  text-transform: uppercase;
  font-size: 10px;
  line-height: 10px;
  letter-spacing: 0.1px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: 200ms ease;

  :hover {
    color: ${Constants.colors.brand2};
  }
`;

export default class GameScreenDeveloperSidebar extends React.Component {
  _client;
  _server;

  state = {
    server: 484,
  };

  componentDidMount() {
    window.addEventListener('mouseup', this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
    this.props.setters.setIsMultiplayerCodeUploadEnabled(false);
  }

  _handleMouseDown = (e, resizing) => {
    e.preventDefault();
    this.setState({ resizing, mouseY: e.pageY, start: this.state[resizing] });
  };

  _handleMouseMove = (e) => {
    const MIN_SIZE = 164;
    const START_HEIGHT = Window.getViewportSize().height * 0.5;
    const MAX_SIZE = Window.getViewportSize().height * 0.8;

    if (!this.state.resizing) {
      return;
    }

    let nextHeight;

    if (this.state.resizing === 'server') {
      nextHeight = this.state.start - (e.pageY - this.state.mouseY);
    }

    if (nextHeight < MIN_SIZE) {
      nextHeight = MIN_SIZE;
    }

    if (nextHeight > MAX_SIZE) {
      nextHeight = MAX_SIZE;
    }

    this.setState({ [this.state.resizing]: nextHeight });
  };

  _handleMouseUp = (e) => {
    if (this.state.resizing) {
      this.setState({ resizing: null, mouseY: null, start: null });
    }
  };

  _handleMultiplayerCodeUpload = () => {
    const { isMultiplayerCodeUploadEnabled } = this.props;
    this.props.setters.setIsMultiplayerCodeUploadEnabled(!isMultiplayerCodeUploadEnabled);
  };

  _handleOpenGamePath = () => {
    const { game } = this.props;
    if (URLS.isPrivateUrl(game.url)) {
      const gamePath = path.dirname(game.url);
      NativeUtil.openExternalURL(gamePath);
    } else {
      NativeUtil.openExternalURL(game.url);
    }
  };

  _handleServerLogReload = () => {
    if (!this._server) {
      return;
    }

    this._server._fetchRemoteLogsAsync();
  };

  render() {
    const { isMultiplayerCodeUploadEnabled } = this.props;
    const isMultiplayer = Utilities.isMultiplayer(this.props.game);

    let maybeMultiplayerElement;
    if (isMultiplayer && URLS.isPrivateUrl(this.props.game.url)) {
      maybeMultiplayerElement = (
        <span
          className={STYLES_CTA}
          onClick={this._handleMultiplayerCodeUpload}
          style={{ marginRight: 16 }}>
          {isMultiplayerCodeUploadEnabled
            ? 'Disable multiplayer auto upload'
            : 'Enable multiplayer auto upload'}
        </span>
      );
    }

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <div className={STYLES_INFO_HEADING}>
          <div className={STYLES_INFO_HEADING_ROW} onClick={this._handleOpenGamePath}>
            <span className={STYLES_INFO_TEXT_TITLE}>Project URL</span>{' '}
            <span className={STYLES_INFO_TEXT_DESCRIPTION}>{this.props.game.url}</span>
          </div>
          {isMultiplayerCodeUploadEnabled ? (
            <div className={STYLES_INFO_TEXT}>
              <div className={STYLES_INFO_TEXT_TITLE}>Multiplayer auto upload is enabled</div>
              <div className={STYLES_INFO_TEXT_BODY}>
                When you Reload, Castle uploads a copy of your project's code to a temporary public
                url, and loads it from there.
              </div>
            </div>
          ) : null}
        </div>
        <div className={STYLES_LOGS}>
          <div className={STYLES_COL}>
            <div className={STYLES_SECTION_HEADER}>
              <div className={STYLES_HEADING_LEFT}>Local logs</div>
              <div className={STYLES_HEADING_RIGHT} style={{ minWidth: 100 }}>
                <span className={STYLES_CTA} onClick={this.props.setters.clearLogs}>
                  Clear
                </span>
              </div>
            </div>
            <div className={STYLES_SCROLL}>
              <DevelopmentLogs
                ref={(ref) => {
                  this._client = ref;
                }}
                logs={this.props.logs}
                onClearLogs={this.props.setters.clearLogs}
                game={this.props.game}
                logMode={0}
              />
            </div>
          </div>
          {isMultiplayer ? (
            <div
              className={`${STYLES_COL} ${STYLES_COL_RIGHT}`}
              style={{ width: this.state.server }}>
              <div
                className={STYLES_SECTION_HEADER}
                style={{
                  borderTop: `1px solid ${BORDER_COLOR}`,
                  borderBottom: 0,
                }}>
                <div className={STYLES_HEADING_LEFT}>Server logs</div>
                <div className={STYLES_HEADING_RIGHT} style={{ minWidth: 100 }}>
                  {maybeMultiplayerElement}
                  <span className={STYLES_CTA} onClick={this._handleServerLogReload}>
                    Reload
                  </span>
                </div>
              </div>
              <div className={STYLES_SCROLL}>
                <DevelopmentLogs
                  ref={(ref) => {
                    this._server = ref;
                  }}
                  logs={this.props.logs}
                  onClearLogs={this.props.setters.clearLogs}
                  game={this.props.game}
                  logMode={1}
                />
              </div>
            </div>
          ) : null}
          ;
        </div>
      </div>
    );
  }
}
