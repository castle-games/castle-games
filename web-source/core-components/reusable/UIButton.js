import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  background: ${Constants.brand.line};
  color: ${Constants.brand.background};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0);
  transition: 200ms ease all;
  border-radius: 4px;
  font-weight: 600;
  height: 48px;
  padding: 0 24px 0 24px;
  outline: 0;
  border: 0;
  font-size: 16px;
  cursor: pointer;

  :focus {
    outline: 0;
    border: 0;
  }

  :hover {
    background: ${Constants.colors.black};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
`;

export default class UIButton extends React.Component {
  render() {
    return (
      <button className={STYLES_BUTTON} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}
