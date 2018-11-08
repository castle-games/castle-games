import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  background: ${Constants.colors.black};
  text-transform: uppercase;
  transition: 200ms ease all;
  border-radius: 4px;
  font-weight: 600;
  height: 34px;
  text-align: center;
  padding: 0 24px 0 24px;
  outline: 0;
  border: 0;
  font-size: 12px;
  opacity: 1;

  :enabled {
    color: ${Constants.colors.white};
    box-shadow: 0 0 0 3px ${Constants.colors.yellow};
    cursor: pointer;
  }

  :disabled {
    color: ${Constants.colors.white30};
    box-shadow: 0 0 0 1px ${Constants.colors.white30};
  }
`;

export default class UIButton extends React.Component {
  static defaultProps = {
    type: 'submit',
  };

  render() {
    return (
      <input
        className={STYLES_BUTTON}
        type={this.props.type}
        style={this.props.style}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        value={this.props.value ? this.props.value : this.props.children}
      />
    );
  }
}
