import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_NAV_ITEM = css`
  flex-shrink: 0;
  display: inline-flex;
  user-select: none;
  font-family: ${Constants.font.system};
  text-transform: uppercase;
  font-size: 11px;
  line-height: 10px;
  letter-spacing: 0.1px;
  color: ${Constants.colors.white};
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  transition: 200ms ease;

  :hover {
    color: ${Constants.colors.brand2};
  }
`;

export default class UINavigationLink extends React.Component {
  render() {
    return (
      <span className={STYLES_NAV_ITEM} style={this.props.style} onClick={this.props.onClick}>
        {this.props.children}
      </span>
    );
  }
}
