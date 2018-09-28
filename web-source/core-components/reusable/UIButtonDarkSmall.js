import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTROL = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${Constants.colors.white};
  border-left: 1px solid ${Constants.colors.border};
  border-top: 1px solid ${Constants.colors.border};
  border-bottom: 1px solid ${Constants.colors.border};
  background: ${Constants.colors.foreground};
  height: 32px;
  width: 32px;
  transition: 200ms ease opacity;
  opacity: 1;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :last-child {
    border-right: 1px solid ${Constants.colors.border};
  }
`;

export default class UIButtonDarkSmall extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTROL} style={this.props.style} onClick={this.props.onClick}>
        {this.props.icon}
      </div>
    );
  }
}
