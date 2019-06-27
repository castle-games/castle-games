import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { getEmojiComponent } from '~/common/emojis';
import { Tooltip } from 'react-tippy';

import ChatMessageElement from '~/components/chat/ChatMessageElement';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 16px 24px 16px 24px;
`;

const STYLES_POST = css`
  width: 100%;
  max-width: 500px;
  display: inline-block;
  position: relative;
  color: black;
  margin: 0 16px 48px 0;

  :hover {
    footer {
      background: rgba(0, 0, 0, 0.5);
    }
  }
`;

const STYLES_MEDIA_IMAGE = css`
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 4px 4px 4px 4px;
  background-color: black;
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  min-height: 300px;
`;

const STYLES_POST_CARD = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const STYLES_PLAYING = css`
  white-space: nowrap;
  font-size: 15px;
  margin-top: 2px;
`;

const STYLES_PLAYING_TITLE = css`
  cursor: pointer;
  color: ${Constants.colors.action};
  margin-left: 0px;
  font-size: 15px;
  :hover {
    text-decoration: underline;
  }
`;

const STYLE_HEADER_TEXT_TOP_ROW = css`
  margin-top: 1px;
`;

const STYLES_FOOTER = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 16px 0 16px;
  transition: background 200ms ease;
  background: rgba(0, 0, 0, 0);
`;

const STYLES_TIMESTAMP = css`
  font-weight: 500;
  font-size: 13px;
  color: #ffffff;
`;

const STYLES_PLAY_ICON = css`
  width: 14px;
  height: 14px;
  color: ${Constants.card.iconColor};
  margin-left: auto;
  margin-right: 2px;
  :hover {
    transform: scale(1.14);
  }
`;

const STYLES_PLAY_HOVER = css`
  cursor: pointer;
  @keyframes button-color-change {
    0% {
      color: ${Constants.colors.brand4};
    }
    50% {
      color: ${Constants.colors.brand1};
    }
    100% {
      color: ${Constants.colors.brand2};
    }
  }
  animation: button-color-change infinite 400ms;
  color: white;
`;

const STYLES_OPTIONS_BAR = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  color: #7f7f7f;
  border-radius: 4px;
  border: 1px solid #cdcdcd;
  height: 36px;
  position: absolute;
  right: 0px;
  top: 0px;
  cursor: pointer;

  :hover {
    box-shadow: ${Constants.card.boxShadow};
  }
`;

const STYLES_LINK_BUTTON = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  :hover {
    color: magenta;
  }
`;

const STYLES_COPY_LINK_CONTENTS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  height: 36px;
`;

class UIPostCell extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
  };

  state = {
    mouseX: 0,
    mouseY: 0,
    urlWasCopiedToClipboard: false,
    isHoveringOnPost: false,
    isHoveringOnLink: false,
    stringIsElided: true,
  };

  // TODO(jason): consolidate w/ uigamecell
  _handleMouseMove = () => {
    let bounds = this._containerRef.getBoundingClientRect();
    let x = (100 * (event.clientX - bounds.left)) / bounds.width;
    let y = (100 * (event.clientY - bounds.top)) / bounds.height;

    this.setState({ mouseX: x, mouseY: y });
  };

  _handleExpandString = () => {
    this.setState({ stringIsElided: false });
  };

  _handleToggleHoverOnPost = (shouldSetHovering) => {
    this.setState({ isHoveringOnPost: shouldSetHovering });
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

  _handleToggleHoverOnLink = (shouldSetHovering) => {
    this.setState({ isHoveringOnLink: shouldSetHovering });
  };

  _handleMouseLeave = () => {
    this._handleToggleHoverOnPost(false);
    this.setState({ urlWasCopiedToClipboard: false });
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
    let text = ``;

    message.forEach((part) => {
      if (part.emoji) {
        text = `${text}${emojiToString(part.emoji)}`;
        return;
      }

      if (part.userId) {
        const user = this.props.social.userIdToUser[part.userId];
        const mentionString = user ? `@${user.username}` : `👤`;
        text = `${text}${mentionString}`;
        return;
      }

      text = `${text}${part.text}`;
    });

    return text;
  };

  _renderMessageContainer = (message, game) => {
    return message ? this._renderMessage(message) : ``;
  };

  render() {
    const { post } = this.props;
    const { mouseX, mouseY } = this.state;
    const { sourceGame, creator, message, media, hasData, createdTime } = post;

    if (!media) {
      return null;
    }

    let onClick = null;
    if (hasData) {
      onClick = this._handleOpenData;
    } else if (sourceGame) {
      onClick = this._handleGameSelect;
    }

    let text = this._renderMessageContainer(message.message, sourceGame);

    const { urlWasCopiedToClipboard } = this.state;
    let svg;
    if (urlWasCopiedToClipboard) {
      svg = <SVG.Check size="18px" style={{ color: 'green' }} />;
    } else {
      svg = <SVG.Link size="18px" />;
    }

    let playing;
    if (sourceGame) {
      playing = (
        <span className={STYLES_PLAYING}>
          {'  \u2022  '}Playing{' '}
          <span className={STYLES_PLAYING_TITLE} onClick={this._handleGameSelect}>
            {sourceGame.title}
          </span>
        </span>
      );
    }

    return (
      <div
        className={STYLES_POST}
        ref={(c) => {
          this._containerRef = c;
        }}
        onMouseEnter={() => this._handleToggleHoverOnPost(true)}
        onMouseLeave={() => this._handleMouseLeave()}
        onMouseMove={this._handleMouseMove}>
        <section>
          <ChatMessageElement
            onNavigateToUserProfile={this._handleUserSelect}
            style={{ padding: `0 0 4px 0`, minHeight: '76px' }}
            message={{ text, timestamp: createdTime }}
            social={this.props.social}
            chat={this.props.chat}
            user={creator}
          />
        </section>

        <div
          className={STYLES_MEDIA_IMAGE}
          onClick={onClick}
          style={{
            backgroundImage: `url(${media.url})`,
          }}
        />

        <footer className={STYLES_FOOTER} onClick={onClick}>
          <div
            className={STYLES_TIMESTAMP}
            style={{ visibility: this.state.isHoveringOnPost ? 'visible' : 'hidden' }}>
            {Strings.toCardDate(createdTime)}
          </div>
          <div
            className={
              this.state.isHoveringOnPost
                ? `${STYLES_PLAY_ICON} ${STYLES_PLAY_HOVER}`
                : STYLES_PLAY_ICON
            }>
            <SVG.Play size="32px" />
          </div>
        </footer>

        {this.state.isHoveringOnPost ? (
          <div className={STYLES_OPTIONS_BAR}>
            <Tooltip
              title={this.state.urlWasCopiedToClipboard ? 'Link copied!' : 'Copy Link'}
              arrow={true}
              duration={170}
              animation="fade"
              hideOnClick={false}>
              <div
                className={STYLES_LINK_BUTTON}
                onMouseEnter={() => this._handleToggleHoverOnLink(true)}
                onMouseLeave={() => this._handleToggleHoverOnLink(false)}
                onClick={this._handleCopyUrlToClipboard}>
                {this.state.urlWasCopiedToClipboard ? (
                  <div className={STYLES_COPY_LINK_CONTENTS}>
                    <SVG.Check size="24px" />
                  </div>
                ) : (
                  <div className={STYLES_COPY_LINK_CONTENTS}>
                    <SVG.Link size="24px" />
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
        ) : null}
      </div>
    );
  }
}

export default class UIPostList extends React.Component {
  render() {
    const { posts } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {posts.map((post, i) => {
          return (
            <UIPostCell
              key={`post-${post.postId}-${i}`}
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
