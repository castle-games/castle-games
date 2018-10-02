import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css``;

const STYLES_HEADER = css`
  font-weight: 600;
  font-size: 22px;
  padding-bottom: 8px;
  color: ${Constants.brand.line};
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.brand.line};
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 24px;
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
