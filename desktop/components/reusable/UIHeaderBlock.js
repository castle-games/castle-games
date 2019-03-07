import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  height: 32px;
  width: 100%;
  background: #2b2828;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 0 8px 0 8px;
  border-top: 1px solid #595555;
`;

export default class UIHeaderBlock extends React.Component {
  render() {
    return (
      <span className={STYLES_HEADER} style={this.props.style} onClick={this.props.onClick}>
        {this.props.children}
      </span>
    );
  }
}
