import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_PARAGRAPH = css`
  line-height: ${Constants.linescale.base};
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
`;

const STYLES_GAME_PREVIEW = css`
  display: flex;
  margin-bottom: 12px;
`;

const STYLES_BOLD = css`
  font-weight: 700;
`;

const STYLES_GAME_TITLE = css`
  white-space: nowrap;
  font-weight: 700;
`;

const STYLES_GAME_COVER = css`
  background-color: black;
  background-size: cover;
  background-position: 50% 50%;
  width: 96px;
  height: 64px;
  flex-shrink: 0;
  margin-right: 16px;
`;

class SignInPrompt extends React.Component {
  static defaultProps = {
    deferredNavigationState: null,
  };

  _renderDefaultPrompt = () => {
    return (
      <div className={STYLES_PARAGRAPH}>
        Sign in or register with Castle to play and create games with the Castle community.
      </div>
    );
  };

  _renderCreatePrompt = () => {
    const coverSrc =
      'https://raw.githubusercontent.com/bridgs/lil-adventure/master/cover-image.png';
    return (
      <div className={STYLES_GAME_PREVIEW}>
        <div className={STYLES_GAME_COVER} style={{ backgroundImage: `url(${coverSrc})` }} />
        <div className={STYLES_PARAGRAPH}>
          Sign in or make a new account to{' '}
          <span className={STYLES_BOLD}>start creating your first Castle game</span>.
        </div>
      </div>
    );
  };

  _renderGamePrompt = (params) => {
    const { game } = params;
    let title, coverSrc;
    if (game) {
      title = game.title;
      coverSrc = game.coverImage ? game.coverImage.url : null;
    } else {
      title = 'games';
    }
    return (
      <div className={STYLES_GAME_PREVIEW}>
        <div
          className={STYLES_GAME_COVER}
          style={{ backgroundImage: coverSrc ? `url(${coverSrc})` : null }}
        />
        <div className={STYLES_PARAGRAPH}>
          Sign in or register with Castle to play <span className={STYLES_GAME_TITLE}>{title}</span>{' '}
          with the Castle community.
        </div>
      </div>
    );
  };

  render() {
    let { deferredNavigationState } = this.props;
    let prompt;
    if (deferredNavigationState) {
      const { mode, params } = deferredNavigationState;
      if (mode === 'create') {
        prompt = this._renderCreatePrompt();
      } else if (params.playing && params.playing.game) {
        prompt = this._renderGamePrompt(params.playing);
      }
    }

    if (!prompt) {
      // the user had no particular intent before hitting the auth wall, so just
      // give some default instructions.
      prompt = this._renderDefaultPrompt();
    }
    return <React.Fragment>{prompt}</React.Fragment>;
  }
}

export default class SignInPromptWithContext extends React.Component {
  render() {
    return (
      <NavigationContext.Consumer>
        {(navigation) => (
          <SignInPrompt deferredNavigationState={navigation.deferredNavigationState} />
        )}
      </NavigationContext.Consumer>
    );
  }
}
