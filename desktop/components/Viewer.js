import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  font-size: 8pt;
  color: ${Constants.colors.white};
  width: 36px;
  height: 36px;
  margin: 6px 8px 0 8px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default class Viewer extends React.Component {
  render() {
    const name = (this.props.viewer) ? this.props.viewer.username : 'Sign In';
    return (
      <div
        className={STYLES_CONTAINER}
        onClick={this.props.onClick}>
        {name}
      </div>
    );
  }
}
