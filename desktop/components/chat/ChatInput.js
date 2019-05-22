import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 64px;
  background: red;
  flex-shrink: 0;
  width: 100%;
`;

export default class ChatInput extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER}>ChatInput</div>;
  }
}
