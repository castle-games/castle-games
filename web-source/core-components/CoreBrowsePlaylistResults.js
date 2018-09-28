import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIListPlaylists from '~/core-components/reusable/UIListPlaylists';

const STYLES_CONTAINER = css`
  @keyframes info-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: info-animation 280ms ease;

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-left: 1px solid ${Constants.colors.border};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class CoreBrowsePlaylistResults extends React.Component {
  static defaultProps = {
    playlistItems: [],
  };

  render() {
    if (this.props.playlistItems && this.props.playlistItems.length) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIHeaderDismiss />
          <UIListPlaylists
            onPlaylistSelect={this.props.onPlaylistSelect}
            playlistItems={this.props.playlistItems}
          />
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss />
        <UIEmptyState title="Playlist results">
          As you search, playlist search results will appear here.
        </UIEmptyState>
      </div>
    );
  }
}
