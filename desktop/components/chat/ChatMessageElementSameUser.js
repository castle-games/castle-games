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
  padding: 0 24px 0px 16px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 1px;
  width: 40px;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_RIGHT = css`
  padding-left: 6px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  margin-top: 0;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

export default class ChatMessageElement extends React.Component {
  static defaultProps = {
    theme: {
      textColor: null,
    },
  };

  render() {
    const { message, isEmojiMessage } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <span
          className={STYLES_LEFT}
          style={{
            width: this.props.size,
            height: this.props.size,
          }}
        />
        <span className={STYLES_RIGHT}>
          <div
            className={STYLES_AUTHOR_MESSAGE}
            style={{
              color: this.props.theme.textColor,
              fontSize: isEmojiMessage ? '40px' : null,
              lineHeight: isEmojiMessage ? '48px' : null,
            }}>
            <UIMessageBody body={message.body} theme={this.props.theme} />
          </div>
        </span>
      </div>
    );
  }
}
