import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIPostList from '~/components/reusable/UIPostList';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 64px;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

class PostsScreen extends React.Component {
  _navigateToGame = (game, options) => {
    return this.props.navigateToGame(game, { launchSource: `posts`, ...options });
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIPostList
          onUserSelect={this.props.navigateToUserProfile}
          onGameSelect={this._navigateToGame}
        />
      </div>
    );
  }
}

export default class PostsScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <PostsScreen
            navigateToUserProfile={navigator.navigateToUserProfile}
            navigateToGame={navigator.navigateToGame}
            {...this.props}
          />
        )}
      </NavigatorContext.Consumer>
    );
  }
}
