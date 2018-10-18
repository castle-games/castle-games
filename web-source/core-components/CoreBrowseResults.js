import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Fixtures from '~/common/fixtures';

import { css } from 'react-emotion';

import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIListPlaylists from '~/core-components/reusable/UIListPlaylists';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

import CoreWelcomeScreen from '~/core-components/CoreWelcomeScreen';

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

export default class CoreBrowseResults extends React.Component {
  static defaultProps = {
    mediaItems: [],
    playlists: [],
  };

  render() {
    if (this.props.isPristine) {
      return (
        <div className={STYLES_CONTAINER}>
          <CoreWelcomeScreen
            onToggleSidebar={this.props.onToggleCurrentPlaylist}
            onSelectRandom={this.props.onSelectRandom}
          />
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIListPlaylists
          playlists={this.props.playlists}
          onUserSelect={this.props.onUserSelect}
          onPlaylistSelect={this.props.onPlaylistSelect}
        />
        <UIListMedia
          mediaItems={this.props.mediaItems}
          onUserSelect={this.props.onUserSelect}
          onMediaSelect={this.props.onMediaSelect}
        />
      </div>
    );
  }
}
