import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import Viewer from '~/components/Viewer';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.white};
  height: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default class ContentNavigationBar extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div>
          Its the content navigation bar
        </div>
        <Viewer
          viewer={this.props.viewer}
          onClick={this.props.onSelectViewer}
        />
      </div>
    );
  }
}
