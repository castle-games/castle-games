import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import GameScreen from '~/screens/GameScreen';
import HomeScreen from '~/screens/HomeScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import LoginSignupScreen from '~/screens/LoginSignupScreen';
import { NavigationContext } from '~/contexts/NavigationContext';
import SearchScreen from '~/screens/SearchScreen';
import * as Strings from '~/common/strings';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default class ContentContainer extends React.Component {
  static contextType = NavigationContext;
  state = {
    searchQuery: '',
  };

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
      return <HomeScreen featuredGames={this.props.featuredGames} />;
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
    const navigation = this.context;

    let contentElement;
    if (Strings.isEmpty(this.state.searchQuery)) {
      contentElement = this._renderContent(navigation.contentMode);
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
