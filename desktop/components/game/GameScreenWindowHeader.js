import * as React from 'react';
import * as GameSVG from '~/components/primitives/game-screen-svg';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  height: 24px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  color: #222;
  font-size: 12px;
`;

const STYLES_CTA = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const CTA = (props) => {
  return (
    <span
      className={STYLES_CTA}
      style={{ ...props.style, color: props.active ? 'magenta' : null }}
      onClick={props.onClick}>
      {props.children}
    </span>
  );
};

const STYLES_LEFT = css`
  min-width: 10%;
  width: 100%;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
`;

export default class GameScreenWindowHeader extends React.Component {
  static defaultProps = {
    navigateToHome: () => {},
    onGameMinimize: () => {},
    onGameMaximize: () => {},
    onGameDismiss: () => {},
  };

  render() {
    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_LEFT}>
          {this.props.navigateToHome ? (
            <CTA style={{ marginRight: 24 }} onClick={this.props.navigateToHome}>
              <GameSVG.Home
                height="12px"
                style={{ marginRight: 8 }}
                onClick={this.props.navigateToHome}
              />{' '}
              Home
            </CTA>
          ) : null}
        </div>
        <div className={STYLES_RIGHT}>
          {this.props.onGameMinimize ? (
            <CTA style={{ marginRight: 16 }} onClick={this.props.onGameMinimize}>
              <GameSVG.Minimize
                height="12px"
                style={{ marginRight: 8 }}
                onClick={this.props.onGameMinimize}
              />{' '}
              Minimize
            </CTA>
          ) : null}
          {this.props.onGameMaximize ? (
            <CTA style={{ marginRight: 16 }} onClick={this.props.onGameMaximize}>
              <GameSVG.Maximize2
                height="12px"
                style={{ marginRight: 8 }}
                onClick={this.props.onGameMaximize}
              />{' '}
              Maximize
            </CTA>
          ) : null}
          {this.props.onGameDismiss ? (
            <CTA onClick={this.props.onGameDismiss}>
              <GameSVG.Dismiss
                height="12px"
                style={{ marginRight: 8 }}
                onClick={this.props.onGameDismiss}
              />{' '}
              End game
            </CTA>
          ) : null}
        </div>
      </header>
    );
  }
}
