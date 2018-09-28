import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_CONTAINER = css`
  @keyframes playlist-scene-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: playlist-scene-animation 280ms ease;

  width: 100%;
  min-width: 25%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class CorePlaylist extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <UIEmptyState title="Not Implemented">Harass Jim.</UIEmptyState>
      </div>
    );
  }
}
