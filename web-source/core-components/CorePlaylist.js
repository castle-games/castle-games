import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import ContentEditor from '~/editor/ContentEditor';

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

const STYLES_PLAYLIST_CARD = css`
  padding: 16px;
  background ${Constants.brand.background};
`;

export default class CorePlaylist extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <div className={STYLES_PLAYLIST_CARD}>
          <h1 className={STYLES_HEADING}>Untitled</h1>
          <ContentEditor readOnly value={this.props.playlist.description} />
        </div>
      </div>
    );
  }
}
