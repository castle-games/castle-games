import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';
import DevelopmentLogs from '~/components/game/DevelopmentLogs';
import UIButtonDarkSmall from '~/components/reusable/UIButtonDarkSmall';
import * as SVG from '~/components/primitives/svg';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  height: 144px;
  min-height: 96px;
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
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_TITLE_ROW = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.lvl5};
  line-height: ${Constants.linescale.lvl5};
  display: flex;
  width: 100%;
  align-items: center;
`;

const STYLES_CREATOR_ROW = css`
  display: flex;
  width: 100%;
  font-family: ${Constants.font.mono};
  font-size: ${Constants.typescale.lvl7};
  line-height: ${Constants.typescale.lvl7};
  text-transform: uppercase;
  margin-top: 8px;
`;

const STYLES_CREATOR_LINK = css`
  cursor: pointer;
  color: ${Constants.colors.action};
  text-decoration: underline;
`;

const STYLES_DESCRIPTION = css`
  margin: 16px 0 16px 0;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

export default class GameActionsBar extends React.Component {
  static contextType = DevelopmentContext;
  constructor(props) {
    super(props);
    this._update({}, props);
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, this.props);
  }

  _update = (prevProps, props) => {
    if (props.timeGameLoaded !== prevProps.timeGameLoaded && props.game) {
      // auto-show logs for local urls
      const isLocal = Urls.isPrivateUrl(props.game.url);
      // TODO: BEN this.context.setters.setIsDeveloping(isLocal);
    }
  };

  _renderPlaying = (game, muteElement) => {
    let title = 'Untitled';
    let publishedInfo = 'By Anonymous';
    let isRegistered = false;
    let description = '';
    if (game) {
      title = game.title ? game.title : title;
      isRegistered = !Strings.isEmpty(game.gameId);
      description = game.description ? game.description : description;
      let username = 'Anonymous',
        updated;
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
        <div>
          By {username} // {updated}
        </div>
      );
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_METADATA}>
          <div className={STYLES_TITLE_ROW}>
            {title}
            <div className={STYLES_LEFT_ACTIONS}>{muteElement}</div>
          </div>
          <div className={STYLES_CREATOR_ROW}>{publishedInfo}</div>
          <div className={STYLES_DESCRIPTION}>{description}</div>
        </div>
      </div>
    );
  };

  _renderDeveloping = (game, muteElement) => {
    // TODO: mute etc.
    return (
      <div className={STYLES_CONTAINER}>
        <DevelopmentLogs logs={this.context.logs} onClearLogs={this.context.setters.clearLogs} />
      </div>
    );
  };

  render() {
    let muteIcon = this.props.isMuted ? <SVG.Mute height="14px" /> : <SVG.Audio height="14px" />;
    let muteElement = (
      <UIButtonDarkSmall
        icon={muteIcon}
        onClick={this.props.onToggleMute}
        style={{ background: Constants.colors.black }}
      />
    );
    let { game } = this.props;
    if (this.context.isDeveloping) {
      return this._renderDeveloping(game, muteElement);
    } else {
      return this._renderPlaying(game, muteElement);
    }
  }
}
