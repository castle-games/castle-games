import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import HomeScreen from '~/screens/HomeScreen';
import ProfileScreen from '~/screens/ProfileScreen';
import LoginSignupScreen from '~/screens/LoginSignupScreen';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
`;

export default class ContentContainer extends React.Component {
  state = {
    mode: 'home',
  };
  
  _renderContent = () => {
    if (this.state.mode === 'home') {
      return (
        <HomeScreen
          onUserSelect={this.props.onUserSelect}
          onCreateProject={this.props.onCreateProject}
          onMediaSelect={this.props.onMediaSelect}
          onLoadHelp={this.props.onLoadHelp}
          featuredMedia={this.props.featuredMedia}
        />
      );
    } else if (this.state.mode === 'profile') {
      // TODO: distinguish own profile from other profiles
      return (
        <ProfileScreen
          viewer={this.props.viewer}
          creator={this.props.viewer}
        />
      );
    } else if (this.state.mode === 'signin') {
      return (
        <LoginSignupScreen />
      );
    }
    return (<div>Its the content</div>);
  };

  _onSelectViewer = () => {
    if (this.props.viewer) {
      // TODO: distinguish own profile from other profiles
      this.setState({ mode: 'profile' });
    } else {
      this.setState({ mode: 'signin' });
    }
  };
  
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <ContentNavigationBar
          viewer={this.props.viewer}
          onSelectViewer={this._onSelectViewer}
        />
        {this._renderContent()}
      </div>
    );
  }
}
