import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTROL = css`
  flex-shrink: 0;
  margin-left: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: ${Constants.colors.white};
  border-radius: 4px;
  color: ${Constants.colors.black};
  height: 32px;
  padding: 0 16px 0 16px;
  font-size: 12px;
  transition: 200ms ease opacity;
  opacity: 1;
  cursor: pointer;
  user-select: none;

  :hover {
    opacity: 0.8;
  }
`;

export default class UINotice extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTROL} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}
