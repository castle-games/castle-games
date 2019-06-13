import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Utilities from '~/common/utilities';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
`;

const STYLES_WRAP = css`
  padding: 16px;
  max-width: 512px;
  width: 100%;
`;

const STYLES_CONTENT = css`
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CANCEL = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
  margin-left: auto;
  padding-right: 24px;
  width: 64px;
  height: 64px;
  :hover {
    color: white;
    background: rgba(0, 0, 0, 0.09);
  }
`;

const STYLES_CARTRIDGE_BACKGROUND = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
`;

const STYLES_GAME_TITLE = css`
  margin-left: 24px;
  font-family: ${Constants.font.game};
  font-size: ${Constants.typescale.lvl4};
`;

const STYLES_PLAY = css`
  display: flex;
  flex-direction: row;
  margin-left: 14px;
  font-family: ${Constants.font.game};
  font-size: ${Constants.typescale.lvl4};
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

  transform: scale(0.95);
`;

const STYLES_PLAY_COUNT = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  margin-left: auto;
  margin-right: 24px;
  height: 64px;
  font-family: ${Constants.font.game};
  font-size: ${Constants.typescale.lvl5};
  font-weight: 500;
`;

const STYLES_GAME_SCREENSHOT = css`
  height: 240px;
  transition: 70ms ease all;
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  backgroundcolor: rgba(0, 0, 0, 0.1);
  :hover {
    filter: brightness(110%);
  }
`;

const STYLES_DETAILS_SECTION = css`
  padding-top: 16px;
`;

const STYLES_BYLINE = css`
  display: flex;
  align-items: center;
  margin-left: 24px;
  cursor: pointer;
`;

const STYLES_AVATAR = css`
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  transition: 70ms ease all;
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  backgroundcolor: rgba(0, 0, 0, 0.1);
`;

const STYLES_AUTHOR_TWO_LINER = css`
  display: flex;
  margin-left: 16px;
  flex-direction: column;
  justify-content: center;
`;

const STYLES_AUTHOR_PREFIX = css`
  color: ${Constants.colors.text};
  margin-bottom: 6px;
  font-family: ${Constants.font.system};
  font-size: ${Constants.typescale.lvl6};
  font-weight: 400;
`;

const STYLES_AUTHOR_NAME = css`
  color: ${Constants.colors.text};
  font-family: ${Constants.font.system};
  font-size: ${Constants.typescale.lvl6};
  font-weight: 700;
`;

const STYLES_DETAIL_TEXT = css`
  margin: 8px 24px 0px 24px;
  color: ${Constants.colors.text};
  font-family: ${Constants.font.system};
  font-size: ${Constants.typescale.lvl6};
  font-weight: 400;
`;

const STYLES_COPY_LINK_CONTENTS = css`
  display: flex;
  flexdirection: row;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
`;

const STYLES_DETAIL_BUTTONS_SECTION = css`
  display: flex;
  flex-direction: row;
`;

const STYLES_DETAIL_BUTTON = css`
  height: 32px;
  margin-right: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${Constants.colors.text};
  font-family: ${Constants.font.system};
  font-size: ${Constants.typescale.lvl7};
  font-weight: 600;
  font-size: 12px;

  cursor: pointer;
  :hover {
    color: magenta;
  }
`;

const STYLES_GAME_DESCRIPTION = css`
  padding: 8px 24px 24px 0px;
  color: ${Constants.colors.text};
  font-family: ${Constants.font.system};
  font-size: ${Constants.typescale.lvl6};
  font-weight: 400;
`;

class GameInfoModal extends React.Component {
  static defaultProps = {
    onCancel: null,
    game: null,
    onUserSelect: () => {},
    onGameSelect: () => {},
  };

  state = {
    isHoveringOnPlay: false,
    isHoveringOnAuthor: false,
    gameUrlWasCopiedToClipboard: false,
  };

  _handleHoverOnPlay = (shouldHover) => {
    this.setState({ isHoveringOnPlay: shouldHover });
  };

  _handleHoverOnAuthor = (shouldHover) => {
    this.setState({ isHoveringOnAuthor: shouldHover });
  };

  _handleGameSelect = (game) => {
    this.props.onGameSelect(game);
  };

  componentWillMount() {
    document.addEventListener('mousedown', this._handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClick, false);
  }

  _handleClick = (e) => {
    if (this.contentArea.contains(e.target)) {
      return;
    }

    if (this.darkOverlayArea.contains(e.target)) {
      this.props.onCancel();
    }

    return;
  };

  _handleViewSource = (gameEntryPoint) => {
    NativeUtil.openExternalURL(Urls.githubUserContentToRepoUrl(gameEntryPoint));
  };

  _handleClickUrl = (url) => {
    NativeUtil.openExternalURL(url);
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

  _renderCreator = (game) => {
    return (
      <div
        className={STYLES_BYLINE}
        onMouseEnter={() => this._handleHoverOnAuthor(true)}
        onMouseLeave={() => this._handleHoverOnAuthor(false)}
        onClick={() => this.props.onUserSelect(game.owner)}>
        <div
          className={STYLES_AVATAR}
          style={{
            backgroundImage:
              game.owner.photo && game.owner.photo.url ? `url(${game.owner.photo.url})` : null,
            filter: this.state.isHoveringOnAuthor ? 'brightness(120%)' : 'none',
          }}
        />
        <div className={STYLES_AUTHOR_TWO_LINER}>
          <div className={STYLES_AUTHOR_PREFIX} onClick={() => this.props.onUserSelect(game.owner)}>
            A game by
          </div>
          <div
            className={STYLES_AUTHOR_NAME}
            style={{ textDecoration: this.state.isHoveringOnAuthor ? 'underline' : 'none' }}>
            {game.owner.username}
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { game } = this.props;

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#3d3d3d';
    const textColor = Utilities.adjustTextColor(backgroundColor);

    const finalBackgroundColor = this.state.isHoveringOnPlay ? Utilities.colorLuminance(backgroundColor, 0.1) : backgroundColor;

    const descriptionBackgroundColor = Utilities.increaseBrightness(backgroundColor, 85);


    let gameDescription = !Strings.isEmpty(game.description) ? game.description : null;

    const luaEntryPoint = Utilities.getLuaEntryPoint(game);
    const isOpenSource = Urls.isOpenSource(luaEntryPoint);

    return (
      <div
        className={STYLES_CONTAINER}
        ref={(darkOverlayArea) => (this.darkOverlayArea = darkOverlayArea)}>
        <div className={STYLES_WRAP}>
          <div
            className={STYLES_CONTENT}
            style={{ color: textColor, background: descriptionBackgroundColor }}
            ref={(contentArea) => (this.contentArea = contentArea)}>
            <div
              className={STYLES_CARTRIDGE_BACKGROUND}
              style={{ background: finalBackgroundColor }}>
              <div className={STYLES_GAME_TITLE}>{game.title}</div>
              <div
                className={STYLES_CANCEL}
                onMouseEnter={() => this._handleHoverOnPlay(false)}
                onClick={this.props.onCancel}>
                <SVG.Dismiss size="16px" />
              </div>
            </div>
            <div
              className={STYLES_GAME_SCREENSHOT}
              onClick={() => this._handleGameSelect(game)}
              onMouseEnter={() => this._handleHoverOnPlay(true)}
              onMouseLeave={() => this._handleHoverOnPlay(false)}
              style={{
                backgroundImage:
                  game.coverImage && game.coverImage.url ? `url(${game.coverImage.url})` : null,
                filter: this.state.isHoveringOnPlay ? 'brightness(110%)' : 'none',
              }}
            />
            <div
              className={STYLES_CARTRIDGE_BACKGROUND}
              onClick={() => this._handleGameSelect(game)}
              onMouseEnter={() => this._handleHoverOnPlay(true)}
              onMouseLeave={() => this._handleHoverOnPlay(false)}
              style={{ background: finalBackgroundColor, cursor: 'pointer' }}>
              <div
                className={
                  this.state.isHoveringOnPlay ? `${STYLES_PLAY} ${STYLES_PLAY_HOVER}` : STYLES_PLAY
                }>
                <SVG.Play size="32px" /> Play
              </div>
              <div className={STYLES_PLAY_COUNT}>{game.playCount} plays</div>
            </div>
            <div className={STYLES_DETAILS_SECTION}>
              {this._renderCreator(game)}
              <div className={STYLES_DETAIL_TEXT}>
                <div className={STYLES_DETAIL_BUTTONS_SECTION}>
                  <div className={STYLES_DETAIL_BUTTON} onClick={this._handleCopyUrlToClipboard}>
                    {this.state.gameUrlWasCopiedToClipboard ? (
                      <div className={STYLES_COPY_LINK_CONTENTS} style={{ color: 'green' }}>
                        <SVG.Check size="24px" />
                        <div style={{ marginLeft: '8px' }}>Copied!</div>
                      </div>
                    ) : (
                      <div className={STYLES_COPY_LINK_CONTENTS}>
                        <SVG.Link size="24px" />
                        <div style={{ marginLeft: '8px' }}>Copy Link</div>
                      </div>
                    )}
                  </div>
                  {isOpenSource ? (
                    <div
                      className={STYLES_DETAIL_BUTTON}
                      onClick={() => this._handleViewSource(luaEntryPoint)}>
                      <SVG.Code size="24px" /> <div style={{ marginLeft: '8px' }}>View Source</div>
                    </div>
                  ) : null}
                </div>
                <div className={STYLES_GAME_DESCRIPTION}>{gameDescription}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class GameInfoModalWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => (
              <GameInfoModal
                navigateToHome={navigator.navigateToHome}
                navigateToGameUrl={navigator.navigateToGameUrl}
                projectOwner={currentUser.user}
                onGameSelect={this.props.onGameSelect}
                onUserSelect={this.props.onUserSelect}
                {...this.props}
              />
            )}
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
