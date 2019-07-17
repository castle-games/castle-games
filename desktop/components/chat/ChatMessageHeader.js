import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

const STYLES_AUTHOR_TIMESTAMP = css`
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_AUTHOR = css`
  cursor: pointer;
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
  line-height: 12px;
  display: inline-block;
  cursor: default;
`;

export default class ChatMessageHeader extends React.Component {
  static defaultProps = {
    author: null,
    timestamp: null,
    theme: {},
    onClick: null,
  };

  render() {
    return (
      <div className={STYLES_AUTHOR_TIMESTAMP} style={{ color: this.props.theme.textColor }}>
        <span className={STYLES_AUTHOR} onClick={this.props.onClick}>
          {this.props.author}
        </span>
        <span className={STYLES_TIMESTAMP}>{Strings.toChatTime(this.props.timestamp)}</span>
      </div>
    );
  }
}
