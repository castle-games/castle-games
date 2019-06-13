import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Utilities from '~/common/utilities';
import * as Urls from '~/common/urls';
import * as NativeUtil from '~/native/nativeutil';
import * as SVG from '~/components/primitives/svg';
import * as SVGC from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_GAME = css`
  display: inline-block;
  margin: 0px 4px 48px 8px;
  position: relative;
  max-width: ${Constants.sizes.cardWidth};
  cursor: pointer;
`;

const STYLES_GAME_AUTHOR = css`
  font-family: ${Constants.font.system};
  margin-top: 4px;
  font-size: 14px;
  font-weight: 300;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

const STYLES_GAME_ITEM = css`
  background: ${Constants.colors.white};
  border-radius: 4px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: 200ms ease all;
  transition-property: transform, box-shadow, filter, background-color;
  :hover {
    transform: scale(1.02);
    figure {
      filter: brightness(110%);
    }
  }
`;

const STYLES_GAME_SCREENSHOT = css`
  width: ${Constants.sizes.cardWidth};
  height: 124px;
  flex-shrink: 0;
  border-radius: 4px 4px 0px 0px;
  transition: 70ms ease all;
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: rgba(0, 0, 0, 0.1);
`;

const STYLES_GAME_TITLE_SECTION = css`
  display: flex;
  align-items: center;
  margin-left: 12px;
  height: 64px;
`;

const STYLES_INFO = css`
  color: ${Constants.colors.text2};
  font-family: ${Constants.font.default};
  cursor: pointer;
  opacity: 0.8;
  margin: 16px 12px 0px 0px;
  margin-left: auto;
  align-self: start;
  transition: 500ms ease opacity;
`;

const STYLES_GAME_TITLE = css`
  font-family: ${Constants.font.game};
  font-size: 16px;
  margin-right: 8px;
  cursor: pointer;
`;

const STYLES_GAME_TITLE_AUTHOR = css`
  display: flex;
  flex-direction: column;
`;

const STYLES_BYLINE = css`
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
`;

const STYLES_URL = css`
  font-family: ${Constants.font.system};
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  overflow-wrap: break-word;
  max-width: 204px;
  width: 100%;
`;

const STYLES_UNDER_CONSTRUCTION = css`
  position: absolute;
  top: 0px;
  width: 100%;
  height: 24px;
  background: rgba(215, 215, 215, 0.925);
`;

const STYLES_UNDER_CONSTRUCTION_TITLE = css`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-family: ${Constants.font.game};
  font-size: 16px;
  font-weight: 600;
  color: black;
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
  };

  state = {
    isPopoverVisible: false,
    isHovering: false,
    isHoveringOnInfoButton: false,
  };

  _handleToggleHover = (shouldSetHovering) => {
    this.setState({ isHovering: shouldSetHovering });
  };

  // used for case where user left modal while hovering over a card
  // on the main games page. this prevents an issue where the info button
  // will not re-appear on the card unless they leave and re-enter the entire card
  _handleMouseMove = () => {
    if (!this.state.isHovering) {
      this.setState({ isHovering: true });
    }
  };

  _handleToggleHoverOnInfoButton = (shouldSetHovering) => {
    this.setState({ isHoveringOnInfoButton: shouldSetHovering });
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

  _handleShowGameInfo = () => {
    this.props.onShowGameInfo(this.props.game);
  };

  _handleGameSelect = () => {
    this.props.onGameSelect(this.props.game);
  };

  _renderCreator = (game) => {
    return (
      <div className={STYLES_BYLINE}>
        <div
          className={STYLES_AVATAR}
          onClick={() => this.props.onUserSelect(game.owner)}
          style={{
            backgroundImage:
              game.owner.photo && game.owner.photo.url ? `url(${game.owner.photo.url})` : null,
          }}
        />
        <div className={STYLES_AVATAR_CREATOR} onClick={() => this.props.onUserSelect(game.owner)}>
          {game.owner.name}
        </div>
      </div>
    );
  };

  render() {
    let { game } = this.props;
    let title = game.title ? game.title : 'Untitled';

    const backgroundColor =
      game.metadata && game.metadata.primaryColor ? `#${game.metadata.primaryColor}` : '#3d3d3d';
    const textColor = Utilities.adjustTextColorWithEmphasis(backgroundColor, this.state.isHovering);

    const finalColor = this.state.isHovering
      ? Utilities.colorLuminance(backgroundColor, 0.1)
      : backgroundColor;

    let description;
    let isPrivate = Urls.isPrivateUrl(game.url);

    if (isPrivate || !game.owner || !game.owner.name) {
      description = <div className={STYLES_URL}>{game.url}</div>;
    }

    return (
      <div
        className={STYLES_GAME}
        onMouseEnter={() => this._handleToggleHover(true)}
        onMouseLeave={() => this._handleToggleHover(false)}
        onMouseMove={this._handleMouseMove}>
        <div className={STYLES_GAME_ITEM} style={{ color: textColor, backgroundColor: finalColor }}>
          <figure
            className={STYLES_GAME_SCREENSHOT}
            onClick={this._handleGameSelect}
            style={{
              backgroundImage: this.props.src ? `url(${this.props.src})` : null,
            }}
          />
          <div className={STYLES_GAME_TITLE_SECTION}>
            <div className={STYLES_GAME_TITLE_AUTHOR}>
              <div className={STYLES_GAME_TITLE} onClick={this._handleGameSelect}>
                {title} {isPrivate ? <Tag>Local</Tag> : null} <br />
              </div>
              <div
                className={STYLES_GAME_AUTHOR}
                onClick={() => this.props.onUserSelect(game.owner)}>
                {game.owner.username}
              </div>
            </div>

            <div
              className={STYLES_INFO}
              style={{
                color: this.state.isHoveringOnInfoButton ? 'white' : textColor,
                visibility: this.state.isHovering ? 'visible' : 'hidden',
              }}
              onMouseEnter={() => this._handleToggleHoverOnInfoButton(true)}
              onMouseLeave={() => this._handleToggleHoverOnInfoButton(false)}
              onClick={this._handleShowGameInfo}>
              <SVG.Info height="32px" />
            </div>
          </div>
        </div>
        {description}
        {this.props.underConstruction ? (
          <div className={STYLES_UNDER_CONSTRUCTION}>
            <div className={STYLES_UNDER_CONSTRUCTION_TITLE}>
              <SVGC.Build size="12px" style={{ marginRight: '8px' }} />
              Under Construction
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
