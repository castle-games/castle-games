import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0);
  transition: 200ms ease all;
  border-radius: 4px;
  font-weight: 600;
  height: 48px;
  width: 100%;
  text-align: center;
  padding: 0 24px 0 24px;
  outline: 0;
  border: 0;
  font-size: 16px;
  cursor: pointer;
  opacity: 1;

  :focus {
    outline: 0;
    border: 0;
    box-shadow: 0 1px 2px ${Constants.colors.blue};
  }

  :hover {
    opacity: 0.9;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
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
        value={this.props.value ? this.props.value : this.props.children}
      />
    );
  }
}