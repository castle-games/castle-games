import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import ContentNavigationBar from '~/components/ContentNavigationBar';
import HomeScreen from '~/screens/HomeScreen';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.default};
  width: 100%;
`;

export default class ContentContainer extends React.Component {
  static defaultProps = {
    mode: 'home',
  };

  _renderContent = () => {
    if (this.props.mode === 'home') {
      return (
        <HomeScreen
          onUserSelect={this.props.onUserSelect}
          onCreateProject={this.props.onCreateProject}
          onMediaSelect={this.props.onMediaSelect}
          onLoadHelp={this.props.onLoadHelp}
          featuredMedia={this.props.featuredMedia}
        />
      );
    }
    return (<div>Its the content</div>);
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
          <ContentNavigationBar />
          {this._renderContent()}
      </div>
    );
  }
}
