import * as React from 'react';
import * as NativeUtil from '~/native/nativeutil';

import { NativeBinds } from '~/native/nativebinds';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';

import Game from '~/components/game/Game';

class GameScreen extends React.Component {
  static defaultProps = {
    game: null,
    isFullScreen: false,
    setIsFullScreen: (state) => {},
  };

  state = {
    isMuted: false,
  };

  _handleToggleMute = () => {
    const isMuted = !this.state.isMuted;
    NativeUtil.sendLuaEvent('CASTLE_SET_VOLUME', isMuted ? 0 : 1);
    this.setState({ isMuted });
  };

  _handleFullScreen = () => {
    this.props.setIsFullScreen(!this.props.isFullScreen);

    // TODO(jim):
    // - works for Windows
    // - does not work for MacOS.
    // - will need someone with native knowledge to help.
    /*
    try {
      NativeUtil.setWindowFrameFullscreen(!this.props.isFullScreen);
    } catch (e) {
      console.log(e);
    }
    */
  };

  render() {
    return (
      <Game
        game={this.props.game}
        isFullScreen={this.props.isFullScreen}
        isMuted={this.state.isMuted}
        timeGameLoaded={this.props.timeGameLoaded}
        timeNavigatedToGame={this.props.timeNavigatedToGame}
        navigateToUserProfile={this.props.navigateToUserProfile}
        navigateToEditPost={this.props.navigateToEditPost}
        navigateToGameUrl={this.props.navigateToGameUrl}
        navigateToGame={this.props.navigateToGame}
        navigateToHome={this.props.navigateToHome}
        onGameDismiss={this.props.clearCurrentGame}
        onGameMaximize={this._handleFullScreen}
        onGameMinimize={this.props.minimizeGame}
        onToggleMute={this._handleToggleMute}
        onCreatePost={this.props.navigateToEditPost}
        onReload={this.props.reloadGame}
        onViewSource={() => {}}
        refreshCurrentUser={this.props.refreshCurrentUser}
      />
    );
  }
}

export default class GameScreenWithContext extends React.Component {
  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <NavigationContext.Consumer>
            {(navigation) => (
              <CurrentUserContext.Consumer>
                {(currentUser) => (
                  <GameScreen
                    game={navigation.game}
                    post={navigation.post}
                    gameParams={navigation.gameParams}
                    referrerGame={navigation.referrerGame}
                    timeGameLoaded={navigation.timeGameLoaded}
                    timeNavigatedToGame={navigation.timeLastNavigated}
                    navigateToUserProfile={navigator.navigateToUserProfile}
                    navigateToEditPost={navigator.navigateToEditPost}
                    navigateToGameUrl={navigator.navigateToGameUrl}
                    navigateToGame={navigator.navigateToGame}
                    navigateToHome={navigator.navigateToHome}
                    minimizeGame={navigator.minimizeGame}
                    isFullScreen={navigation.isFullScreen}
                    setIsFullScreen={navigator.setIsFullScreen}
                    reloadGame={navigator.reloadGame}
                    clearCurrentGame={navigator.clearCurrentGame}
                    isLoggedIn={currentUser.user !== null}
                    me={currentUser.user}
                    refreshCurrentUser={currentUser.refreshCurrentUser}
                    {...this.props}
                  />
                )}
              </CurrentUserContext.Consumer>
            )}
          </NavigationContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
