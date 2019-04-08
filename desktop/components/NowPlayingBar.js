import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_GAME_STRIP = css`
  height: 32px;
  width: 100%;
  color: ${Constants.colors.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_GAME_STRIP_LEFT = css`
  font-family: ${Constants.font.mono};
  min-width: 25%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 11px;
  line-height: 10px;
  letter-spacing: 0.1px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const STYLES_GAME_STRIP_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
`;

const STYLES_CONTAINER = css`
  background: #232323;
  width: 100%;
`;

const STYLES_EMPHASIS_CHOICE = css`
  font-family: ${Constants.font.mono};
  background: #313131;
  flex-shrink: 0;
  color: ${Constants.colors.white};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default class NowPlayingBar extends React.Component {
  state = {
    toggleUIColor: false,
  };
  _toggleUIColorInterval = null;

  componentDidMount() {
    this._mounted = true;
    this._toggleUIColorInterval = setInterval(this._toggleColor, 300);
  }

  componentWillUnmount() {
    if (this._toggleUIColorInterval) {
      clearInterval(this._toggleUIColorInterval);
      this._toggleUIColorInterval = null;
    }
    this._mounted = false;
  }

  _toggleColor = () => {
    if (this._mounted) {
      this.setState((state) => {
        return { ...state, toggleUIColor: !state.toggleUIColor };
      });
    }
  };

  _handleNavigatePlaying = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.navigator.navigateToCurrentGame();
  };

  _handleCloseGame = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.navigator.clearCurrentGame();
  };

  render() {
    const { game } = this.props;

    let color;
    let backgroundColor;
    if (game.metadata && game.metadata.primaryColor) {
      backgroundColor = `#${game.metadata.primaryColor}`;
      color = Constants.colors.white;
    }

    let title = 'Untitled';
    if (game) {
      title = game.title ? `${game.title}` : title;
    }

    let toggleColorStyles;
    if (this.state.toggleUIColor) {
      toggleColorStyles = { color: Constants.brand.fuchsia };
    }

    return (
      <div className={STYLES_CONTAINER}>
        <span className={STYLES_GAME_STRIP}>
          <span className={STYLES_GAME_STRIP_LEFT}>
            <UINavigationLink
              onClick={this._handleNavigatePlaying}
              style={{
                width: '100%',
                paddingLeft: 24,
                height: 32,
                display: 'inline-flex',
                alignItems: 'center',
                ...toggleColorStyles,
              }}>
              ► Return to {title}
            </UINavigationLink>
          </span>
          <span className={STYLES_GAME_STRIP_RIGHT}>
            <span className={STYLES_EMPHASIS_CHOICE}>
              <UINavigationLink
                onClick={this._handleCloseGame}
                style={{
                  padding: '0 24px 0 24px',
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                }}>
                End game
              </UINavigationLink>
            </span>
          </span>
        </span>
      </div>
    );
  }
}
