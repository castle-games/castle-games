import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTROL = css`
  display: flex;
  padding: 8px;
  width: 56px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${Constants.colors.white};
  opacity: 1;
  transition: 200ms ease all;
  cursor: pointer;
  user-select: none;

  :hover {
    opacity: 0.9;
  }
`;

const STYLES_ICON = css`
  height: 40px;
  width: 40px;
  background: #222222;
  background: -webkit-linear-gradient(
    45deg,
    rgba(18, 18, 18, 1) 0%,
    rgba(24, 24, 24, 1) 35%,
    rgba(44, 44, 44, 1) 100%
  );
  margin-bottom: 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${Constants.colors.white10};
  border-bottom: 1px solid #131313;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  background-position: 50% 50%;
  background-size: cover;
`;

const STYLES_TEXT = css`
  text-transform: uppercase;
  font-family: ${Constants.font.default};
  font-size: 8px;
  letter-spacing: 0.2px;
  font-weight: 500;
  width: 100%;
  white-space: nowrap;
  text-align: center;
`;

export default class UIButtonIcon extends React.Component {
  render() {
    return (
      <span className={STYLES_CONTROL} onClick={this.props.onClick}>
        <div
          className={STYLES_ICON}
          style={{
            boxShadow: this.props.active ? `0 0 0 3px ${Constants.colors.white}` : null,
          }}>
          {!this.props.src ? this.props.icon : null}
        </div>
        <div className={STYLES_TEXT}>{this.props.children}</div>
      </span>
    );
  }
}
