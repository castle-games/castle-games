import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';
import { SocialContext } from '~/contexts/SocialContext';
import { getEmojiComponent } from '~/common/emojis';

import Linkify from 'react-linkify';

// NOTE(jim): experiment.
const HIGHLIGHT_COLOR = `#3d3d3d`;
const LEFT_CONTEXT_COLOR = `#282828`;
const TIMESTAMP_COLOR = `#bebebe`;

const NOTIFICATIONS_USER_ID = -1;

const STYLES_AVATAR = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 24px;
  width: 24px;
  border-radius: 4px;
  cursor: pointer;
`;

const STYLES_CHAT_ITEM = css`
  font-family: ${Constants.font.system};
  padding: 0 16px 4px 8px;
  font-size: 14px;
  line-height: 1.2;
  cursor: default;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  a {
    color: ${Constants.colors.brand2};
    font-weight: 600;
    transition: 200ms ease color;

    :hover {
      color: ${Constants.colors.brand3};
    }

    :visited {
      color: ${Constants.colors.brand2};
    }
  }
`;

const STYLES_LEFT = css`
  padding: 4px 8px 8px 0;
  width: 32px;
  flex-shrink: 0;
`;

const STYLES_CONTENT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_MESSAGE_HEADING = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 4px 0 4px 0;
`;

const STYLES_MESSAGE_HEADING_LEFT = css`
  font-family: ${Constants.font.system};
  width: 100%;
  min-width: 96px;
  font-weight: 700;
  cursor: pointer;
  overflow-wrap: break-word;

  @media (max-width: 960px) {
    min-width: 24px;
  }
`;

const STYLES_MESSAGE_HEADING_RIGHT = css`
  color: ${TIMESTAMP_COLOR};
  font-family: ${Constants.font.mono};
  padding: 2px 0 0px 8px;
  font-weight: 400;
  text-transform: uppercase;
  flex-shrink: 0;
  font-size: 10px;
  text-align: right;
`;

const STYLES_MESSAGE_MENTION = css`
  @keyframes color-change {
    from,
    20%,
    40%,
    60%,
    80%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      color: ${Constants.colors.text};
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3);
    }

    20% {
      transform: scale3d(1.1, 1.1, 1.1);
    }

    40% {
      transform: scale3d(0.9, 0.9, 0.9);
    }

    60% {
      opacity: 1;
      transform: scale3d(1.03, 1.03, 1.03);
    }

    80% {
      transform: scale3d(0.97, 0.97, 0.97);
    }

    to {
      color: ${Constants.colors.brand1};
      opacity: 1;
      transform: scale3d(1, 1, 1);
    }
  }

  color: ${Constants.colors.brand1};
  cursor: pointer;
  display: inline-block;
  font-weight: 900;
  animation: color-change 750ms;
  animation-iteration-count: 1;
`;

const STYLES_MESSAGE_ELEMENT = css`
  display: block;
  width: 100%;
  overflow-wrap: break-word;
`;

const STYLES_NOTIFICATION_ITEM = css`
  margin: 8px 0 8px 0;
`;

const STYLES_NOTIFICATION_HEADING = css`
  font-family: ${Constants.font.heading};
  font-weight: 400;
  padding: 0px 0 8px 0;
`;

const STYLES_NOTIFICATION_ITEM_CONTENT = css`
  background-color: ${Constants.colors.brand4};
  color: ${Constants.colors.text};
  border-radius: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  font-size: 14px;
  padding: 8px 8px 16px 8px;
`;

class ChatMessage extends React.Component {
  _renderChatMessage = (message) => {
    let result = [];
    for (let i = 0; i < message.length; i++) {
      let messagePart = message[i];
      if (messagePart.text) {
        result.push(<span key={i}>{messagePart.text}</span>);
      } else if (messagePart.userId) {
        let isRealUser = !!this.props.social.userIdToUser[messagePart.userId];
        let user = this.props.social.userIdToUser[messagePart.userId] || {
          userId: messagePart.userId,
          username: messagePart.userId,
        };

        result.push(
          <span
            key={i}
            className={STYLES_MESSAGE_MENTION}
            onClick={isRealUser ? () => this.props.navigateToUserProfile(user) : null}>{`@${
            user.username
          }`}</span>
        );
      } else if (messagePart.emoji) {
        result.push(<span key={i}>{getEmojiComponent(messagePart.emoji, 16)}</span>);
      }
    }

    return result;
  };

  _areDatesSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  render() {
    const chatMessage = this.props.message;
    const userId = chatMessage.userId;
    const isCastleNotification = userId === NOTIFICATIONS_USER_ID;

    let maybeAvatar;
    let maybeUsernameAndTimestamp;

    if (!this.props.prevUserId || this.props.prevUserId !== userId) {
      let isRealUser = !!this.props.social.userIdToUser[chatMessage.userId];
      let user = this.props.social.userIdToUser[chatMessage.userId] || {
        userId: chatMessage.userId,
        username: chatMessage.userId,
      };

      if (isCastleNotification) {
        user = { userId: NOTIFICATIONS_USER_ID, username: 'Castle' };
      }

      if (user.photo && user.photo.url) {
        maybeAvatar = (
          <div
            className={STYLES_AVATAR}
            onClick={isRealUser ? () => this.props.navigateToUserProfile(user) : null}
            style={{
              backgroundImage: `url('${user.photo.url}')`,
              boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.07)',
            }}
          />
        );
      }

      let date = new Date(chatMessage.timestamp);
      let timeString = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      if (!this._areDatesSameDay(new Date(), date)) {
        let yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

        if (this._areDatesSameDay(yesterday, date)) {
          timeString = `Yesterday ${timeString}`;
        } else {
          timeString = `${Strings.toDate(date)} ${timeString}`;
        }
      }

      maybeUsernameAndTimestamp = (
        <div
          className={STYLES_MESSAGE_HEADING}
          onClick={isRealUser ? () => this.props.navigateToUserProfile(user) : null}>
          <span className={STYLES_MESSAGE_HEADING_LEFT}>{user.username}</span>
          <span className={STYLES_MESSAGE_HEADING_RIGHT}>{timeString}</span>
        </div>
      );
    }

    if (isCastleNotification) {
      return (
        <div className={STYLES_NOTIFICATION_ITEM}>
          <div className={STYLES_NOTIFICATION_ITEM_CONTENT}>
            <div className={STYLES_NOTIFICATION_HEADING}>🏰 Hey!</div>
            <Linkify className={STYLES_MESSAGE_ELEMENT}>
              {this._renderChatMessage(chatMessage.richMessage.message)}
            </Linkify>
          </div>
        </div>
      );
    }

    return (
      <div className={STYLES_CHAT_ITEM}>
        <div className={STYLES_LEFT}>{maybeAvatar}</div>
        <div className={STYLES_CONTENT}>
          {maybeUsernameAndTimestamp}
          <Linkify className={STYLES_MESSAGE_ELEMENT}>
            {this._renderChatMessage(chatMessage.richMessage.message)}
          </Linkify>
        </div>
      </div>
    );
  }
}

// TODO (jesse): this is inefficient right now. Every ChatMessage component
// gets rerendered when social is updated. It's a little complicated to fix this
// because the ChatMessage component cares about both the author of the message and
// each user tagged in the message. The correct way to fix this is probably to use
// an immutable library to pass in the subset of users that ChatMessage actually cares
// about.
export default class ChatMessageWithContext extends React.Component {
  render() {
    return (
      <SocialContext.Consumer>
        {(social) => <ChatMessage {...this.props} social={social} />}
      </SocialContext.Consumer>
    );
  }
}
