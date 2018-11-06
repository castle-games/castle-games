import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIListPlaylists from '~/core-components/reusable/UIListPlaylists';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';
import CoreProfileAddMedia from '~/core-components/CoreProfileAddMedia';
import CoreProfileAddPlaylist from '~/core-components/CoreProfileAddPlaylist';

const STYLES_HEADER_TEXT = css`
  font-size: 16px;
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
  _renderMediaContent = (isOwnProfile) => {
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
          {isOwnProfile
            ? 'You have not added any media to your profile yet.'
            : 'This user has not added any media yet.'}
        </UIEmptyState>
      );
    return (
      <div>
        {mediaListElement}
        {isOwnProfile ? (<CoreProfileAddMedia onMediaAdd={this.props.onMediaAdd} />) : null}
      </div>
    );
  }

  _renderPlaylistContent = (isOwnProfile) => {
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
          {isOwnProfile
            ? 'You have not created any playlists yet.'
            : 'This user has not added any playlists yet.'}
        </UIEmptyState>
      );
    return (
      <div>
        {playlistListElement}
        {isOwnProfile ? (<CoreProfileAddPlaylist onPlaylistAdd={this.props.onPlaylistAdd} />) : null}
      </div>
    );
  }
  
  render() {
    const isOwnProfile = (
      this.props.viewer &&
      this.props.viewer.userId == this.props.creator.userId
    );

    let profileContentElement;
    const { profileMode } = this.props;
    if (profileMode === 'playlists') {
      profileContentElement = this._renderPlaylistContent(isOwnProfile);
    } else {
      profileContentElement = this._renderMediaContent(isOwnProfile);
    }

    return (
      <div className={STYLES_CONTAINER}>
        {!isOwnProfile ? (
          <CoreBrowseSearchInput
            readOnly
            searchQuery={this.props.creator.username}
            onSearchReset={this.props.onSearchReset}
          />
        ) : null}
        <UICardProfileHeader
          creator={this.props.creator}
          profileMode={this.props.profileMode}
          onShowMediaList={this.props.onShowProfileMediaList}
          onShowPlaylistList={this.props.onShowProfilePlaylistList}
        />
        {profileContentElement}
      </div>
    );
  }
}
