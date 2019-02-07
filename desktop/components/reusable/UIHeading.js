import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_HEADING = css`
  color: ${Constants.colors.text};
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl3};
  margin-bottom: 16px;
`;

export default class UIHeading extends React.Component {
  render() {
    return (
      <div className={STYLES_HEADING} style={{ ...this.props.style }}>
        {this.props.children}
      </div>
    );
  }
};
