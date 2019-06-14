import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';
import { getEmojiComponent } from '~/common/emojis';

const STYLES_CONTAINER = css`
  display: flex;
  margin-top: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const STYLES_POST = css`
  width: 100%;
  max-width: 568px;
  display: inline-block;
  padding: 24px 24px 24px 24px;
  position: relative;
`;

const STYLES_POST_CARD = css`
  background: ${Constants.colors.white};
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const STYLES_POST_HEADER = css`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
`;

const STYLES_MESSAGE_CONTAINER = css``;

const STYLES_PLAYING = css`
  color: ${Constants.REFACTOR_COLORS.subdued};
  white-space: nowrap;
  padding-left: 8px;
`;

const STYLES_PLAYING_TITLE = css`
  cursor: pointer;
  color: ${Constants.colors.action};
`;

const STYLES_USER_CONTAINER = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_USER_PHOTO = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 28px;
  width: 28px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_USER_NAME = css`
  font-family: ${Constants.font.system};
  font-weight: 700;
  align-self: center;
`;

const STYLES_TIMESTAMP_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${Constants.REFACTOR_COLORS.subdued};
  cursor: pointer;
  margin-bottom: 4px;

  :hover {
    border-bottom: 1px solid ${Constants.REFACTOR_COLORS.subdued};
  }
`;

const STYLES_TIMESTAMP = css`
  margin-left: 4px;
  font-weight: 400;
  font-size: 10px;
`;

const STYLES_POST_BODY = css`
  display: flex;
  position: relative;
  flex-direction: column;
  font-size: 16px;
  margin: 8px 0 0 0;
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
      opacity: 0;
      color: #000;

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
      opacity: 1;
      color: cyan;
      transform: scale3d(1, 1, 1);
    }
  }

  cursor: pointer;
  display: inline-block;
  font-weight: 900;
  color: cyan;
  animation: color-change 750ms;
  animation-iteration-count: 1;
`;

const STYLES_MEDIA_CONTAINER = css`
  margin-top: 16px;
`;

const STYLES_MEDIA_IMAGE = css`
  background-color: ${Constants.colors.black};
  object-fit: contain;
  width: 100%;
  max-height: 500px;
`;

class UIPostCell extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
  };

  state = {
    urlWasCopiedToClipboard: false,
  };

  _handleOpenData = async () => {
    const { post } = this.props;
    this.props.onGameSelect(post.sourceGame, { post });
  };

  _handleGameSelect = () => {
    this.props.onGameSelect(this.props.post.sourceGame);
  };

  _handleUserSelect = () => {
    this.props.onUserSelect(this.props.post.creator);
  };

  _handleCopyUrlToClipboard = () => {
    let textField = document.createElement('textarea');
    textField.innerText = this.props.post.url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this.setState({ urlWasCopiedToClipboard: true });
  };

  _renderMessage = (message) => {
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
  _renderMessageContainer = (message, game) => {
    let richMessage = message ? this._renderMessage(message) : null;
    let playing;
    if (game) {
      let maybeSeparator = richMessage ? '- ' : null;
      playing = (
        <span className={STYLES_PLAYING}>
          {maybeSeparator}
          Playing{' '}
          <span className={STYLES_PLAYING_TITLE} onClick={this._handleGameSelect}>
            {game.title}
          </span>
        </span>
      );
    }
    return (
      <div className={STYLES_MESSAGE_CONTAINER}>
        {richMessage}
        {playing}
      </div>
    );
  };

  _renderMedia = (media, sourceGame, hasData) => {
    let onClick = null;
    if (hasData) {
      onClick = this._handleOpenData;
    } else if (sourceGame) {
      onClick = this._handleGameSelect;
    }
    return (
      <div className={STYLES_MEDIA_CONTAINER}>
        <img
          className={STYLES_MEDIA_IMAGE}
          src={media.url}
          onClick={onClick}
          style={onClick ? { cursor: 'pointer' } : null}
        />
      </div>
    );
  };

  _renderCreatedTime = (createdTime) => {
    const { urlWasCopiedToClipboard } = this.state;
    let svg;
    if (urlWasCopiedToClipboard) {
      svg = <SVG.Check size="15px" style={{ color: 'green' }} />;
    } else {
      svg = <SVG.Link size="15px" />;
    }
    return (
      <div className={STYLES_TIMESTAMP_CONTAINER} onClick={this._handleCopyUrlToClipboard}>
        {svg}
        <div className={STYLES_TIMESTAMP}>{Strings.toChatDate(createdTime)}</div>
      </div>
    );
  };

  render() {
    const { post } = this.props;

    const { sourceGame, creator, message, media, hasData, createdTime } = post;

    let messageContainer = this._renderMessageContainer(message.message, sourceGame);

    let maybeMediaContainer = null;
    if (media) {
      maybeMediaContainer = this._renderMedia(media, sourceGame, hasData);
    }

    return (
      <div className={STYLES_POST}>
        <div className={STYLES_POST_CARD}>
          <div className={STYLES_POST_HEADER}>
            <div className={STYLES_USER_CONTAINER}>
              <div
                className={STYLES_USER_PHOTO}
                onClick={this._handleUserSelect}
                style={{
                  backgroundImage:
                    creator.photo && creator.photo.url ? `url(${creator.photo.url})` : null,
                }}
              />
              <div className={STYLES_USER_NAME} onClick={this._handleUserSelect}>
                {creator.name}
              </div>
            </div>
            <div>{this._renderCreatedTime(createdTime)}</div>
          </div>
          <div className={STYLES_POST_BODY}>
            {messageContainer}
            {maybeMediaContainer}
          </div>
        </div>
      </div>
    );
  }
}

export default class UIPostList extends React.Component {
  render() {
    const { posts } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {posts.map((post) => {
          return (
            <UIPostCell
              key={post.postId}
              onGameSelect={this.props.onGameSelect}
              onUserSelect={this.props.onUserSelect}
              post={post}
            />
          );
        })}
      </div>
    );
  }
}
