import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

import { DevelopmentContext } from '~/contexts/DevelopmentContext';
import DevelopmentLogs from '~/components/game/DevelopmentLogs';
import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  background: #020202;
  width: 100%;
  display: flex;
  height: 196px;
  min-height: 96px;
  border-top: 1px solid rgba(255, 255, 255, 0.5);

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
  padding: 8px 24px 8px 24px;
  width: 50%;
  min-width: 196px;
  color: ${Constants.colors.white};
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
`;

const STYLES_CONTROLS_TOP = css`
  height: 100%;
`;

const STYLES_CONTROLS_BOTTOM = css``;

const STYLES_HALF = css`
  width: 50%;
`;

const STYLES_GAME_URL = css`
  font-family: ${Constants.font.mono};
  font-size: ${Constants.typescale.lvl7};
  color: rgba(200, 200, 200, 1);
  text-decoration: underline;
  cursor: default;
`;

const STYLES_LABEL_ACTION = css`
  font-size: ${Constants.typescale.lvl7};
  margin-bottom: 8px;
  text-transform: uppercase;
`;

export default class DevelopmentConsole extends React.Component {
  static contextType = DevelopmentContext;

  render() {
    const { game } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_GAME_CONTROLS}>
          <div className={STYLES_CONTROLS_TOP}>
            <div className={STYLES_LABEL_ACTION}>Project Url</div>
            <div className={STYLES_GAME_URL}>{game.url}</div>
          </div>
          <div className={STYLES_CONTROLS_BOTTOM}>
            <UINavigationLink onClick={this.props.reloadGame}>Reload</UINavigationLink>
          </div>
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
