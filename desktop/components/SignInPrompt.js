import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_PARAGRAPH = css`
  line-height: ${Constants.linescale.base};
  font-size: 14px;
  font-weight: 400;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const STYLES_BOLD = css`
  font-weight: 700;
`;

class SignInPrompt extends React.Component {
  static defaultProps = {
    deferredNavigationState: null,
  };

  _renderDefaultPrompt = () => {
    return (
      <div className={STYLES_PARAGRAPH}>
        Sign in or register with Castle to share and play games with the Castle community.
      </div>
    );
  };

  _renderGamePrompt = (params) => {
    const title = params.game ? params.game.title : 'games';
    return (
      <div className={STYLES_PARAGRAPH}>
        Sign in or register with Castle to play <span className={STYLES_BOLD}>{title}</span> with
        the Castle community.
      </div>
    );
  };

  render() {
    let { deferredNavigationState } = this.props;
    let prompt;
    if (deferredNavigationState) {
      const { mode, params } = deferredNavigationState;
      if (mode === 'game') {
        prompt = this._renderGamePrompt(params);
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
