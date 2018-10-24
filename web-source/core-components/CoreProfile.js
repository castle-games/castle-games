import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIListPlaylists from '~/core-components/reusable/UIListPlaylists';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_HEADER_TEXT = css`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2px;
`;

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

export default class CoreProfile extends React.Component {
  render() {
    const mediaListElement =
      this.props.creator.mediaItems && this.props.creator.mediaItems.length ? (
        <UIListMedia
          viewer={this.props.viewer}
          creator={this.props.creator}
          mediaItems={this.props.creator.mediaItems}
          onMediaSelect={this.props.onMediaSelect}
          onMediaRemove={this.props.onMediaRemove}
          onUserSelect={this.props.onUserSelect}
        />
      ) : (
        <UIEmptyState
          title="No media yet"
          style={{ borderTop: `1px solid ${Constants.colors.border}` }}>
          This user has not added any media yet.
        </UIEmptyState>
      );

    const playlistListElement =
      this.props.creator.playlists && this.props.creator.playlists.length ? (
        <UIListPlaylists
          viewer={this.props.viewer}
          creator={this.props.creator}
          playlists={this.props.creator.playlists}
          onPlaylistSelect={this.props.onPlaylistSelect}
          onPlaylistRemove={this.props.onPlaylistRemove}
          onUserSelect={this.props.onUserSelect}
        />
      ) : (
        <UIEmptyState
          title="No playlists yet"
          style={{ borderTop: `1px solid ${Constants.colors.border}` }}>
          This user has not added any playlists yet.
        </UIEmptyState>
      );

    return (
      <div className={STYLES_CONTAINER}>
        {!this.props.isViewingOwnProfile ? (
          <UIHeaderDismiss onDismiss={this.props.onDismiss}>
            <div className={STYLES_HEADER_TEXT}>Viewing profile</div>
          </UIHeaderDismiss>
        ) : null}
        <UICardProfileHeader
          creator={this.props.creator}
          profileMode={this.props.profileMode}
          onShowMediaList={this.props.onShowProfileMediaList}
          onShowPlaylistList={this.props.onShowProfilePlaylistList}
        />
        {this.props.profileMode === 'media' || !this.props.profileMode ? mediaListElement : null}
        {this.props.profileMode === 'playlists' ? playlistListElement : null}
      </div>
    );
  }
}
