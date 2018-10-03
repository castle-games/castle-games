import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_BUTTON = css`
  background: ${Constants.brand.background};
  color: ${Constants.brand.line};
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

export default class UIButtonSecondary extends React.Component {
  render() {
    return (
      <button className={STYLES_BUTTON} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    );
  }
}
