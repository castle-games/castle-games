import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTROL = css`
  flex-shrink: 0;
  margin-left: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${Constants.colors.white};
  border-radius: 4px;
  color: ${Constants.colors.black};
  height: 32px;
  width: 32px;
  transition: 200ms ease opacity;
  opacity: 1;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

export default class UIButtonSmallLight extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTROL} style={this.props.style} onClick={this.props.onClick}>
        {this.props.icon}
      </div>
    );
  }
}
