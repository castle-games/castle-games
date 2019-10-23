import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import UIMessageBody from '~/components/reusable/UIMessageBody';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 4px 24px 4px 0;
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 20px;
  width: 20px;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  height: 1px;
  width: 40px;
`;

const STYLES_RIGHT = css`
  padding-left: 8px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 20px;
  font-size: 12px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-style: italic;
  color: ${Constants.REFACTOR_COLORS.subdued};
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: ${Constants.font.castle};
  display: flex;
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
    const size = this.props.size ? this.props.size : 40;

    return (
      <div className={STYLES_CONTAINER}>
        <span className={STYLES_LEFT} />
        <span className={STYLES_RIGHT}>
          <div className={STYLES_AUTHOR_MESSAGE} style={{ color: this.props.theme.textColor }}>
            <span>{this.props.user.username} </span>
            <UIMessageBody
              body={message.body}
              reactions={message.reactions}
              theme={this.props.theme}
              isEdited={message.isEdited}
              onSelectReaction={this.props.onSelectReaction}
            />
          </div>
        </span>
      </div>
    );
  }
}
