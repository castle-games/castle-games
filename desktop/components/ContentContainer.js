import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import { DevelopmentSetterContext } from '~/contexts/DevelopmentContext';
import GameScreen from '~/screens/GameScreen';
import HomeScreen from '~/screens/HomeScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import LoginSignupScreen from '~/screens/LoginSignupScreen';
import { NavigationContext } from '~/contexts/NavigationContext';
import SearchScreen from '~/screens/SearchScreen';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

class ContentContainer extends React.Component {
  static defaultProps = {
    mode: 'home',
    setIsDeveloping: () => {},
  };
  state = {
    searchQuery: '',
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.mode === 'game' &&
      this.props.timeGameLoaded !== prevProps.timeGameLoaded &&
      this.props.game
    ) {
      // if we loaded a new game, auto-show logs for local urls
      const isLocal = Urls.isPrivateUrl(this.props.game.url);
      this.props.setIsDeveloping(isLocal);
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

  _handleSearchSubmit = async (e) => this._handleSearchChange(e);

  _renderContent = (mode) => {
    if (mode === 'game') {
      return <GameScreen />;
    } else if (mode === 'home') {
      return (
        <HomeScreen
          featuredGames={this.props.featuredGames}
          updateAvailable={this.props.updateAvailable}
          onNativeUpdateInstall={this.props.onNativeUpdateInstall}
        />
      );
    } else if (mode === 'profile') {
      return <ProfileScreen />;
    } else if (mode === 'signin') {
      return <LoginSignupScreen />;
    }
  };

  _renderSearch = () => {
    return (
      <SearchScreen
        query={this.state.searchQuery}
        allContent={this.props.allContent}
        onSearchReset={this._handleSearchReset}
      />
    );
  };

  render() {
    let contentElement;
    if (Strings.isEmpty(this.state.searchQuery)) {
      contentElement = this._renderContent(this.props.mode);
    } else {
      contentElement = this._renderSearch();
    }

    return (
      <div className={STYLES_CONTAINER}>
        <ContentNavigationBar
          searchQuery={this.state.searchQuery}
          onSearchReset={this._handleSearchReset}
          onSearchChange={this._handleSearchChange}
          onSearchSubmit={this._handleSearchSubmit}
        />
        {contentElement}
      </div>
    );
  }
}

export default class ContentContainerWithContext extends React.Component {
  render() {
    return (
      <DevelopmentSetterContext.Consumer>
        {(development) => (
          <NavigationContext.Consumer>
            {(navigation) => (
              <ContentContainer
                mode={navigation.contentMode}
                timeGameLoaded={navigation.timeGameLoaded}
                game={navigation.game}
                setIsDeveloping={development.setIsDeveloping}
                {...this.props}
              />
            )}
          </NavigationContext.Consumer>
        )}
      </DevelopmentSetterContext.Consumer>
    );
  }
}
