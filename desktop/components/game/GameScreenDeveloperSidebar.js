import * as React from 'react';
import * as Window from '~/common/window';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Utilities from '~/common/utilities';
import * as URLS from '~/common/urls';

import { css } from 'react-emotion';
import _ from 'lodash';

import DevelopmentLogs from '~/components/game/DevelopmentLogs';
import DevelopmentCodeEditor from '~/components/game/DevelopmentCodeEditor';

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

const STYLES_EDITOR = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const STYLES_PICKER = css`
  width: 15%;
  border-right: 1px solid ${BORDER_COLOR};
  color: #fff;
  font-size: 11px;
  overflow-y: scroll;
`;

const STYLES_PICKER_SELECTION = css`
  padding: 10px 0px 0px 10px;
  cursor: pointer;
`;

const STYLES_EDITOR_CONTENT = css`
  width: 85%;
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
  flex-shrink: 0;
  word-break: break-word;
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

const STYLES_EDITOR_INNER = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

export default class GameScreenDeveloperSidebar extends React.Component {
  _client;
  _server;

  state = {
    server: 484,
    pickerSelection: 'local_logs',
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

  _renderEditorContent = () => {
    const { pickerSelection } = this.state;

    if (pickerSelection === 'local_logs') {
      return this._renderLocalLogs();
    } else if (pickerSelection === 'server_logs') {
      return this._renderServerLogs();
    } else if (pickerSelection.startsWith('file:')) {
      return this._renderCodeEditor();
    } else {
      return null;
    }
  };

  _renderLocalLogs = () => {
    return (
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
              key={'local_logs'}
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
      </div>
    );
  };

  _renderServerLogs = () => {
    let maybeMultiplayerElement;
    if (URLS.isPrivateUrl(this.props.game.url)) {
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
      <div className={STYLES_LOGS}>
        <div className={STYLES_COL}>
          <div className={STYLES_SECTION_HEADER}>
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
              key={'server_logs'}
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
      </div>
    );
  };

  _reloadGame = () => {
    window.dispatchEvent(new Event('CASTLE_RELOAD_GAME'));
  };

  _reloadGameDebounced = _.debounce(this._reloadGame, 1000);

  _renderCodeEditor = () => {
    const { pickerSelection } = this.state;
    let url = pickerSelection.substring('file:'.length);
    let file = this.props.editableFiles[url];

    let centeredContent = <div>Don't know how to display this file type</div>;
    if (file.content) {
      centeredContent = (
        <DevelopmentCodeEditor
          key={url}
          value={file.content}
          onChange={(value) => {
            this.props.editFile(url, value);
            this._reloadGameDebounced();
          }}
        />
      );
    } else if (url.endsWith('.mp3')) {
      centeredContent = (
        <audio key={url} controls>
          <source src={url} type="audio/mpeg"></source>
        </audio>
      );
    } else if (url.endsWith('.wav')) {
      centeredContent = (
        <audio key={url} controls>
          <source src={url} type="audio/wav"></source>
        </audio>
      );
    } else if (url.endsWith('.png') || url.endsWith('.jpg')) {
      centeredContent = (
        <img key={url} src={url} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      );
    }

    return <div className={STYLES_EDITOR_INNER}>{centeredContent}</div>;
  };

  render() {
    const { isMultiplayerCodeUploadEnabled, game } = this.props;
    const isMultiplayer = Utilities.isMultiplayer(this.props.game);
    const baseUrl = game.entryPoint.substring(0, game.entryPoint.lastIndexOf('/') + 1);

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

        <div className={STYLES_EDITOR}>
          <div className={STYLES_PICKER}>
            <div
              className={STYLES_PICKER_SELECTION}
              onClick={() => {
                this.setState({ pickerSelection: 'local_logs' });
              }}>
              Local logs
            </div>
            {isMultiplayer && (
              <div
                className={STYLES_PICKER_SELECTION}
                onClick={() => {
                  this.setState({ pickerSelection: 'server_logs' });
                }}>
                Server logs
              </div>
            )}

            <div style={{ paddingTop: 10 }}>Files:</div>
            {Object.keys(this.props.editableFiles)
              .sort()
              .map((url) => {
                let displayFilename = this.props.editableFiles[url].filename;
                if (displayFilename.startsWith(baseUrl)) {
                  displayFilename = displayFilename.substring(baseUrl.length);
                }

                return (
                  <div
                    className={STYLES_PICKER_SELECTION}
                    onClick={() => {
                      this.setState({ pickerSelection: `file:${url}` });
                    }}>
                    {displayFilename}
                  </div>
                );
              })}
          </div>
          <div className={STYLES_EDITOR_CONTENT}>{this._renderEditorContent()}</div>
        </div>
      </div>
    );
  }
}
