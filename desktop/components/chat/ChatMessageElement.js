import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';
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

const STYLES_RIGHT = css`
  padding-left: 8px;
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
  line-height: 12px;
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
    const { message, isEmojiMessage } = this.props;
    const size = this.props.size ? this.props.size : 40;

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <UIAvatar
          onClick={() => this.props.onNavigateToUserProfile(this.props.user)}
          style={{ width: size, height: size }}
          showIndicator={false}
          src={this.props.user.photo ? this.props.user.photo.url : null}
        />
        <span className={STYLES_RIGHT}>
          <div
            className={STYLES_AUTHOR_NAME}
            style={{ color: this.props.theme.textColor }}
            onClick={() => this.props.onNavigateToUserProfile(this.props.user)}>
            {this.props.user.username}
            <span className={STYLES_TIMESTAMP}>
              {Strings.toChatTime(this.props.message.timestamp)}
            </span>
          </div>
          <div
            className={STYLES_AUTHOR_MESSAGE}
            style={{
              color: this.props.theme.textColor,
              fontSize: isEmojiMessage ? '40px' : null,
              lineHeight: isEmojiMessage ? '48px' : null,
            }}>
            <UIMessageBody
              body={message.body}
              theme={this.props.theme}
              expandAttachments={this.props.expandAttachments}
            />
          </div>
        </span>
      </div>
    );
  }
}
