import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { DevelopmentSetterContext } from '~/contexts/DevelopmentContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';

import BrowseScreen from '~/screens/BrowseScreen';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import CreateProjectScreen from '~/screens/CreateProjectScreen';
import EditPostScreen from '~/screens/EditPostScreen';
import EventScreen from '~/screens/EventScreen';
import GameMetaScreen from '~/screens/GameMetaScreen';
import GameScreen from '~/screens/GameScreen';
import GameWindow from '~/native/gamewindow';
import HomeScreen from '~/screens/HomeScreen';
import NotificationScreen from '~/screens/NotificationScreen';
import NowPlayingBar from '~/components/NowPlayingBar';
import ProfileScreen from '~/screens/ProfileScreen';
import SearchScreen from '~/screens/SearchScreen';
import SignInScreen from '~/screens/SignInScreen';

const STYLES_CONTAINER_FLUID = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const STYLES_CONTAINER_FIXED_WITH_BORDER = css`
  width: 480px;
  flex-shrink: 0;
`;

class ContentContainer extends React.Component {
  static defaultProps = {
    mode: 'home',
    playing: {},
    setIsDeveloping: () => {},
  };

  state = {
    searchQuery: '',
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.playing.game &&
      this.props.playing.isVisible &&
      this.props.playing.timeLoaded !== prevProps.playing.timeLoaded
    ) {
      // if we loaded a new game, auto-show logs for local urls
      const isLocal = Urls.isPrivateUrl(this.props.playing.game.url);
      this.props.setIsDeveloping(isLocal, { onlyEnable: true });
    }

    if (this.props.mode !== prevProps.mode) {
      this.setState({ searchQuery: '' });
    }
  }

  _handleSearchReset = () => {
    this.setState({
      searchQuery: '',
    });
  };

  _handleSearchChange = async (e) => {
    this.setState(
      {
        searchQuery: e.target.value,
      },
      () => {
        if (Strings.isEmpty(this.state.searchQuery)) {
          return this._handleSearchReset();
        }
      }
    );
  };

  _handleSearchSubmit = async (e) => {
    const { isUrl } = Urls.getCastleUrlInfo(e.target.value);
    if (!isUrl) {
      return this._handleSearchChange(e);
    }

    let url = e.target.value;
    try {
      url = url.slice(0).trim();
      if (Urls.isPrivateUrl(url)) {
        url = url.replace('castle://', 'http://');
      }
    } catch (_) {}

    this.props.navigator.openUrl(url, { launchSource: 'search', allowCastleContentType: true });
    this._handleSearchReset();
  };

  _renderContent = (mode, playing) => {
    if (playing.isVisible) {
      return <GameScreen />;
    }
    if (mode === 'home') {
      return (
        <HomeScreen
          updateAvailable={this.props.updateAvailable}
          onNativeUpdateInstall={this.props.onNativeUpdateInstall}
        />
      );
    } else if (mode === 'browse') {
      return <BrowseScreen />;
    } else if (mode === 'event') {
      return <EventScreen />;
    } else if (mode === 'game-meta') {
      return <GameMetaScreen />;
    } else if (mode === 'create') {
      return <CreateProjectScreen />;
    } else if (mode === 'profile') {
      return <ProfileScreen />;
    } else if (mode === 'notifications') {
      return <NotificationScreen />;
    } else if (mode === 'edit_post') {
      return <EditPostScreen />;
    }
  };

  _renderSearch = () => {
    return (
      <SearchScreen
        query={this.state.searchQuery}
        onSearchReset={this._handleSearchReset}
        viewer={this.props.viewer}
      />
    );
  };

  render() {
    let contentElement;
    if (this.props.isShowingSignIn) {
      contentElement = <SignInScreen navigateToHome={this.props.navigator.navigateToHome} />;
    } else if (Strings.isEmpty(this.state.searchQuery)) {
      contentElement = this._renderContent(this.props.mode, this.props.playing);
    } else {
      contentElement = this._renderSearch();
    }

    let nowPlayingElement;
    if (this.props.playing.game && !this.props.playing.isVisible) {
      nowPlayingElement = (
        <NowPlayingBar game={this.props.playing.game} navigator={this.props.navigator} />
      );
    }

    return (
      <div className={STYLES_CONTAINER_FLUID}>
        {!this.props.playing.isVisible && !this.props.isShowingSignIn ? (
          <ContentNavigationBar
            searchQuery={this.state.searchQuery}
            onSearchReset={this._handleSearchReset}
            onSearchChange={this._handleSearchChange}
            onSearchSubmit={this._handleSearchSubmit}
            mode={this.props.mode}
          />
        ) : null}
        {contentElement}
        {nowPlayingElement}
      </div>
    );
  }
}

export default class ContentContainerWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <DevelopmentSetterContext.Consumer>
            {(development) => (
              <NavigationContext.Consumer>
                {(navigation) => {
                  return (
                    <NavigatorContext.Consumer>
                      {(navigator) => (
                        <ContentContainer
                          viewer={currentUser ? currentUser.user : null}
                          mode={navigation.content.mode}
                          isShowingSignIn={navigation.isShowingSignIn}
                          timeLastNavigated={navigation.timeLastNavigated}
                          playing={navigation.playing}
                          navigator={navigator}
                          setIsDeveloping={development.setIsDeveloping}
                          {...this.props}
                        />
                      )}
                    </NavigatorContext.Consumer>
                  );
                }}
              </NavigationContext.Consumer>
            )}
          </DevelopmentSetterContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
