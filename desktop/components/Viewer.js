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
`;

export default class Viewer extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        Me
      </div>
    );
  }
}
