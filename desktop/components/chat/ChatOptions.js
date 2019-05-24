import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 100%;
  min-height: 25%;
  width: 100%;
  overflow-y: scroll;
  overflow-wrap: break-word;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default class ChatOptions extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER}>Chat options appear here.</div>;
  }
}
