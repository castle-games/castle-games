import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import GameScreen from '~/screens/GameScreen';
import HistoryScreen from '~/screens/HistoryScreen';
import HomeScreen from '~/screens/HomeScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import LoginSignupScreen from '~/screens/LoginSignupScreen';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export default class ContentContainer extends React.Component {
  static contextType = NavigationContext;

  _renderContent = (mode) => {
    if (mode === 'game') {
      return (<GameScreen />);
    } else if (mode === 'home') {
      return (
        <HomeScreen
          featuredMedia={this.props.featuredMedia}
        />
      );
    } else if (mode === 'profile') {
      return (<ProfileScreen />);
    } else if (mode === 'signin') {
      return (<LoginSignupScreen />);
    } else if (mode === 'history') {
      return (<HistoryScreen />);
    }
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
