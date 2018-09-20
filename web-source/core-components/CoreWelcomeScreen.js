import * as React from 'react';
import * as Constants from '~/common/constants';
import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  width: '100%';
  height: '100%';
`;

const STYLES_CONTENT = css`
  min-width: 400px;
`;

const STYLES_TITLE = css`
  font-family: ${Constants.font.mono};
  font-size: 64px;
  font-weight: 200;
  letter-spacing: 0.2px;
  color: ${Constants.colors.white60};
  border-bottom: 1px solid ${Constants.colors.white20};
`;

const STYLES_ACTIONS = css`
  font-size: 18px;
  color: ${Constants.colors.white};
  margin: 40px 0 40px 0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default class CoreWelcomeScreen extends React.Component {
  render() {
    const controlStyle = {
      fontSize: '18px',
    };
    return (
      <div
        className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <p className={STYLES_TITLE}>Castle</p>
          <div className={STYLES_ACTIONS}>
            <UIControl
              onClick={this.props.onToggleSidebar}
              style={controlStyle}>Explore Games</UIControl>
            <UIControl
              onClick={this.props.onSelectRandom}
              style={controlStyle}>Random Game</UIControl>
          </div>
        </div>
      </div>
    );
  }
}
