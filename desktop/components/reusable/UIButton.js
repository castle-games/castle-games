import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  display: inline-flex;
  background: ${Constants.colors.black};
  color: ${Constants.colors.white};
  border-radius: 4px;
  height: 48px;
  text-align: center;
  padding: 0 24px 0 24px;
  outline: 0;
  border: 0;
  font-size: ${Constants.typescale.lvl6};
  font-family: ${Constants.font.system};
  font-weight: 700;
  cursor: pointer;
  opacity: 1;
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
        value={this.props.value ? this.props.value : this.props.children}
      />
    );
  }
}
