import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';

import UILogItem from '~/components/reusable/UILogItem';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_FIXED_CONTAINER = css`
  color: ${Constants.colors.white};
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #020202;
`;

const STYLES_SCROLLING_LOGS = css`
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 8px;
    height: 100%;
  }

  ::-webkit-scrollbar-track {
    background: black;
  }

  ::-webkit-scrollbar-thumb {
    background: white;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: magenta;
  }
`;

const STYLES_LOGS = css`
  padding: 8px 16px 0 16px;
`;

const STYLES_LOG = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.white};
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
  min-width: 64px;
`;

const STYLES_LOG_RIGHT = css`
  min-width: 25%;
  width: 100%;
  white-space: pre-wrap;
  overflow-wrap: break-word;
`;

const STYLES_MODE_SELECTOR = css`
  background: ${Constants.colors.backgroundNavigation};
  height: 32px;
  flex-shrink: 0;
`;

const STYLES_SPACER = css`
  height: 8px;
`;

const STYLES_ACTIONS = css`
  display: flex;
  align-items: center;
  padding: 8px 24px 12px 24px;
`;

const LogMode = {
  LOCAL: 0,
  REMOTE: 1,
};

export default class DevelopmentLogs extends React.Component {
  _logs;
  _scrollView;

  state = {
    logMode: this.props.logMode,
    remoteLogs: [],
  };

  componentWillReceiveProps(nextProps) {
    // NOTE(jim): We give some offset to not force the scroll position to be perfect.
    const isBottom =
      this._scrollView.scrollHeight - this._scrollView.scrollTop - 48 <=
      this._scrollView.clientHeight;
    const newItems = nextProps.logs.length > this.props.logs.length;

    // NOTE(jim): Only scroll if you're at the bottom with new items.
    if (isBottom && newItems) {
      this.scroll();
    }
  }

  async componentDidMount() {
    this.scroll();

    if (this.props.logMode === LogMode.REMOTE) {
      await this._fetchRemoteLogsAsync();
    }
  }

  scroll = () => {
    window.setTimeout(() => {
      // NOTE(jim): Noop if component is not mounted.
      if (!this._logs) {
        return;
      }

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

  _fetchRemoteLogsAsync = async () => {
    this.setState({
      remoteLogs: [],
    });

    let { game } = this.props;
    try {
      let remoteLogs = await Actions.gameServerLogsAsync(
        game.gameId,
        game.hostedUrl || game.url,
        null
      );
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
          <span className={STYLES_LOG_LEFT}>{l.is_lua ? 'Print' : 'System'}</span>
          <div className={STYLES_LOG_RIGHT}>
            {l.timestamp} {text}
          </div>
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
        <div
          className={STYLES_SCROLLING_LOGS}
          ref={(c) => {
            this._scrollView = c;
          }}>
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
