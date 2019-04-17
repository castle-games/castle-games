import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';
import { getEmojiComponent } from '~/common/emojis';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const STYLES_POST = css`
  width: 80%;
  max-width: 600px;
  display: inline-block;
  padding: 24px 24px 24px 24px;
  position: relative;
`;

const STYLES_POST_CARD = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: ${Constants.colors.white};
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const STYLES_POST_HEADER = css`
  display: flex;
  flex-direction: row;
  position: relative;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const STYLES_GAME_CONTAINER = css`
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  padding: 0px;
  border-radius: 4px;
  align-self: flex-start;
`;

const STYLES_GAME_BACKGROUND_LIGTHENER = css`
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  border: 2px solid black;
`;

const STYLES_GAME_COVER_IMAGE = css`
  background-size: cover;
  background-position: 50% 50%;
  height: 16px;
  width: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
`;

const STYLES_GAME_TITLE = css`
  font-family: ${Constants.font.game};
  font-size: 13px;
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

const STYLES_POST_BODY = css`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 4px;
  background: ${Constants.colors.white};
  border-radius: 4px;
`;

const STYLES_MESSAGE_MENTION = css`
  cursor: pointer;
  display: inline-block;
  font-weight: 900;
  color: cyan;
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

  animation: color-change 750ms;
  animation-iteration-count: 1;
`;

const STYLES_TAG = css`
  position: absolute;
  top: 4px;
  left: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${Constants.colors.text};
  border-radius: 4px;
  padding: 0 8px 0 8px;
  height: 24px;
  font-family: ${Constants.font.monobold};
  color: white;
  font-size: 10px;
`;

const Tag = (props) => {
  return <span className={STYLES_TAG}>{props.children}</span>;
};

class UIPostCell extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
    isPreview: false,
  };

  _handleGameSelect = () => {
    this.props.onGameSelect(this.props.post.sourceGame);
  };

  _handleUserSelect = () => {
    this.props.onUserSelect(this.props.post.creator);
  };

  _renderGameContainer = (sourceGame) => {
    const sourceGamePrimaryColor =
      sourceGame.metadata && sourceGame.metadata.primaryColor
        ? `#${sourceGame.metadata.primaryColor}`
        : '#3d3d3d';

    return (
      <div className={STYLES_GAME_CONTAINER} style={{ sourceGamePrimaryColor }}>
        <div
          className={STYLES_GAME_BACKGROUND_LIGTHENER}
          style={{ borderColor: sourceGamePrimaryColor }}>
          <div
            className={STYLES_GAME_COVER_IMAGE}
            onClick={this._handleGameSelect}
            style={{
              backgroundImage: this.props.coverImageUrl ? `url(${this.props.coverImageUrl})` : null,
            }}
          />
          <div className={STYLES_GAME_TITLE} onClick={this._handleGameSelect}>
            {sourceGame.title}
          </div>
        </div>
      </div>
    );
  };

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

  render() {
    const { post } = this.props;

    const { sourceGame, creator, message } = post;

    let maybeGameContainer = null;
    if (sourceGame) {
      maybeGameContainer = this._renderGameContainer(sourceGame);
    }

    let maybeMessageContainer = null;
    if (message) {
      maybeMessageContainer = this._renderChatMessage(message.message);
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
          <div className={STYLES_POST_BODY}>{maybeMessageContainer}</div>
        </div>
      </div>
    );
  }
}

export default class UIPostList extends React.Component {
  state = {
    posts: null,
  };

  componentDidMount() {
    // TODO: This logic should be... Better.
    this._loadPostsAsync();
    setTimeout(this._loadPostsAsync, 1000);
  }

  render() {
    const { posts } = this.state;
    return !posts ? (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_POST}>Loading...</div>
      </div>
    ) : (
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

  _loadPostsAsync = async () => {
    this.setState({
      posts: await Actions.allPostsAsync(), // This call supports pagination, we're just not using it...
    });
  }
}
