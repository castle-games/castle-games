import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTROL = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${Constants.colors.white};
  border-left: 2px solid ${Constants.brand.line};
  border-top: 2px solid ${Constants.brand.line};
  border-bottom: 2px solid ${Constants.brand.line};
  background: ${Constants.colors.foreground};
  height: 32px;
  width: 32px;
  transition: 200ms ease opacity;
  opacity: 1;
  cursor: pointer;

  :first-child {
    border-radius: 4px 0 0 4px;
  }

  :last-child {
    border-radius: 0px 4px 4px 0px;
    border-right: 2px solid ${Constants.brand.line};
  }

  :first-child:last-child {
    border-radius: 4px;
  }

  :hover {
    opacity: 0.8;
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
