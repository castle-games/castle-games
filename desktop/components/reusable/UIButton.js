import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  font-size: ${Constants.typescale.lvl6};
  font-family: ${Constants.font.system};
  background: ${Constants.colors.black};
  display: inline-flex;
  border-radius: 4px;
  height: 48px;
  text-align: center;
  padding: 0 24px 0 24px;
  outline: 0;
  border: 0;
  font-weight: 700;
  opacity: 1;

  :enabled {
    color: ${Constants.colors.white};
    cursor: pointer;
  }

  :disabled {
    color: ${Constants.colors.background};
    background: ${Constants.colors.background4};
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
