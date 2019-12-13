import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  height: 48px;
  width: 100%;
  background: linear-gradient(to top, #cccccc 0%, #d6d6d6 1px, #ebebeb 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  color: #222;
  font-size: 12px;
  border-top: 1px solid #f3f3f3;
`;

const STYLES_LEFT = css`
  min-width: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding-right: 16px;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
`;

const STYLES_ACTION = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const STYLES_NOW_PLAYING = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  @keyframes button-color-change {
    0% {
      color: #222;
    }
    50% {
      color: ${Constants.colors.brand2};
    }
    100% {
      color: #222;
    }
  }
  animation: button-color-change infinite 800ms;
`;

const STYLES_COVER = css`
  width: 50px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  background-size: cover;
  background-position: 50% 50%;
  background-color: ${Constants.colors.black};
  margin-right: 8px;
`;

export default class NowPlayingBar extends React.Component {
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
    const title = game && game.title ? Strings.elide(game.title, 21) : 'Untitled';

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_LEFT} onClick={this._handleNavigatePlaying}>
          <div className={STYLES_NOW_PLAYING}>
            <figure
              className={STYLES_COVER}
              style={{
                backgroundImage:
                  game.coverImage && game.coverImage.url ? `url(${game.coverImage.url})` : null,
              }}
            />
            <p className={STYLES_ACTION}>Now playing: {title}</p>
          </div>
          <div className={STYLES_ACTION} style={{ flexShrink: 0 }}>
            <SVG.Play height="10px" style={{ marginRight: 8 }} />
            Return to Game
          </div>
        </div>
        <div className={STYLES_RIGHT}>
          <div className={STYLES_ACTION} onClick={this._handleCloseGame}>
            <SVG.DismissGame height="12px" style={{ marginRight: 8 }} />
            End game
          </div>
        </div>
      </div>
    );
  }
}
