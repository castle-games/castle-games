import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';
import * as Utilities from '~/common/utilities';
import * as Strings from '~/common/strings';
import * as NativeUtil from '~/native/nativeutil';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UIGameCellActionsBar from '~/components/reusable/UIGameCellActionsBar';

// NOTE(jim): This needs to be revised so that we're not animating padding
// but we're doing a transform for performance to make use of the compositor.
const STYLES_CONTAINER = css`
  display: inline-block;
  position: relative;
  cursor: pointer;
  background: transparent;
  margin: 0 16px 16px 0;
  border-radius: ${Constants.card.radius};
  transition: 200ms cubic-bezier(0.17, 0.67, 0.83, 0.67) all;

  figure {
    border-radius: ${Constants.card.radius};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    transition: 200 cubic-bezier(0.17, 0.67, 0.83, 0.67) all;
  }

  section {
    transition: 200ms cubic-bezier(0.17, 0.67, 0.83, 0.67) all;
    padding: 12px 0px 8px 0px;
    margin-top: 8px;
    border-radius: ${Constants.card.radius};
  }

  :hover {
    section {
      box-shadow: 0 0 0 1px #ececec, 0 1px 4px rgba(0, 0, 0, 0.07);
      padding: 12px 8px 8px 12px;
    }

    figure {
    }
  }
`;

const STYLES_TOP_SECTION = css`
  width: ${Constants.card.width};
  height: ${Constants.card.imageHeight};
`;

const STYLES_GAME_SCREENSHOT = css`
  width: ${Constants.card.width};
  height: ${Constants.card.imageHeight};
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: ${Constants.colors.black};
`;

const STYLES_PLAY_ICON = css`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${Constants.card.iconColor};
`;

const STYLES_PLAY_HOVER = css`
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

  cursor: pointer;
  animation: button-color-change infinite 400ms;
  color: white;
`;

const STYLES_DESCRIPTION_SECTION = css`
  padding: 12px 16px 8px 16px;
  font-family: ${Constants.font.system};
`;

const STYLES_GAME_DESCRIPTION_HEADER = css`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  font-weight: 600;
`;

const STYLES_GAME_DESCRIPTION = css`
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
`;

const STYLES_DETAIL_SECTION = css`
  display: flex;
  flex-direction: row;
  padding: 12px 0px 8px 8px;
`;

const STYLES_TITLE_AND_PLAY = css`
  display: flex;
  flex-direction: row;
  line-height: 0.8;
  margin-bottom: 4px;
`;

const STYLES_GAME_TITLE_AND_AUTHOR = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 25%;
`;

const STYLES_GAME_TITLE = css`
  display: inline-flex;
  font-family: ${Constants.font.system};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  :hover {
    color: #55555f;
  }
`;

const STYLES_AVATAR = css`
  background-size: cover;
  background-position: 50% 50%;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
  margin-right: 8px;
`;

const STYLES_BYLINE = css`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_AUTHOR_AND_PLAY_COUNT = css`
  font-family: ${Constants.font.system};
  display: flex;
  flex-direction: row;
  margin-top: 2px;
  font-size: 13px;
  color: #8d8d8d;
  font-weight: 500;
`;

const STYLES_GAME_AUTHOR = css`
  display: inline-flex;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_PLAY_COUNT = css`
  margin-left: 5px;
`;

export default class UIGameCell extends React.Component {
  static defaultProps = {
    game: null,
    onGameSelect: () => {},
    onUserSelect: () => {},
    onShowGameInfo: () => {},
    onGameUpdate: null,
    renderCartridgeOnly: false,
    underConstruction: false,
    theme: {},
  };

  state = {
    mouseX: 0,
    mouseY: 0,
    isHoveringOnPlay: false,
    isHoveringOnActions: false,
    isHoveringOnAuthor: false,
    isShowingGameInfo: false,
    gameUrlWasCopiedToClipboard: false,
  };

  _handleToggleHoverOnPlay = (shouldSetHovering) => {
    this.setState({ isHoveringOnPlay: shouldSetHovering });
  };

  _handleMouseMove = () => {
    let bounds = this._containerRef.getBoundingClientRect();
    let x = (100 * (event.clientX - bounds.left)) / bounds.width;
    let y = (100 * (event.clientY - bounds.top)) / bounds.height;

    this.setState({ mouseX: x, mouseY: y });
  };

  _handleToggleShowGameInfo = (shouldShow) => {
    this.setState({ isShowingGameInfo: shouldShow });
  };

  _handleHoverOnActionsBar = (action, isHovering) => {
    this.setState({ isHoveringOnActions: isHovering });
  };

  _handleToggleHoverOnAuthor = (shouldSetHovering) => {
    this.setState({ isHoveringOnAuthor: shouldSetHovering });
  };

  _handleToggleVisibility = () => {
    this.setState({ isPopoverVisible: !this.state.isPopoverVisible });
  };

  _handleDismiss = () => {
    this.setState({ isPopoverVisible: false });
  };

  _handleViewSource = (gameEntryPoint) => {
    NativeUtil.openExternalURL(Urls.githubUserContentToRepoUrl(gameEntryPoint));
  };

  _handleCopyUrlToClipboard = () => {
    let textField = document.createElement('textarea');
    textField.innerText = this.props.game.url;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this.setState({ gameUrlWasCopiedToClipboard: true });
  };

  _handleGameSelect = () => {
    if (this.state.isHoveringOnActions || this.state.isHoveringOnAuthor) {
      return false;
    }
    this.props.onGameSelect(this.props.game);
  };

  _handleMouseLeave = () => {
    this._handleToggleHoverOnPlay(false);
    this.setState({ gameUrlWasCopiedToClipboard: false });
    this._handleToggleShowGameInfo(false);
  };

  render() {
    let { game } = this.props;
    let { mouseX, mouseY } = this.state;
    let title = game.title ? game.title : 'Untitled';
    let onGameUpdate = this.props.onGameUpdate ? () => this.props.onGameUpdate(game) : null;

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#F4F4F5';
    const textColor = Utilities.adjustTextColorWithEmphasis(backgroundColor, this.state.isHovering);

    const finalColor = this.state.isHoveringOnPlay
      ? Utilities.colorLuminance(backgroundColor, 0.8)
      : backgroundColor;

    const hoveringOnDetailIcon = this.state.isHoveringOnActions || this.state.isHoveringOnAuthor;
    let descriptionText = game.description
      ? Strings.elide(game.description, 180)
      : 'No description yet :)';
    let username, playCount;

    let isPrivate = Urls.isPrivateUrl(game.url);
    let isLocalFile = isPrivate || !game.owner || !game.owner.name;
    if (isLocalFile) {
      descriptionText = game.url;
      username = 'Local Project'; // TODO(Jason): show date last edited?
    } else {
      username = game.owner.username;
      playCount = (
        <span className={STYLES_PLAY_COUNT}>
          {'\u2022 '}
          {game.playCount} plays
        </span>
      );
    }

    let shouldShowGameInfo = isLocalFile || this.state.isShowingGameInfo;

    return (
      <div
        className={STYLES_CONTAINER}
        ref={(c) => {
          this._containerRef = c;
        }}
        onMouseEnter={() => this._handleToggleHoverOnPlay(true)}
        onMouseLeave={() => this._handleMouseLeave()}
        onMouseMove={() => this._handleMouseMove()}
        onClick={this._handleGameSelect}>
        <div className={STYLES_TOP_SECTION}>
          {shouldShowGameInfo ? (
            <div className={STYLES_DESCRIPTION_SECTION}>
              <div className={STYLES_BYLINE} onClick={() => this.props.onUserSelect(game.owner)}>
                {!isLocalFile ? (
                  <div
                    className={STYLES_AVATAR}
                    style={{
                      backgroundImage:
                        game.owner && game.owner.photo && game.owner.photo.url
                          ? `url(${game.owner.photo.url})`
                          : null,
                    }}
                  />
                ) : null}
                <div className={STYLES_GAME_DESCRIPTION_HEADER}>{username}</div>
              </div>
              <div
                className={STYLES_GAME_DESCRIPTION}
                style={{ wordWrap: isLocalFile ? 'break-word' : 'normal' }}>
                {descriptionText}
              </div>
            </div>
          ) : (
            <figure
              className={STYLES_GAME_SCREENSHOT}
              style={{
                backgroundImage: this.props.src ? `url(${this.props.src})` : null,
              }}
            />
          )}
        </div>

        <section
          className={STYLES_DETAIL_SECTION}
          style={{
            background: !this.state.isHoveringOnPlay ? null : this.props.theme.embedBackground,
          }}>
          {!this.state.isShowingGameInfo ? (
            <div className={STYLES_GAME_TITLE_AND_AUTHOR}>
              <div className={STYLES_TITLE_AND_PLAY}>
                <span className={STYLES_GAME_TITLE}>{title}</span>
              </div>
              <div className={STYLES_AUTHOR_AND_PLAY_COUNT}>
                <span
                  className={STYLES_GAME_AUTHOR}
                  onClick={() => this.props.onUserSelect(game.owner)}
                  onMouseEnter={() => this._handleToggleHoverOnAuthor(true)}
                  onMouseLeave={() => this._handleToggleHoverOnAuthor(false)}>
                  {username}
                </span>
                {playCount}
              </div>
            </div>
          ) : null}
          <div
            className={
              this.state.isHoveringOnPlay && !hoveringOnDetailIcon
                ? `${STYLES_PLAY_ICON} ${STYLES_PLAY_HOVER}`
                : STYLES_PLAY_ICON
            }
            style={{ visibility: this.state.isHoveringOnPlay ? 'visible' : 'hidden' }}>
            <SVG.Play style={{ width: 16, height: 16 }} />
          </div>
        </section>

        {this.state.isHoveringOnPlay ? (
          <UIGameCellActionsBar
            isLocalFile={isLocalFile}
            isShowingInfo={shouldShowGameInfo}
            didCopyToClipboard={this.state.gameUrlWasCopiedToClipboard}
            onGameUpdate={onGameUpdate}
            onShowGameInfo={this._handleToggleShowGameInfo}
            onCopyUrl={this._handleCopyUrlToClipboard}
            onHover={this._handleHoverOnActionsBar}
          />
        ) : null}
      </div>
    );
  }
}
