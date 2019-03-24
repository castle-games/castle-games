import { css } from 'react-emotion';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Utilities from '~/common/utilities';

const STYLES_BUTTON = css`
  font-family: ${Constants.font.heading};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  height: 40px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  border-radius: 4px;
  line-height: 16px;
  outline: 0;
  margin: 0;
  border: 0;
  cursor: pointer;
  font-weight: 400;
  user-select: none;
  transition: 200ms ease all;
  text-decoration: none;
  padding: 0 24px 0 24px;

  &:focus {
    outline: 0;
    border: 0;
  }
`;

export default class UIPlayTextCTA extends React.Component {
  render() {
    const textColor = Utilities.adjustTextColor(
      this.props.background ? this.props.background : `#000000`
    );

    const buttonBackground = Utilities.shadeHex(
      this.props.background ? this.props.background : `#000000`,
      -0.25
    );

    if (this.props.href) {
      return (
        <a
          href={this.props.href}
          style={{ ...this.props.style, color: textColor, backgroundColor: buttonBackground }}
          className={STYLES_BUTTON}>
          {this.props.children}
        </a>
      );
    }

    return (
      <button
        onClick={this.props.onClick}
        style={{ ...this.props.style, color: textColor, backgroundColor: buttonBackground }}
        className={STYLES_BUTTON}>
        {this.props.children}
      </button>
    );
  }
}
