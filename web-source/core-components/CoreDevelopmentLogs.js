import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Window from '~/common/window';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_FIXED_CONTAINER = css`
  position: relative;
  width: 420px;
  height: 100%;
  border-left: 1px solid ${Constants.colors.border};
`;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

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
  background: ${Constants.colors.background};
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const STYLES_SPACER = css`
  height: 48px;
`;

export default class CoreDevelopmentLogs extends React.Component {
  _logs;
  _container;

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

  render() {
    return (
      <div className={STYLES_FIXED_CONTAINER}>
        <div className={STYLES_FIXED_HEADER}>
          <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        </div>
        <div
          className={STYLES_CONTAINER}
          ref={c => {
            this._container = c;
          }}>
          <div className={STYLES_SPACER} />
          <div className={STYLES_LOGS}>
            {this.props.logs.map((l, i) => {
              return (
                <div
                  className={STYLES_LOG}
                  style={{ color: l.type === 'error' ? Constants.colors.red : null }}
                  key={`development-log-${l.id}`}>
                  <span className={STYLES_LOG_LEFT}>{l.type}</span>
                  <span className={STYLES_LOG_RIGHT}>{l.text}</span>
                </div>
              );
            })}
          </div>
          <div
            className={STYLES_SPACER}
            ref={c => {
              this._logs = c;
            }}
          />
        </div>
      </div>
    );
  }
}
