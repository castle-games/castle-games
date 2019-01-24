import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import GameScreen from '~/screens/GameScreen';
import HomeScreen from '~/screens/HomeScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import LoginSignupScreen from '~/screens/LoginSignupScreen';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
`;

export default class ContentContainer extends React.Component {
  static contextType = NavigationContext;

  _renderContent = (mode) => {
    if (mode === 'game') {
      return (
        <GameScreen />
      );
    } else if (mode === 'home') {
      return (
        <HomeScreen
          onCreateProject={this.props.onCreateProject}
          onLoadHelp={this.props.onLoadHelp}
          featuredMedia={this.props.featuredMedia}
        />
      );
    } else if (mode === 'profile') {
      return (
        <ProfileScreen />
      );
    } else if (mode === 'signin') {
      return (
        <LoginSignupScreen />
      );
    }
    return (<div>Its the content</div>);
  };
  
  render() {
    const navigation = this.context;
    return (
      <div className={STYLES_CONTAINER}>
        <ContentNavigationBar />
        {this._renderContent(navigation.contentMode)}
      </div>
    );
  }
}
