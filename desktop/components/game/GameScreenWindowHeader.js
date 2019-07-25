import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  height: 24px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  color: #222;
  font-size: 12px;
`;

export default class GameScreenWindowHeader extends React.Component {
  render() {
    return <header className={STYLES_HEADER}>{this.props.children}</header>;
  }
}
