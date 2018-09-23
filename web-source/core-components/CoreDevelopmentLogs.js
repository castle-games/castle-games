import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_FIXED_CONTAINER = css`
  position: relative;
  width: 420px;
  height: 100%;
  border-left: 1px solid ${Constants.colors.white25};
`;

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-top: 48px;
  background ${Constants.colors.black};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    width: 1px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${Constants.colors.black20};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${Constants.colors.black};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${Constants.colors.black};
  }
`;

const STYLES_LOGS = css`
  padding: 16px 16px 16px 16px;
`;

const STYLES_LOG = css`
  font-family: 'Monaco', mono;
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
  background: ${Constants.colors.black};
  opacity: 0.8;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

export default class CoreDevelopmentLogs extends React.Component {
  _logs;

  componentWillReceiveProps(nextProps) {
    // NOTE(jim): Only do this if you're at the bottom.
    // Only do this if the length is different.
    /*
    if (this._logs.length) {
      this._logs.scrollIntoView({});
    }
    */
  }

  componentDidMount() {
    this._logs.scrollIntoView({});
  }

  render() {
    return (
      <div className={STYLES_FIXED_CONTAINER}>
        <div className={STYLES_FIXED_HEADER}>
          <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        </div>
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_LOGS}>
            {this.props.logs.map((l, i) => {
              return (
                <div className={STYLES_LOG} key={`development-log-${l.id}`}>
                  <span className={STYLES_LOG_LEFT}>{l.type}</span>
                  <span className={STYLES_LOG_RIGHT}>{l.text}</span>
                </div>
              );
            })}
          </div>
          <div
            ref={c => {
              this._logs = c;
            }}
          />
        </div>
      </div>
    );
  }
}
