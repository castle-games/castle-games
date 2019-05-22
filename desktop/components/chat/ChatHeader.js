import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 64px;
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  flex-shrink: 0;
  width: 100%;
`;

export default class ChatHeader extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER}>ChatHeader</div>;
  }
}
