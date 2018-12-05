import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIHorizontalNavigation from '~/core-components/reusable/UIHorizontalNavigation';
import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIListPlaylists from '~/core-components/reusable/UIListPlaylists';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';
import CoreEditProfile from '~/core-components/CoreEditProfile';
import CoreProfileEditMedia from '~/core-components/CoreProfileEditMedia';
import CoreProfileAddPlaylist from '~/core-components/CoreProfileAddPlaylist';
import CoreSignOut from '~/core-components/CoreSignOut';

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
  state = {
    mode: 'media',
    isEditingMedia: false,
    editingMediaId: null,
  };

  componentWillReceiveProps(nextProps) {
    const existingUserId = (this.props.creator && this.props.creator.userId) ?
          this.props.creator.userId :
          null;
    const nextUserId = (nextProps.creator && nextProps.creator.userId) ?
          nextProps.creator.userId :
          null
    if (nextUserId != existingUserId) {
      // we're rendering a new profile, reset state.
      this.setState({
        mode: 'media',
        isEditingMedia: false,
        editingMediaId: null,
      });
    }
  };
  
  _onShowMedia = () => this.setState({
    mode: 'media',
    isEditingMedia: false,
    editingMediaId: null,
  });

  _onShowPlaylists = () => this.setState({ mode: 'playlists' });

  _onShowEditProfile = () => this.setState({ mode: 'edit-profile' });

  _onShowSignOut = () => this.setState({ mode: 'sign-out' });

  _onPressAddMedia = () => this.setState({
    mode: 'media',
    isEditingMedia: true,
    editingMediaId: null,
  });

  _removeMediaAsync = async (data) => {
    const response = await Actions.removeMedia(data);
    if (!response) {
      return;
    }

    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  _addPlaylistAsync = async (data) => {
    const response = await Actions.addPlaylist(data);
    if (!response) {
      return;
    }
    
    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  _removePlaylistAsync = async (data) => {
    const response = await Actions.removePlaylist(data);
    if (!response) {
      return;
    }

    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  _getNavigationItems = (isOwnProfile) => {
    let navigationItems = [
      { label: 'Media', key: 'media' },
      { label: 'Playlists', key: 'playlists' },
    ];

    if (isOwnProfile) {
      navigationItems.push({ label: 'Edit Profile', key: 'edit-profile' });
      navigationItems.push({ label: 'Sign Out', key: 'sign-out' });
    }

    return navigationItems;
  }

  _onNavigationChange = (selectedKey) => {
    const callbacks = {
      'media': this._onShowMedia,
      'playlists': this._onShowPlaylists,
      'edit-profile': this._onShowEditProfile,
      'sign-out': this._onShowSignOut,
    }
    if (callbacks.hasOwnProperty(selectedKey)) {
      callbacks[selectedKey]();
    }
  }
  
  _renderMediaContent = (isOwnProfile) => {
    const { isEditingMedia, editingMediaId } = this.state;
    if (isEditingMedia) {
      return (
        <CoreProfileEditMedia
          mediaId={editingMediaId}
          onAfterSave={this.props.onAfterSave}
        />
      );
    } else {
      const mediaListElement =
        this.props.creator.mediaItems && this.props.creator.mediaItems.length ? (
          <UIListMedia
            noTitleRow
            viewer={this.props.viewer}
            creator={this.props.creator}
            mediaItems={this.props.creator.mediaItems}
            onMediaSelect={this.props.onMediaSelect}
            onMediaRemove={this._removeMediaAsync}
            onUserSelect={this.props.onUserSelect}
          />
        ) : (
          <UIEmptyState
            title="No media yet"
            style={{ borderTop: `16px solid ${Constants.colors.border}` }}>
            {isOwnProfile
              ? 'You have not added any media to your profile yet.'
              : 'This user has not added any media yet.'}
          </UIEmptyState>
        );
      const addMediaIcon = (<SVG.Add height="16px" />);
      const maybeAddMediaElement =
        isOwnProfile ? (
          <UIButtonIconHorizontal
            style={{ margin: 16 }}
            onClick={this._onPressAddMedia}
            icon={addMediaIcon}>
            Add Media
          </UIButtonIconHorizontal>
        ) : null;
      return (
        <div>
          {mediaListElement}
          {maybeAddMediaElement}
        </div>
      );
    }
  }

  _renderPlaylistContent = (isOwnProfile) => {
    const playlistListElement =
      this.props.creator.playlists && this.props.creator.playlists.length ? (
        <UIListPlaylists
          noTitleRow
          viewer={this.props.viewer}
          creator={this.props.creator}
          playlists={this.props.creator.playlists}
          onPlaylistSelect={this.props.onPlaylistSelect}
          onPlaylistRemove={this._removePlaylistAsync}
          onUserSelect={this.props.onUserSelect}
        />
      ) : (
        <UIEmptyState
          title="No playlists yet"
          style={{ borderTop: `16px solid ${Constants.colors.border}` }}>
          {isOwnProfile
            ? 'You have not created any playlists yet.'
            : 'This user has not added any playlists yet.'}
        </UIEmptyState>
      );
    const maybeAddPlaylistElement =
      isOwnProfile ? (<CoreProfileAddPlaylist onPlaylistAdd={this._addPlaylistAsync} />) : null;
    return (
      <div>
        {playlistListElement}
        {maybeAddPlaylistElement}
      </div>
    );
  };

  _renderEditProfileContent = (isOwnProfile) => {
    if (!isOwnProfile) return null;
    
    return (
      <CoreEditProfile
        user={this.props.viewer}
        onAfterSave={this.props.onAfterSave}
      />
    );
  };

  _renderSignOutContent = (isOwnProfile) => {
    if (!isOwnProfile) return null;
    return (
      <CoreSignOut onSignOut={this.props.onSignOut} />
    );
  };
  
  render() {
    const isOwnProfile = (
      this.props.viewer &&
      this.props.viewer.userId == this.props.creator.userId
    );

    let profileContentElement;
    const { mode } = this.state;
    if (mode === 'playlists') {
      profileContentElement = this._renderPlaylistContent(isOwnProfile);
    } else if (mode === 'edit-profile') {
      profileContentElement = this._renderEditProfileContent(isOwnProfile);
    } else if (mode === 'sign-out') {
      profileContentElement = this._renderSignOutContent(isOwnProfile);
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
          isOwnProfile={isOwnProfile}
          onMediaSelect={this.props.onMediaSelect}
        />
        <UIHorizontalNavigation
          items={this._getNavigationItems(isOwnProfile)}
          selectedKey={this.state.mode}
          onChange={this._onNavigationChange}
        />
        {profileContentElement}
      </div>
    );
  }
}
