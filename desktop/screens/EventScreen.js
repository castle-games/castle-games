import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIButton from '~/components/reusable/UIButton';

const STYLES_HOME_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CONTENT_CONTAINER = css`
  margin: 24px auto;
  padding: 0 24px;
  width: 100%;
  max-width: 768px;
`;

const STYLES_PARAGRAPH = css`
  margin-bottom: 24px;
  font-size: 16px;
  line-height: 20px;
`;

const STYLES_GAMES_CONTAINER = css`
  margin-bottom: 16px;
`;

const STYLES_SECTION_TITLE = css`
  font-weight: 400;
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  padding: 0px 0 16px 0;
`;

class EventScreen extends React.Component {
  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `event`, ...options });
  };

  _navigateToGameMeta = (game, options) => {
    return this.props.navigateToGameMeta(game, { launchSource: `event`, ...options });
  };

  _navigateToParty = () => {
    NativeUtil.openExternalURL('https://castle.games/party');
  };

  render() {
    return (
      <div className={STYLES_HOME_CONTAINER}>
        <div className={STYLES_CONTENT_CONTAINER}>
          <img
            src="https://castle.games/static/halloween.png"
            className={css`
              max-width: 100%;
              height: auto;
              margin-bottom: 16px;
            `}
          />
          <div className={STYLES_SECTION_TITLE}>Castle Halloween Party</div>
          <div className={STYLES_PARAGRAPH}>
            Join us from October 25th to November 7, 2019 while we hang out, make games, and play
            games in Castle. If you make a cool game, we'll give you a rare T-Shirt, and there are
            even some cash awards!
          </div>
          <UIButton onClick={this._navigateToParty}>Go to Event Page</UIButton>
        </div>
      </div>
    );
  }
}

export default class EventScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <EventScreen
            navigateToUserProfile={navigator.navigateToUserProfile}
            navigateToGame={navigator.navigateToGame}
            navigateToGameMeta={navigator.navigateToGameMeta}
            navigator={navigator}
            {...this.props}
          />
        )}
      </NavigatorContext.Consumer>
    );
  }
}
