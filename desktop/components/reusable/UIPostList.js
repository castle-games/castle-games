import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';

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

const STYLES_GAME_CONTAINER = css`
  display: flex;
  flex-direction: row;
`;

const STYLES_OPEN_DATA_BUTTON = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  padding: 0px;
  border-radius: 4px;
  margin-right: 4px;
`;

const STYLES_GAME_BUTTON = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_GAME_COVER_IMAGE = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 28px;
  width: 28px;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  cursor: pointer;
  flex-shrink: 0;
`;

const STYLES_GAME_TITLE = css`
  font-family: ${Constants.font.system};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  padding: 0 12px 0 12px;
  display: inline-flex;
  align-items: center;
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

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-bottom: 8px;
  font-size: 10px;
  display: flex;
  justify-content: flex-end;
  cursor: default;
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

  _renderGameContainer = ({ sourceGame, hasData }) => {
    let primaryColor =
      sourceGame.metadata && sourceGame.metadata.primaryColor
        ? `#${sourceGame.metadata.primaryColor}`
        : Constants.colors.backgroundLeftContext;

    const coverImageUrl = sourceGame.coverImage && sourceGame.coverImage.url;

    const textColor = Utilities.adjustTextColor(primaryColor);

    let maybeOpenDataButton;
    if (hasData) {
      maybeOpenDataButton = (
        <div className={STYLES_OPEN_DATA_BUTTON} style={{ backgroundColor: primaryColor }}>
          <div
            className={STYLES_GAME_TITLE}
            onClick={this._handleOpenData}
            style={{ color: textColor }}>
            Open Data
          </div>
        </div>
      );
    }

    return (
      <div className={STYLES_GAME_CONTAINER}>
        {maybeOpenDataButton}
        <div className={STYLES_GAME_BUTTON} style={{ backgroundColor: primaryColor }}>
          {!Strings.isEmpty(coverImageUrl) ? (
            <div
              className={STYLES_GAME_COVER_IMAGE}
              onClick={this._handleGameSelect}
              style={{
                backgroundImage: `url(${coverImageUrl})`,
              }}
            />
          ) : null}
          <div
            className={STYLES_GAME_TITLE}
            onClick={this._handleGameSelect}
            style={{ color: textColor }}>
            {sourceGame.title}
          </div>
        </div>
      </div>
    );
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

  _renderMedia = (media) => {
    return (
      <div className={STYLES_MEDIA_CONTAINER}>
        <img className={STYLES_MEDIA_IMAGE} src={media.url} />
      </div>
    );
  };

  _renderCreatedTime = (createdTime) => {
    return <div className={STYLES_TIMESTAMP}>{Strings.toChatDate(createdTime)}</div>;
  };

  render() {
    const { post } = this.props;

    const { sourceGame, creator, message, media, hasData, createdTime } = post;

    let maybeGameContainer = null;
    if (sourceGame) {
      maybeGameContainer = this._renderGameContainer({ sourceGame, hasData });
    }

    let maybeMessageContainer = null;
    if (message) {
      maybeMessageContainer = this._renderMessage(message.message);
    }

    let maybeMediaContainer = null;
    if (media) {
      maybeMediaContainer = this._renderMedia(media);
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
            {maybeGameContainer}
          </div>
          <div className={STYLES_POST_BODY}>
            {this._renderCreatedTime(createdTime)}
            {maybeMessageContainer}
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
