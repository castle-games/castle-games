import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ContentContainer from '~/components/ContentContainer.js';
import Sidebar from '~/components/sidebar/Sidebar';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.background};
  height: 100vh;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
`;

export default class AppContainer extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <Sidebar
          isVisible={!this.props.isFullScreen}
          updateAvailable={this.props.updateAvailable}
          onNativeUpdateInstall={this.props.onNativeUpdateInstall}
        />
        <ContentContainer {...this.props} />
      </div>
    );
  }
}
