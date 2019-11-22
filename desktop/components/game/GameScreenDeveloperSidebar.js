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
import GameEditorFileTree from '~/components/game/editor/GameEditorFileTree';
import GameEditorImagePreview from '~/components/game/editor/GameEditorImagePreview';
import GameEditorFontPreview from '~/components/game/editor/GameEditorFontPreview';
import GameEditorTab from '~/components/game/editor/GameEditorTab';

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
  height: 100%;
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
  height: 100%;
  display: flex;
  flex-direction: column;
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
  flex: 1;
`;

const STYLES_EDITOR_TABS = css`
  width: 100%;
  height: 30px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  border-bottom: 1px solid #555;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default class GameScreenDeveloperSidebar extends React.Component {
  _client;
  _server;
  _urlToRef = {};

  state = {
    server: 484,
    focusedTabUrl: 'local_logs',
    hoverTabUrl: null,
    hoverTabXUrl: null,
    scrollToTabUrl: null,
    tabs: [
      {
        url: 'local_logs',
        title: 'Local Logs',
      },
    ],
    dragTab: null,
  };

  _openTab = (url, title) => {
    let tabs = [...this.state.tabs];
    let foundTab = false;

    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].url === url) {
        foundTab = true;
        break;
      }
    }

    if (!foundTab) {
      tabs.push({
        url,
        title,
      });
    }

    this.setState({
      tabs,
      focusedTabUrl: url,
      scrollToTabUrl: url,
    });
  };

  _closeTab = (url) => {
    let oldTabs = this.state.tabs;
    let tabs = [];

    let fallbackTabUrl = null;
    let nextTabUrl = null;
    for (let i = 0; i < oldTabs.length; i++) {
      if (oldTabs[i].url === url) {
        if (i > 0) {
          fallbackTabUrl = oldTabs[i - 1].url;
        } else if (oldTabs.length > i + 1) {
          fallbackTabUrl = oldTabs[i + 1].url;
        }

        if (oldTabs.length > i + 1) {
          nextTabUrl = oldTabs[i + 1].url;
        }
      } else {
        tabs.push(oldTabs[i]);
      }
    }

    let { focusedTabUrl } = this.state;

    this.setState({
      hoverTabUrl: nextTabUrl,
      hoverTabXUrl: nextTabUrl,
      focusedTabUrl: focusedTabUrl === url ? fallbackTabUrl : focusedTabUrl,
      tabs,
    });
  };

  componentDidMount() {
    window.addEventListener('mouseup', this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
    window.addEventListener('keydown', this._handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
    window.removeEventListener('keydown', this._handleKeyDown);
    this.props.setters.setIsMultiplayerCodeUploadEnabled(false);
  }

  _handleMouseDown = (e, resizing) => {
    e.preventDefault();
    this.setState({ resizing, mouseY: e.pageY, start: this.state[resizing] });
  };

  _handleMouseMove = (e) => {
    if (this.state.dragTab) {
      let { tabs, focusedTabUrl } = this.state;

      let focusedTab = tabs.find((tab) => tab.url === focusedTabUrl);

      let newPosition = -1;
      for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i];
        let ref = this._urlToRef[tab.url];
        if (ref) {
          let rect = ref.getBoundingClientRect();
          if (e.pageX >= rect.left && e.pageX < rect.right) {
            newPosition = i;
            break;
          }
        }
      }

      if (newPosition >= 0) {
        tabs = tabs.filter((tab) => tab.url !== focusedTabUrl);
        tabs.splice(newPosition, 0, focusedTab);
      }

      this.setState({
        tabs,
        dragTab: {
          ...this.state.dragTab,
          pageX: e.pageX,
          pageY: e.pageY,
        },
      });
    }

    if (this.state.resizing) {
      const MIN_SIZE = 164;
      const START_HEIGHT = Window.getViewportSize().height * 0.5;
      const MAX_SIZE = Window.getViewportSize().height * 0.8;

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
    }
  };

  _handleMouseUp = (e) => {
    if (this.state.resizing) {
      this.setState({ resizing: null, mouseY: null, start: null });
    }
  };

  _handleKeyDown = (e) => {
    if (e.keyCode == 87 && e.metaKey) {
      // meta + w
      e.preventDefault();
      e.stopPropagation();

      let { tabs, focusedTabUrl } = this.state;

      if (focusedTabUrl) {
        tabs = tabs.filter((tab) => tab.url !== focusedTabUrl);

        this.setState({
          focusedTabUrl: null,
          tabs,
        });
      }
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
    const { focusedTabUrl } = this.state;

    if (!focusedTabUrl) {
      return null;
    } else if (focusedTabUrl === 'local_logs') {
      return this._renderLocalLogs();
    } else if (focusedTabUrl === 'server_logs') {
      return this._renderServerLogs();
    } else if (focusedTabUrl.startsWith('file:')) {
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
    this.props.navigator.softReloadGame();
  };

  _reloadGameDebounced = _.debounce(this._reloadGame, 1000);

  _renderCodeEditor = () => {
    const { focusedTabUrl } = this.state;
    let url = focusedTabUrl.substring('file:'.length);
    let file = this.props.editableFiles[url];
    let fileType = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

    let centeredContent = <div>Can't display this file type</div>;
    if (file.content) {
      centeredContent = (
        <DevelopmentCodeEditor
          key={url}
          value={file.content}
          onChange={(value) => {
            this.props.editFile(url, value);
            // This temporarily makes it readonly
            // this._reloadGameDebounced();
          }}
        />
      );
    } else if (fileType === 'mp3') {
      centeredContent = (
        <audio key={url} controls controlsList="nodownload">
          <source src={url} type="audio/mpeg"></source>
        </audio>
      );
    } else if (fileType === 'wav') {
      centeredContent = (
        <audio key={url} controls controlsList="nodownload">
          <source src={url} type="audio/wav"></source>
        </audio>
      );
    } else if (fileType === 'ogg') {
      centeredContent = (
        <audio key={url} controls controlsList="nodownload">
          <source src={url} type="audio/ogg"></source>
        </audio>
      );
    } else if (
      fileType === 'png' ||
      fileType === 'jpg' ||
      fileType === 'gif' ||
      url.startsWith('https://d1vkcv80qw9qqp') // assets cdn url
    ) {
      centeredContent = (
        <GameEditorImagePreview
          key={url}
          url={url}
          style={{
            flex: '1',
            height: '100%',
          }}
        />
      );
    } else if (fileType === 'ttf' || fileType === '.otf') {
      centeredContent = (
        <GameEditorFontPreview
          key={url}
          url={url}
          style={{
            padding: 20,
            fontFamily: 'GameTextEditorFontFamily',
            fontSize: 30,
          }}
        />
      );
    }

    return <div className={STYLES_EDITOR_INNER}>{centeredContent}</div>;
  };

  _tabsContainerRefFn = (ref) => {
    this._tabsContainerRef = ref;
  };

  render() {
    const { game, editableFiles, isMultiplayerCodeUploadEnabled } = this.props;
    const { tabs, focusedTabUrl, hoverTabUrl, hoverTabXUrl, dragTab } = this.state;

    const isMultiplayer = Utilities.isMultiplayer(this.props.game);

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
            <div style={{ paddingTop: 10 }}>Logs:</div>
            <div
              className={STYLES_PICKER_SELECTION}
              onClick={() => {
                this._openTab('local_logs', 'Local Logs');
              }}>
              Local logs
            </div>
            {isMultiplayer && (
              <div
                className={STYLES_PICKER_SELECTION}
                onClick={() => {
                  this._openTab('server_logs', 'Server Logs');
                }}>
                Server logs
              </div>
            )}

            <div style={{ paddingTop: 10 }}>Files:</div>
            <GameEditorFileTree game={game} editableFiles={editableFiles} openTab={this._openTab} />
          </div>
          <div className={STYLES_EDITOR_CONTENT}>
            <div ref={this._tabsContainerRefFn} className={STYLES_EDITOR_TABS}>
              {tabs.map((tab) => {
                return (
                  <GameEditorTab
                    key={tab.url}
                    title={tab.title}
                    isFocused={tab.url === focusedTabUrl}
                    isHover={tab.url === hoverTabUrl}
                    isHoverCloseButton={tab.url === hoverTabXUrl}
                    closeTab={() => this._closeTab(tab.url)}
                    componentRef={(ref) => {
                      this._urlToRef[tab.url] = ref;

                      if (ref && this._tabsContainerRef && this.state.scrollToTabUrl === tab.url) {
                        let scrollLeft = this._tabsContainerRef.scrollLeft;
                        let containerWidth = this._tabsContainerRef.getBoundingClientRect().width;
                        let elementWidth = ref.getBoundingClientRect().width;
                        let elementPositionX = ref.offsetLeft - this._tabsContainerRef.offsetLeft;

                        if (
                          elementPositionX < scrollLeft ||
                          elementPositionX + elementWidth - scrollLeft > containerWidth
                        ) {
                          this._tabsContainerRef.scrollTo(elementPositionX, 0);
                        }

                        this.setState({
                          scrollToTabUrl: null,
                        });
                      }
                    }}
                    onMouseDown={(e) => {
                      let rect = e.target.getBoundingClientRect();
                      let elementX = e.clientX - rect.left;
                      let elementY = e.clientY - rect.top;

                      this.setState({
                        focusedTabUrl: tab.url,
                        dragTab: {
                          ...tab,
                          elementX,
                          elementY,
                          pageX: e.pageX,
                          pageY: e.pageY,
                        },
                      });
                    }}
                    onMouseUp={() => {
                      this.setState({
                        dragTab: null,
                      });
                    }}
                    onMouseEnter={() => {
                      this.setState({
                        hoverTabUrl: tab.url,
                      });
                    }}
                    onMouseLeave={() => {
                      this.setState({
                        hoverTabUrl: null,
                      });
                    }}
                    onMouseEnterCloseButton={() => {
                      this.setState({
                        hoverTabXUrl: tab.url,
                      });
                    }}
                    onMouseLeaveCloseButton={() => {
                      this.setState({
                        hoverTabXUrl: null,
                      });
                    }}
                    style={{ backgroundColor: tab.url === focusedTabUrl ? '#333333' : '#000000' }}
                  />
                );
              })}

              {dragTab && (
                <GameEditorTab
                  key="drag-tab"
                  title={dragTab.title}
                  isFocused={true}
                  isHover={false}
                  isHoverCloseButton={false}
                  onMouseUp={() => {
                    this.setState({
                      dragTab: null,
                    });
                  }}
                  style={{
                    position: 'fixed',
                    zIndex: 10,
                    left: dragTab.pageX - dragTab.elementX,
                    top: dragTab.pageY - dragTab.elementY,
                    backgroundColor: '#333333',
                    opacity: 0.8,
                    overflowY: 'hidden',
                  }}
                />
              )}
            </div>
            {this._renderEditorContent()}
          </div>
        </div>
      </div>
    );
  }
}
