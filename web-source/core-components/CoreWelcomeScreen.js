import * as React from 'react';
import * as Constants from '~/common/constants';
import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_CONTENT = css`
  margin: 0 auto 0 auto;
  padding: 0 24px 0 24px;
  max-width: 480px;
  width: 100%;
`;

const STYLES_TITLE = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.white60};
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.2px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.white60};
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.5;
`;

const STYLES_ACTIONS = css`
  margin-top: 24px;
  font-size: 18px;
  flex-shrink: 0;
  border-top: 1px solid ${Constants.colors.white25};
`;

const STYLES_OPTION = css`
  color: ${Constants.colors.white60};
  border-bottom: 1px solid ${Constants.colors.white25};
  font-size: 12px;
  font-weight: 600;
  padding: 16px 0 16px 0;
  transition: 200ms ease color;

  :hover {
    cursor: pointer;
    color: ${Constants.colors.white};
  }
`;

export default class CoreWelcomeScreen extends React.Component {
  render() {
    const controlStyle = {
      fontSize: '18px',
    };
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <h2 className={STYLES_TITLE}>Welcome to Castle</h2>
          <p className={STYLES_PARAGRAPH}>
            Get started by exploring games from the latest game jam, or play a random game.
          </p>

          <div className={STYLES_ACTIONS}>
            <div className={STYLES_OPTION} onClick={this.props.onToggleSidebar}>
              →&nbsp;&nbsp;Explore games.
            </div>

            <div className={STYLES_OPTION} onClick={this.props.onSelectRandom}>
              →&nbsp;&nbsp;Play a random game.
            </div>
          </div>
        </div>
      </div>
    );
  }
}
