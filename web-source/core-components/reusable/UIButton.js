import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  background: ${Constants.brand.line};
  color: ${Constants.brand.background};
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
