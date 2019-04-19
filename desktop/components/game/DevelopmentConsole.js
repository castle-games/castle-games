import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';
import * as Utilities from '~/common/utilities';

import { css } from 'react-emotion';
import { DevelopmentContext } from '~/contexts/DevelopmentContext';

import DevelopmentLogs from '~/components/game/DevelopmentLogs';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  border-top: 1px solid ${Constants.colors.background4};
  background: #020202;
  width: 100%;
  display: flex;
  height: 196px;
  min-height: 96px;

  @keyframes fade-in-up-dev {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: fade-in-up-dev 200ms ease;
`;

const STYLES_GAME_CONTROLS = css`
  color: ${Constants.colors.white};
  border-right: 1px solid ${Constants.colors.background4};
  padding: 8px 24px 8px 24px;
  width: 50%;
  min-width: 196px;
  max-width: 50%;
  display: flex;
  flex-direction: column;
`;

const STYLES_CONTROLS_TOP = css`
  height: 100%;
`;

const STYLES_CONTROLS_BOTTOM = css``;

const STYLES_HALF = css`
  width: 50%;
  max-width: 50%;
`;

const STYLES_GAME_URL = css`
  font-family: ${Constants.font.mono};
  font-size: ${Constants.typescale.lvl7};
  color: rgba(200, 200, 200, 1);
  text-decoration: underline;
  cursor: default;
  margin-bottom: 24px;
  word-break: break-word;
`;

const STYLES_LABEL_ACTION = css`
  font-size: ${Constants.typescale.lvl7};
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const STYLES_PARAGRAPH = css`
  font-size: ${Constants.typescale.lvl7};
  color: rgba(200, 200, 200, 1);
  cursor: default;
`;

export default class DevelopmentConsole extends React.Component {
  static contextType = DevelopmentContext;

  _renderMultiplayerUploadStatus = () => {
    if (this.context.isMultiplayerCodeUploadEnabled) {
      return (
        <React.Fragment>
          <div className={STYLES_LABEL_ACTION}>Multiplayer auto upload is enabled</div>
          <div className={STYLES_PARAGRAPH}>
            When you Reload, Castle uploads a copy of your project's code to a temporary public url,
            and loads it from there.
          </div>
        </React.Fragment>
      );
    }
    return null;
  };

  _renderBottomActions = () => {
    let multiplayerHostingControl;
    if (Utilities.isMultiplayer(this.props.game) && Urls.isPrivateUrl(this.props.game.url)) {
      const { isMultiplayerCodeUploadEnabled } = this.context;
      multiplayerHostingControl = (
        <UINavigationLink
          onClick={() =>
            this.context.setters.setIsMultiplayerCodeUploadEnabled(!isMultiplayerCodeUploadEnabled)
          }>
          {isMultiplayerCodeUploadEnabled
            ? 'Disable Multiplayer Auto Upload'
            : 'Enable Multiplayer Auto Upload'}
        </UINavigationLink>
      );
    }
    return (
      <div className={STYLES_CONTROLS_BOTTOM}>
        <UINavigationLink style={{ marginRight: 24 }} onClick={this.props.reloadGame}>
          Reload Project
        </UINavigationLink>
        {multiplayerHostingControl}
      </div>
    );
  };

  render() {
    const { game } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_GAME_CONTROLS}>
          <div className={STYLES_CONTROLS_TOP}>
            <div className={STYLES_LABEL_ACTION}>Project Url</div>
            <div className={STYLES_GAME_URL}>{game.url}</div>
            {this._renderMultiplayerUploadStatus()}
          </div>
          {this._renderBottomActions()}
        </div>
        <div className={STYLES_HALF}>
          <DevelopmentLogs
            logs={this.context.logs}
            onClearLogs={this.context.setters.clearLogs}
            game={game}
          />
        </div>
      </div>
    );
  }
}
