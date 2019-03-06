import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import UILogItem from '~/components/reusable/UILogItem';

const STYLES_FIXED_CONTAINER = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.white};
  color: ${Constants.colors.black};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_LOGS = css`
  padding: 16px 16px 16px 16px;
`;

const STYLES_LOG = css`
  font-family: ${Constants.font.mono};
  font-size: 10px;
  margin-bottom: 2px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_LOG_LEFT = css`
  flex-shrink: 0;
  text-transform: uppercase;
  padding-right: 24px;
`;

const STYLES_LOG_RIGHT = css`
  min-width: 25%;
  width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const STYLES_FIXED_HEADER = css`
  background: ${Constants.colors.white};
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const STYLES_SPACER = css`
  height: 24px;
`;

const STYLES_CONTROL = css`
  margin: 16px 16px 0 16px;
  letter-spacing: 0.2px;
  color: ${Constants.colors.action};
  font-family: ${Constants.font.mono};
  font-size: ${Constants.typescale.lvl7};
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const STYLES_CONTROL_SELECTED = css`
  margin: 16px 16px 0 16px;
  letter-spacing: 0.2px;
  color: ${Constants.colors.action};
  font-family: ${Constants.font.mono};
  font-size: ${Constants.typescale.lvl7};
  font-weight: 900;
  color: black;
  text-transform: uppercase;
  text-decoration: underline;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;

const LogMode = {
  LOCAL: 0,
  REMOTE: 1,
};

export default class DevelopmentLogs extends React.Component {
  _logs;
  _container;

  state = {
    logMode: LogMode.LOCAL,
    remoteLogs: [],
  };

  componentWillReceiveProps(nextProps) {
    const isBottom =
      this._container.scrollHeight - this._container.scrollTop === this._container.clientHeight;
    const newItems = nextProps.logs.length > this.props.logs.length;

    // NOTE(jim): Only scroll if you're at the bottom with new items.
    if (isBottom && newItems) {
      this.scroll();
    }
  }

  componentDidMount() {
    this.scroll();
  }

  scroll = () => {
    window.setTimeout(() => {
      this._logs.scrollIntoView(false);
    });
  };

  _getLogColor = (log) => {
    if (log.type === 'error') {
      return Constants.logs.error;
    } else if (log.type === 'system') {
      return Constants.logs.system;
    }
    return Constants.logs.default;
  };

  _onSelectLocal = () => {
    this.setState({
      logMode: LogMode.LOCAL,
    });
  };

  _onSelectRemote = () => {
    this._fetchRemoteLogsAsync();

    this.setState({
      logMode: LogMode.REMOTE,
    });
  };

  _fetchRemoteLogsAsync = async () => {
    this.setState({
      remoteLogs: [],
    });

    let { game } = this.props;
    try {
      let remoteLogs = await Actions.gameServerLogsAsync(game.gameId, game.entryPoint || game.url);
      if (remoteLogs) {
        this.setState({
          remoteLogs,
        });
      }
    } catch (e) {}
  };

  _renderLocalLogs = () => {
    return this.props.logs.map((l, i) => {
      return (
        <div
          className={STYLES_LOG}
          style={{ color: this._getLogColor(l) }}
          key={`development-log-${l.id}`}>
          <span className={STYLES_LOG_LEFT}>{l.type}</span>
          <div className={STYLES_LOG_RIGHT}>{l.details ? <UILogItem log={l} /> : l.text}</div>
        </div>
      );
    });
  };

  _renderRemoteLogs = () => {
    let logs = this.state.remoteLogs.map((l) => {
      let text = l.logs;
      try {
        if (text.charAt(0) == '[') {
          let json = JSON.parse(text);
          text = json.join(' ');
        }
      } catch (e) {}

      return (
        <div
          className={STYLES_LOG}
          style={{ color: l.is_lua ? Constants.logs.default : Constants.logs.system }}
          key={`remote-log-${l.id}`}>
          <span className={STYLES_LOG_LEFT}>
            {l.is_lua ? 'Lua' : 'System'} {l.timestamp}
          </span>
          <div className={STYLES_LOG_RIGHT}>{text}</div>
        </div>
      );
    });

    return [
      <div
        className={STYLES_LOG}
        style={{ color: Constants.logs.default, paddingBottom: '10px' }}
        key={`remote-log-warning}`}>
        Server logs are delayed by a few seconds. Please use the reload button to fetch the most up
        to date logs.
      </div>,
      ...logs,
    ];
  };

  render() {
    let { logMode } = this.state;

    return (
      <div className={STYLES_FIXED_CONTAINER}>
        <div className={STYLES_FIXED_HEADER}>
          <div
            className={logMode == LogMode.LOCAL ? STYLES_CONTROL_SELECTED : STYLES_CONTROL}
            onClick={this._onSelectLocal}>
            Local logs
          </div>
          <div
            className={logMode == LogMode.REMOTE ? STYLES_CONTROL_SELECTED : STYLES_CONTROL}
            onClick={this._onSelectRemote}>
            Game server logs
          </div>
          {logMode == LogMode.LOCAL && (
            <div className={STYLES_CONTROL} onClick={this.props.onClearLogs}>
              Clear local logs
            </div>
          )}
          {logMode == LogMode.REMOTE && (
            <div className={STYLES_CONTROL} onClick={this._fetchRemoteLogsAsync}>
              Reload server logs
            </div>
          )}
        </div>
        <div
          className={STYLES_CONTAINER}
          ref={(c) => {
            this._container = c;
          }}>
          <div className={STYLES_SPACER} />
          <div className={STYLES_LOGS}>
            {logMode == LogMode.LOCAL ? this._renderLocalLogs() : this._renderRemoteLogs()}
          </div>
          <div
            className={STYLES_SPACER}
            ref={(c) => {
              this._logs = c;
            }}
          />
        </div>
      </div>
    );
  }
}
