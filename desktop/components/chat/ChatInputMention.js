import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 4px 8px 4px 8px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 20px;
  width: 20px;
  background-color: #f3f3f3;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_RIGHT = css`
  padding-left: 6px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_NAME = css`
  cursor: pointer;
  line-height: 20px;
  font-size: 14px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

export default class ChatInputMention extends React.Component {
  render() {
    return (
      <div
        className={STYLES_CONTAINER}
        onClick={this.props.onClick}
        style={{ backgroundColor: this.props.isSelected ? `magenta` : null }}>
        <span
          className={STYLES_LEFT}
          style={{ backgroundImage: this.props.user ? `url(${this.props.user.photo.url})` : `` }}
        />
        <span className={STYLES_RIGHT}>
          <div className={STYLES_AUTHOR_NAME}>{Strings.getPresentationName(this.props.user)}</div>
        </span>
      </div>
    );
  }
}
