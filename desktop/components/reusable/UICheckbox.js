import styled, { css } from 'react-emotion';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_LEFT = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding-right: 16px;
`;

const STYLES_RIGHT = css`
  display: inline-flex;
  min-width: 25%;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
`;

const STYLES_CHECKBOX = css`
  color: ${Constants.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  background: #000;
  border-radius: 4px;
`;

export default class UICheckbox extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <span className={STYLES_LEFT}>
          <span className={STYLES_CHECKBOX} onClick={this.props.onClick}>
            {this.props.value ? <SVG.Checkmark height="16px" /> : null}
          </span>
        </span>
        <span className={STYLES_RIGHT}>{this.props.children}</span>
      </div>
    );
  }
}
