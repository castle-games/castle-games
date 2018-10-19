import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.white};
  margin-bottom: 24px;
`;

const STYLES_HEADER = css`
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.2px;
  padding-bottom: 8px;
`;

const STYLES_PARAGRAPH = css`
  font-size: 14px;
  font-weight: 200;
  line-height: 1.725;
`;

export default class UIHeadingGroup extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style} onClick={this.props.onClick}>
        <div className={STYLES_HEADER}>{this.props.title}</div>
        <div className={STYLES_PARAGRAPH}>{this.props.children}</div>
      </div>
    );
  }
}
