import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: green;
`;

export default class GameScreenMedia extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER}>&nbsp;</div>;
  }
}
