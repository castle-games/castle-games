import * as React from 'react';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';
import * as ReactDOM from 'react-dom';
import * as Fixtures from '~/common/fixtures';
import * as Slack from '~/common/slack';
import * as Actions from '~/common/actions';
import * as CEF from '~/common/cef';

import { css } from 'react-emotion';
import { isKeyHotkey } from 'is-hotkey';

// NOTE(jim): Reusable layout component.
import CoreLayout from '~/core-components/layouts/CoreLayout';

// NOTE(jim): Root Components
import CoreRootHeader from '~/core-components/CoreRootHeader';
import CoreRootURLInput from '~/core-components/CoreRootURLInput';
import CoreRootLeftSidebar from '~/core-components/CoreRootLeftSidebar';
import CoreRootDashboard from '~/core-components/CoreRootDashboard';
import CoreRootToolbar from '~/core-components/CoreRootToolbar';
import CoreRootPlaylistSidebar from '~/core-components/CoreRootPlaylistSidebar';
import CoreSignIn from '~/core-components/CoreSignIn';

// NOTE(jim): Media Scene
import CoreMediaScreen from '~/core-components/CoreMediaScreen';
import CoreMediaInformation from '~/core-components/CoreMediaInformation';

// NOTE(jim): Browse Scene
import CoreBrowsePlaylistResults from '~/core-components/CoreBrowsePlaylistResults';
import CoreBrowseMediaResults from '~/core-components/CoreBrowseMediaResults';
import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';

// NOTE(jim): Profile Scene
import CoreProfile from '~/core-components/CoreProfile';
import CoreProfileSidebar from '~/core-components/CoreProfileSidebar';

// NOTE(jim): Playlist Scene
import CorePlaylist from '~/core-components/CorePlaylist';

// NOTE(jim): Development Logs Scene
import CoreDevelopmentLogs from '~/core-components/CoreDevelopmentLogs';

const isOverlayHotkey = isKeyHotkey('mod+e');
const isDevelopmentLogHotkey = isKeyHotkey('mod+j');
const POLL_DELAY = 300;

// NOTES(jim):
// + Assigning creator to `null` whenever `pageMode` changes is dangerous.
//   We may want to think of an enumeration to represent that state.
export default class CoreApp extends React.Component {
  _layout;
  _devTimeout;

  constructor(props) {
    super();

    this.state = props.state;
  }

  async componentDidMount() {
    window.addEventListener('nativeOpenUrl', this._handleNativeOpenUrl);
    window.addEventListener('keydown', this._handleKeyDown);

    const processChannels = async () => {
      const logs = await CEF.getLogs();

      this.setState({ logs: [...this.state.logs, ...logs] });
      this._devTimeout = window.setTimeout(processChannels, POLL_DELAY);
    };

    CEF.setBrowserReady(() => {
      this._handleCEFupdateFrame();
      processChannels();
    });
  }

  componentWillUnmount() {
    window.removeEventListener('nativeOpenUrl', this._handleNativeOpenUrl);
    window.removeEventListener('keydown', this._handleKeyDown);
    window.clearTimeout(this._devTimeout);
  }

  _handleSetHistory = media => {
    if (!this.props.storage) {
      alert('History is not supported at the moment.');
      return;
    }

    let data = this.props.storage.getItem('history');

    // TODO(jim): Sync this with your profile if you're logged in.
    if (!data) {
      console.log('Setting up your local viewing history.');
      this.props.storage.setItem('history', JSON.stringify({ history: [] }));
    }

    data = this.props.storage.getItem('history');
    if (!data) {
      alert('History is not supported at the moment.');
      return;
    }

    let { history } = JSON.parse(data);
    if (!history) {
      return;
    }

    history = history.filter(h => h.mediaUrl !== media.mediaUrl);

    history.unshift(media);
    this.props.storage.setItem('history', JSON.stringify({ history }));

    if (history.length > 10) {
      history.pop();
    }
  };

  _handleMediaAdd = async data => {
    const response = await Actions.addMedia(data);
    if (!response) {
      return;
    }

    const mediaItems = [...this.state.viewer.mediaItems];
    mediaItems.unshift(response);
    this.setState({ viewer: { ...this.state.viewer, mediaItems }, profileMode: 'media' });
  };

  _handleMediaRemove = async data => {
    const response = await Actions.removeMedia(data);
    if (!response) {
      return;
    }

    const mediaItems = this.state.viewer.mediaItems.filter(
      item => item.mediaId !== response.mediaId
    );
    this.setState({ viewer: { ...this.state.viewer, mediaItems }, profileMode: 'media' });
  };

  _handlePlaylistAdd = async data => {
    const response = await Actions.addPlaylist(data);
    if (!response) {
      return;
    }

    const playlists = [...this.state.viewer.playlists];
    playlists.unshift(response);
    this.setState({ viewer: { ...this.state.viewer, playlists }, profileMode: 'playlists' });
  };

  _handlePlaylistRemove = async data => {
    const response = await Actions.removePlaylist(data);
    if (!response) {
      return;
    }

    const playlists = this.state.viewer.playlists.filter(
      item => item.playlistId !== response.playlistId
    );
    this.setState({ viewer: { ...this.state.viewer, playlists }, profileMode: 'playlists' });
  };

  setStateWithCEF = state => this.setState({ ...state }, this._handleCEFupdateFrame);

  _handleCEFupdateFrame = () => {
    const element = this._layout.getMediaContainerRef();
    const rect = element.getBoundingClientRect();
    CEF.updateWindowFrame(rect);
  };

  _handleSetViewer = viewer => this.setState({ viewer, pageMode: viewer ? 'browse' : 'sign-in' });

  _handleURLChange = e => this.setState({ [e.target.name]: e.target.value });

  _handleURLSubmit = () => {
    if (Strings.isEmpty(this.state.mediaUrl)) {
      alert('You must provide a URL');
      return;
    }

    if (this.state.mediaUrl.endsWith('.lua')) {
      this._handleGoToURL(this.state.mediaUrl);
      return;
    }

    this._handleGoToMedia({ mediaUrl: this.state.mediaUrl });
  };

  _handleGoToMedia = media => {
    CEF.closeWindowFrame();

    this._handleSetHistory(media);
    this.setStateWithCEF({ media, mediaUrl: media.mediaUrl, pageMode: null, creator: null });
  };

  _handleGoToURL = mediaUrl => {
    if (Strings.isEmpty(mediaUrl)) {
      return;
    }

    this.setState({ media: null });

    CEF.openWindowFrame(mediaUrl);

    this._handleSetHistory({ mediaUrl });
    this.setStateWithCEF({ media: { mediaUrl }, mediaUrl, pageMode: null, creator: null });
  };

  _handleNativeOpenUrl = e => {
    let { params } = e;
    let { url } = params;

    if (Strings.isEmpty(url)) {
      return;
    }

    url = url.replace('castle://', 'https://');
    this.setState({ media: null, mediaUrl: url }, () => {
      this._handleURLSubmit();
    });
  };

  _handleKeyDown = e => {
    if (isOverlayHotkey(e)) {
      return this._handleToggleOverlay();
    }

    if (isDevelopmentLogHotkey(e)) {
      return this._handleToggleDevelopmentLogs();
    }
  };

  _handleSearchSubmit = async () => {
    if (Strings.isEmpty(this.state.searchQuery)) {
      alert('You must provide a search query.');
      return;
    }

    const data = await Actions.search(this.state.searchQuery);
    if (!data) {
      this.setState({
        searchResultsMedia: [],
        searchResultsPlaylist: [],
      });
      return;
    }

    const { mediaItems = [], playlists = [] } = data;
    this.setState({
      searchResultsMedia: mediaItems,
      searchResultsPlaylist: playlists,
    });
  };

  _handleSearchChange = async e => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  _handleRegisterGame = ({ email, message }) => {
    // TODO(jim): Handle this better
    if (Strings.isEmpty(email)) {
      return;
    }

    // TODO(jim): Handle this better
    if (Strings.isEmpty(message)) {
      return;
    }

    const emailUrl = `<mailto:${email}|${email}>`;
    Slack.sendMessage(`*${emailUrl} who is playing "${this.state.mediaUrl}" said:*\n ${message}`);
  };

  _handleFavoriteMedia = () => window.alert('favorite');

  _handlePlaylistSelect = playlist => {
    CEF.closeWindowFrame();

    this.setStateWithCEF({ pageMode: 'playlist', creator: null, playlist, media: null });
  };

  _handleMediaSelect = media => {
    if (!media) {
      return;
    }

    if (Strings.isEmpty(media.mediaUrl)) {
      console.error('handleMediaSelect: no media url provided on entity');
      return;
    }

    if (media.mediaUrl.endsWith('.lua')) {
      this._handleGoToURL(media.mediaUrl);
      return;
    }

    this._handleGoToMedia(media);
  };

  _handleSelectRandom = () => {
    // TODO(jim): Oh man.
    if (!this.state.playlist) {
      return;
    }

    if (!this.state.playlist.mediaItems) {
      return;
    }

    if (!this.state.playlist.mediaItems.length) {
      return;
    }

    const max = this.state.playlist.mediaItems.length;
    const min = 1;

    const index = Utilities.getRandomInt(min, max);
    this._handleMediaSelect(this.state.playlist.mediaItems[index]);
  };

  _handleToggleProfile = () =>
    this.setStateWithCEF({
      pageMode: this.state.pageMode === 'profile' ? null : 'profile',
      creator: this.state.pageMode === 'profile' ? null : this.state.viewer,
    });

  _handleToggleBrowse = () =>
    this.setStateWithCEF({
      pageMode: this.state.pageMode === 'browse' ? null : 'browse',
      creator: null,
    });

  _handleToggleSignIn = () =>
    this.setStateWithCEF({ pageMode: this.state.pageMode === 'sign-in' ? null : 'sign-in' });

  _handleToggleCurrentPlaylistDetails = () =>
    this.setStateWithCEF({
      pageMode: this.state.pageMode === 'playlist' ? null : 'playlist',
      creator: null,
    });

  _handleToggleCurrentPlaylist = () =>
    this.setStateWithCEF({
      pageMode: null,
      creator: null,
      sidebarMode: this.state.sidebarMode === 'current-playlist' ? null : 'current-playlist',
    });

  _handleToggleDashboard = () =>
    this.setStateWithCEF({
      sidebarMode: this.state.sidebarMode === 'dashboard' ? null : 'dashboard',
      pageMode: null,
      creator: null,
    });

  _handleToggleDevelopmentLogs = () =>
    this.setStateWithCEF({
      sidebarMode: this.state.sidebarMode === 'development' ? null : 'development',
      pageMode: null,
      creator: null,
    });

  _handleToggleMediaInfo = () =>
    this.setStateWithCEF({
      sidebarMode: this.state.sidebarMode === 'media-info' ? null : 'media-info',
      pageMode: null,
      creator: null,
    });

  _handleShowProfileMediaList = () => {
    this.setStateWithCEF({
      profileMode: 'media',
    });
  };

  _handleShowProfilePlaylistList = () =>
    this.setStateWithCEF({
      profileMode: 'playlists',
    });

  _handleSignOut = () => {
    const confirm = window.confirm('Are you sure you want to sign out?');

    if (!confirm) {
      return;
    }

    if (!Actions.logout()) {
      return;
    }

    this.setStateWithCEF({
      viewer: null,
      creator: null,
      pageMode: 'browse',
    });
  };

  _handleDismissSidebar = () => this.setStateWithCEF({ sidebarMode: null });

  _handleHideOverlay = () => this.setStateWithCEF({ isOverlayActive: false, pageMode: null });

  _handleToggleOverlay = () =>
    this.setStateWithCEF({ isOverlayActive: !this.state.isOverlayActive, pageMode: null });

  _handleToggleMediaExpanded = () =>
    this.setStateWithCEF({ isMediaExpanded: !this.state.isMediaExpanded, pageMode: null });

  _handleGetReference = reference => {
    this._layout = reference;
  };

  renderRootURLInput = () => (
    <CoreRootURLInput
      name="mediaUrl"
      placeholder="Type in a Lua/LÖVE main.lua file URL or HTML URL..."
      value={this.state.mediaUrl}
      viewer={this.state.viewer}
      media={this.state.media}
      expanded={this.state.isMediaExpanded}
      onChange={this._handleURLChange}
      onSubmit={this._handleURLSubmit}
      onToggleMediaExpanded={this._handleToggleMediaExpanded}
      onHideOverlay={this._handleHideOverlay}
      onFavoriteMedia={this._handleFavoriteMedia}
      onToggleDashboard={this._handleToggleDashboard}
    />
  );

  render() {
    const { state } = this;

    let maybeLeftSidebarNode;
    if (state.isOverlayActive) {
      maybeLeftSidebarNode = (
        <CoreRootLeftSidebar
          viewer={state.viewer}
          isBrowsing={state.pageMode === 'browse'}
          isSignIn={state.pageMode === 'sign-in'}
          isViewingProfile={state.pageMode === 'profile'}
          onToggleProfile={this._handleToggleProfile}
          onToggleBrowse={this._handleToggleBrowse}
          onToggleSignIn={this._handleToggleSignIn}
          onSignOut={this._handleSignOut}
        />
      );
    }

    // NOTE(jim): Browse/Search Scene
    if (state.pageMode === 'browse') {
      return (
        <CoreLayout
          ref={this._handleGetReference}
          topNode={
            <CoreBrowseSearchInput
              searchQuery={state.searchQuery}
              onChange={this._handleSearchChange}
              onSubmit={this._handleSearchSubmit}
            />
          }
          rightSidebarNode={
            <CoreBrowsePlaylistResults
              playlists={state.searchResultsPlaylist}
              onPlaylistSelect={this._handlePlaylistSelect}
              onDismiss={this._handleToggleBrowse}
            />
          }
          bottomNode={this.renderRootURLInput()}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CoreBrowseMediaResults
            mediaItems={state.searchResultsMedia}
            onMediaSelect={this._handleMediaSelect}
            onSelectRandom={this._handleSelectRandom}
            onToggleCurrentPlaylist={this._handleToggleCurrentPlaylist}
          />
        </CoreLayout>
      );
    }

    // NOTE(jim): Sign in scene
    if (state.pageMode === 'sign-in') {
      return (
        <CoreLayout
          ref={this._handleGetReference}
          bottomNode={this.renderRootURLInput()}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CoreSignIn
            onToggleBrowse={this._handleToggleBrowse}
            onSetViewer={this._handleSetViewer}
          />
        </CoreLayout>
      );
    }

    // NOTE(jim): Playlist Scene
    if (state.pageMode === 'playlist') {
      return (
        <CoreLayout
          ref={reference => {
            this._layout = reference;
          }}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CorePlaylist
            viewer={state.viewer}
            playlist={state.playlist}
            onMediaSelect={this._handleMediaSelect}
            onMediaRemove={this._handleRemoveMedia}
            onDismiss={this._handleToggleCurrentPlaylistDetails}
          />
        </CoreLayout>
      );
    }

    // NOTE(jim): Profile Scene
    if (state.pageMode === 'profile') {
      return (
        <CoreLayout
          ref={this._handleGetReference}
          leftSidebarNode={maybeLeftSidebarNode}
          rightNode={
            state.viewer && state.creator && state.viewer.userId === state.creator.userId ? (
              <CoreProfileSidebar
                onMediaAdd={this._handleMediaAdd}
                onPlaylistAdd={this._handlePlaylistAdd}
              />
            ) : null
          }>
          <CoreProfile
            viewer={state.viewer}
            creator={state.creator}
            profileMode={state.profileMode}
            onDismiss={this._handleToggleProfile}
            onShowProfileMediaList={this._handleShowProfileMediaList}
            onShowProfilePlaylistList={this._handleShowProfilePlaylistList}
            onPlayCreatorMedia={this._handlePlayCreatorMedia}
            onSubscribeToCreator={this._handleSubscribeToCreator}
            onClickCreatorAvatar={this._handleClickCreatorAvatar}
            onClickCreatorCreations={() => this.setState({ profileMode: 'media' })}
            onClickCreatorPlaylists={() => this.setState({ profileMode: 'playlists' })}
            onMediaSelect={this._handleMediaSelect}
            onMediaRemove={this._handleMediaRemove}
            onPlaylistSelect={this._handlePlaylistSelect}
            onPlaylistRemove={this._handlePlaylistRemove}
          />
        </CoreLayout>
      );
    }

    let maybeBottomNode;
    if (state.isOverlayActive) {
      maybeBottomNode = this.renderRootURLInput();
    }

    let maybeTopNode;
    if (state.isOverlayActive) {
      maybeTopNode = (
        <CoreRootHeader
          viewer={state.viewer}
          media={state.media}
          playlist={state.playlist}
          onToggleBrowse={this._handleToggleBrowse}
          onSelectRandom={this._handleSelectRandom}
          onToggleDashboard={this._handleToggleDashboard}
          onToggleAuthentication={this._handleToggleAuthentication}
          onToggleMediaInfo={this._handleToggleMediaInfo}
          onToggleCurrentPlaylist={this._handleToggleCurrentPlaylist}
        />
      );
    }

    let maybeRightNode;
    if (state.isOverlayActive && state.sidebarMode === 'media-info') {
      maybeRightNode = (
        <CoreMediaInformation
          media={state.media}
          onDismiss={this._handleDismissSidebar}
          onRegisterMedia={this._handleRegisterGame}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'development') {
      maybeRightNode = (
        <CoreDevelopmentLogs logs={state.logs} onDismiss={this._handleDismissSidebar} />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'dashboard') {
      maybeRightNode = (
        <CoreRootDashboard
          media={state.media}
          onMediaSelect={this._handleMediaSelect}
          storage={this.props.storage}
          onDismiss={this._handleDismissSidebar}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'current-playlist') {
      maybeRightNode = (
        <CoreRootPlaylistSidebar
          media={state.media}
          playlist={state.playlist}
          onMediaSelect={this._handleMediaSelect}
          onViewCurrentPlaylistDetails={this._handleToggleCurrentPlaylistDetails}
          onDismiss={this._handleDismissSidebar}
        />
      );
    }

    return (
      <CoreLayout
        ref={this._handleGetReference}
        topNode={maybeTopNode}
        bottomNode={maybeBottomNode}
        leftSidebarNode={maybeLeftSidebarNode}
        rightNode={maybeRightNode}>
        {state.media ? (
          <CoreMediaScreen expanded={state.isMediaExpanded} media={state.media} />
        ) : null}
      </CoreLayout>
    );
  }
}
