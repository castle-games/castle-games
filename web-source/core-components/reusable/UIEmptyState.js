import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  padding: 16px;
`;

const STYLES_HEADER = css`
  font-weight: 600;
  font-size: 14px;
  padding-bottom: 8px;
  color: ${Constants.colors.white80};
  border-bottom: 1px solid ${Constants.colors.black30};
  margin-bottom: 8px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.white80};
  font-size: 12px;
  line-height: 1.5;
`;

export default class UIEmptyState extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style} onClick={this.props.onClick}>
        <div className={STYLES_HEADER}>{this.props.title}</div>
        <div className={STYLES_PARAGRAPH}>{this.props.children}</div>
      </div>
    );
  }
}
