import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_ALERT = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  color: white;
  background: red;
`;

export default class GameScreenAlert extends React.Component {
  render() {
    return <div className={STYLES_ALERT}>{this.props.children}</div>;
  }
}
