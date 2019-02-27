import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  background: ${Constants.colors.background};
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class NotificationScreen extends React.Component {
  render() {
    return <div className={STYLES_CONTAINER} />;
  }
}
