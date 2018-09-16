import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  padding: 16px;
  border-radius: 4px;
  background: ${Constants.colors.white25};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  margin-right: 16px;
  cursor: pointer;
`;

const STYLES_TOP = css`
  font-size: 24px;
  font-weight: 600;
`;

const STYLES_BOTTOM = css`
  font-size: 10px;
  margin-top: 8px;
  font-weight: 600;
`;

export default class UIStat extends React.Component {
  render() {
    return (
      <span className={STYLES_CONTAINER} onClick={this.props.onClick} style={this.props.style}>
        <div className={STYLES_TOP}>{this.props.value}</div>
        <div className={STYLES_BOTTOM}>{this.props.children}</div>
      </span>
    );
  }
}
