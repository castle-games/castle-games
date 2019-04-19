import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_LOG = css`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  cursor: pointer;
`;

const STYLES_DETAIL = css`
  color: ${Constants.colors.white80};
`;

const STYLES_EXPAND = css`
  font-family: ${Constants.font.default};
  color: ${Constants.colors.white};
  font-weight: 600;
  margin-top: 2px;
  font-size: 10px;
  display: flex;
  justify-content: flex-end;
  text-transform: uppercase;
`;

export default class UILogItem extends React.Component {
  state = {
    expanded: false,
  };

  _onClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { log } = this.props;
    let maybeDetailsElement;
    if (log.details) {
      if (this.state.expanded) {
        maybeDetailsElement = <div className={STYLES_DETAIL}>{log.details}</div>;
      } else {
        maybeDetailsElement = (
          <div className={STYLES_EXPAND}>
            <span>...</span>
          </div>
        );
      }
    }
    return (
      <div className={STYLES_LOG} onClick={this._onClick}>
        <div>{log.text}</div>
        {maybeDetailsElement}
      </div>
    );
  }
}
