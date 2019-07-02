import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import UIMessageBody from '~/components/reusable/UIMessageBody';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 16px 24px 0 16px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 40px;
  width: 40px;
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
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
  line-height: 10px;
  display: inline-block;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  margin-top: 2px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

export default class ChatMessageElement extends React.Component {
  static defaultProps = {
    user: {
      name: 'Anonymous',
      photo: {
        url: null,
      },
    },
    theme: {
      textColor: null,
    },
  };

  render() {
    const { message } = this.props;
    let isEmojiMessage = this.props.message.isEmojiMessage;

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <span
          className={STYLES_LEFT}
          onClick={
            this.props.user.username
              ? () => this.props.onNavigateToUserProfile(this.props.user)
              : () => {}
          }
          style={{
            backgroundImage: this.props.user ? `url(${this.props.user.photo.url})` : ``,
            width: this.props.size,
            height: this.props.size,
          }}
        />
        <span className={STYLES_RIGHT}>
          <div
            className={STYLES_AUTHOR_NAME}
            style={{ color: this.props.theme.textColor }}
            onClick={
              this.props.user.username
                ? () => this.props.onNavigateToUserProfile(this.props.user)
                : () => {}
            }>
            {Strings.getPresentationName(this.props.user)}
            <span className={STYLES_TIMESTAMP}>
              {Strings.toChatDate(this.props.message.timestamp)}
            </span>
          </div>
          <div
            className={STYLES_AUTHOR_MESSAGE}
            style={{
              color: this.props.theme.textColor,
              fontSize: isEmojiMessage ? '40px' : null,
              lineHeight: isEmojiMessage ? '48px' : null,
            }}>
            <UIMessageBody body={message.body} />
          </div>
        </span>
      </div>
    );
  }
}
