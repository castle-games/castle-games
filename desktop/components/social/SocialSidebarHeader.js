import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 8px 8px 8px 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_H2 = css`
  font-size: 12px;
`;

const STYLES_P = css`
  margin: 4px 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  height: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued};

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

const STYLES_ONLINE = css`
  padding-left: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued}:
  cursor: pointer;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }

  span {
    padding: 0 8px 0 8px;
  }
`;

const STYLES_LINK = css`
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
`;

const STYLES_CHANNEL_NAME = css``;

export default class SocialSidebarHeader extends React.Component {
  _renderTitle = () => {
    const { channel, onChannelClick } = this.props;
    let content;
    if (channel.type === 'dm') {
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {channel.name}
        </span>
      );
    } else {
      let name;
      if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
        name = 'Everyone';
      } else {
        name = channel.name;
      }
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {name}
        </span>
      );
    }
    return <h2 className={STYLES_H2}>{content}</h2>;
  };

  _getHeading = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'dm':
        return `You are having a private conversation with ${channel.name}`;
      default:
        if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
          return 'You are chatting with everyone on Castle';
        }
        break;
    }
    return 'This is a public channel.';
  };

  _getLeaveMessage = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'dm':
        return 'Leave conversation';
        break;
      default:
        return 'Leave channel';
        break;
    }
  };

  _renderActions = () => {
    const { numChannelMembers } = this.props;
    if (numChannelMembers) {
      return (
        <span className={STYLES_ONLINE} onClick={this.props.onMembersClick}>
          <strong>{numChannelMembers} online</strong>
          <span>&middot;</span>
        </span>
      );
    } else {
      return null;
    }
  };

  render() {
    const { channel, onLeaveChannel } = this.props;
    if (!channel) {
      return null;
    }

    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          {this._renderTitle()}
          <p className={STYLES_P}>
            {this._renderActions()}
            <span>{this._getHeading()}</span>
          </p>
        </div>
      </header>
    );
  }
}
