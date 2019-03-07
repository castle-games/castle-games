import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';
import * as Strings from '~/common/strings';

import { NativeBinds } from '~/native/nativebinds';
import { css } from 'react-emotion';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';

import DevelopmentLogs from '~/components/game/DevelopmentLogs';
import UIButtonDarkSmall from '~/components/reusable/UIButtonDarkSmall';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_BUTTON = css`
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    transform: scale(1);
    transition: 200ms ease transform;

    :hover {
      transform: scale(1.1);
    }
  }
`;

const STYLES_GAME_STRIP = css`
  height: 32px;
  width: 100%;
  background-color: #272727;
  color: ${Constants.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_GAME_STRIP_LEFT = css`
  font-family: ${Constants.font.mono};
  min-width: 25%;
  width: 100%;
  padding: 0 0 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 12px;
  line-height: 12px;
  text-transform: uppercase;
`;

const STYLES_GAME_STRIP_RIGHT = css`
  flex-shrink: 0;
  padding: 0 12px 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
`;

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const STYLES_LEFT_ACTIONS = css`
  padding-left: 16px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const STYLES_METADATA = css`
  padding: 16px 16px 0 16px;
  height: 172px;
  min-height: 96px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CREATOR_LINK = css`
  cursor: pointer;
  font-weight: 600;
  transition: 200ms ease color;
  color: ${Constants.colors.brand2};

  :hover {
    color: ${Constants.colors.brand3};
  }

  :visited {
    color: ${Constants.colors.brand2};
  }
`;

const STYLES_DESCRIPTION = css`
  margin: 16px 0 16px 0;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

export default class GameActionsBar extends React.Component {
  static contextType = DevelopmentContext;

  state = {
    isDescriptionVisible: false,
  };

  _handleDescriptionToggle = () => {
    this.setState(
      {
        isDescriptionVisible: !this.state.isDescriptionVisible,
      },
      this.props.onUpdateGameWindowFrame
    );
  };

  _renderPlaying = (game, muteElement) => {
    let color;
    let backgroundColor;
    if (game.metadata && game.metadata.primaryColor) {
      backgroundColor = `#${game.metadata.primaryColor}`;
      color = Constants.colors.white;
    }

    let title = 'Untitled';
    let publishedInfo = 'Anonymous';
    let isRegistered = false;
    let description = '';
    if (game) {
      title = game.title ? game.title : title;
      isRegistered = !Strings.isEmpty(game.gameId);
      description = game.description ? game.description : description;

      let username = 'Anonymous';
      let updated;
      if (isRegistered) {
        username = (
          <span
            className={STYLES_CREATOR_LINK}
            onClick={() => this.props.navigateToUserProfile(game.owner)}>
            {game.owner.username}
          </span>
        );
        updated = Strings.toDate(game.updatedTime);
      } else {
        username = game.owner ? game.owner : username;
        updated = 'in development';
      }
      publishedInfo = (
        <React.Fragment>
          {username}&nbsp;╱&nbsp;{updated}
        </React.Fragment>
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_GAME_STRIP} style={{ backgroundColor }}>
          <div className={STYLES_GAME_STRIP_LEFT}>
            {title}&nbsp;╱&nbsp;{publishedInfo}
          </div>
          <div className={STYLES_GAME_STRIP_RIGHT}>
            <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleDescriptionToggle}>
              {this.state.isDescriptionVisible ? `Hide description` : `Show description`}
            </UINavigationLink>
            <UINavigationLink style={{ marginRight: 20 }} onClick={this.props.closeGame}>
              Close game
            </UINavigationLink>
            {muteElement}
          </div>
        </div>
        {this.state.isDescriptionVisible ? (
          <div className={STYLES_METADATA}>
            <div className={STYLES_DESCRIPTION}>{description}</div>
          </div>
        ) : null}
      </div>
    );
  };

  _renderDeveloping = (game, muteElement) => {
    // TODO: mute etc.
    return (
      <div className={STYLES_CONTAINER}>
        <DevelopmentLogs
          logs={this.context.logs}
          onClearLogs={this.context.setters.clearLogs}
          game={game}
        />
      </div>
    );
  };

  render() {
    let muteIcon = this.props.isMuted ? <SVG.Mute height="14px" /> : <SVG.Audio height="14px" />;
    let muteElement = (
      <span className={STYLES_BUTTON} onClick={this.props.onToggleMute}>
        {muteIcon}
      </span>
    );

    let { game } = this.props;
    if (this.context.isDeveloping) {
      return this._renderDeveloping(game, muteElement);
    } else {
      return this._renderPlaying(game, muteElement);
    }
  }
}
