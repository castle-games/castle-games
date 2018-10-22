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
import { LOADER_STRING } from '~/core-components/primitives/loader';

// NOTE(jim): Reusable layout component.
import CoreLayout from '~/core-components/layouts/CoreLayout';
import CoreLoadingScreen from '~/core-components/CoreLoadingScreen';

// NOTE(jim): Root Components
import CoreRootHeader from '~/core-components/CoreRootHeader';
import CoreRootURLInput from '~/core-components/CoreRootURLInput';
import CoreRootLeftSidebar from '~/core-components/CoreRootLeftSidebar';
import CoreRootToolbar from '~/core-components/CoreRootToolbar';
import CoreRootContextSidebar from '~/core-components/CoreRootContextSidebar';
import CoreLoginSignup from '~/core-components/CoreLoginSignup';

// NOTE(jim): Media Scene
import CoreMediaScreen from '~/core-components/CoreMediaScreen';

// NOTE(jim): Browse Scene
import CoreBrowseResults from '~/core-components/CoreBrowseResults';
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
const isReloadHotkey = isKeyHotkey('mod+r');
const isAppReloadHotkey = isKeyHotkey('mod+shift+r');

const POLL_DELAY = 300;
const ENABLE_HIDE_OVERLAY = false;
const delay = ms =>
  new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });

// NOTES(jim):
// + Assigning creator to `null` whenever `pageMode` changes is dangerous.
//   We may want to think of an enumeration to represent that state.
export default class CoreApp extends React.Component {
  _layout;
  _devTimeout;
  _contextSidebar;
  _isLockedFromCEFUpdates = true;

  constructor(props) {
    super();

    this.state = props.state;
  }

  async componentDidMount() {
    window.addEventListener('nativeOpenUrl', this._handleNativeOpenUrl);
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('nativeLoadEnd', this._handleNativeLoadEnd);
    window.addEventListener('nativeLoadError', this._handleNativeLoadError);

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
    window.removeEventListener('nativeLoadEnd', this._handleNativeLoadEnd);
    window.removeEventListener('nativeLoadError', this._handleNativeLoadError);
    window.clearTimeout(this._devTimeout);
  }

  closeCEF = () => {
    if (this._isLockedFromCEFUpdates) {
      console.log('closeCEF: already locked');
      return;
    }

    this._isLockedFromCEFUpdates = true;
    CEF.closeWindowFrame();
  };

  openCEF = url => {
    if (!this._isLockedFromCEFUpdates) {
      console.log('openCEF: is not closed');
      return;
    }

    this._isLockedFromCEFUpdates = false;
    CEF.openWindowFrame(url);
  };

  refreshViewer = async () => {
    const viewer = await Actions.getViewer();

    if (!viewer) {
      return;
    }

    const updates = { viewer };
    if (this.state.viewer && this.state.creator && viewer.userId === this.state.creator.userId) {
      updates.creator = viewer;
    }

    this.setState(updates);
  };

  _handleNativeLoadEnd = async () => {
    await delay(2000);

    this.setState({ mediaLoading: false });
  };

  _handleNativeLoadError = () => {
    this.setState({ mediaLoading: false });
  };

  _handleCEFupdateFrame = () => {
    if (this._isLockedFromCEFUpdates) {
      return;
    }

    const element = this._layout.getMediaContainerRef();
    const rect = element.getBoundingClientRect();
    CEF.updateWindowFrame(rect);
  };

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

    if (history.length > 10) {
      history.pop();
    }

    history = history.filter(h => h.mediaUrl !== media.mediaUrl);

    history.unshift(media);
    this.props.storage.setItem('history', JSON.stringify({ history }));
  };

  _handleClearHistory = () => {
    this.props.storage.setItem('history', JSON.stringify({ history: [] }));

    if (!this._contextSidebar) {
      return;
    }

    this._contextSidebar.viewPlaylistContext();
  };

  _handleMediaAdd = async data => {
    const response = await Actions.addMedia(data);
    if (!response) {
      return;
    }

    await this.refreshViewer();
    this.setState({ profileMode: 'media' });
  };

  _handleMediaRemove = async data => {
    const response = await Actions.removeMedia(data);
    if (!response) {
      return;
    }

    await this.refreshViewer();
    this.setState({ profileMode: 'media' });
  };

  _handlePlaylistAdd = async data => {
    const response = await Actions.addPlaylist(data);
    if (!response) {
      return;
    }

    await this.refreshViewer();
    this.setState({ profileMode: 'playlists' });
  };

  _handlePlaylistRemove = async data => {
    const response = await Actions.removePlaylist(data);
    if (!response) {
      return;
    }

    await this.refreshViewer();
    this.setState({ profileMode: 'playlists' });
  };

  _handleRemoveMediaFromPlaylist = async data => {
    const response = await Actions.removeMediaFromPlaylist(data);
    if (!response) {
      return;
    }

    const playlist = await Actions.getPlaylist(data);
    if (!playlist) {
      return;
    }

    this.setState({ playlist });
    await this.refreshViewer();
  };

  setStateWithCEF = state => {
    if (this._isLockedFromCEFUpdates) {
      return this.setState({ ...state });
    }

    this.setState({ ...state }, this._handleCEFupdateFrame);
  };

  appReload = async e => {
    if (e) {
      e.preventDefault();
    }

    const loader = document.createElement('div');
    loader.innerHTML = LOADER_STRING.trim();
    loader.id = 'loader';

    document.body.appendChild(loader);

    const { allMedia = [], allPlaylists = [], me } = await Actions.getInitialData();

    const state = {
      viewer: me,
      allMedia,
      allPlaylists,
      allMediaFiltered: [...allMedia],
      allPlaylistsFiltered: [...allPlaylists],
    };

    document.getElementById('loader').classList.add('loader--finished');
    await delay(300);

    this.setState({ ...state }, () => {
      document.getElementById('loader').outerHTML = '';
    });
  };

  reload = async e => {
    if (e) {
      e.preventDefault();
    }

    const mediaUrl = this.state.mediaUrl.slice(0);
    if (Strings.isEmpty(mediaUrl)) {
      return;
    }

    this.setState({ media: null, mediaUrl });

    await delay(100);

    if (mediaUrl.endsWith('.lua')) {
      this.goToLUA(mediaUrl);
      return;
    }

    this.goToHTML5Media({ mediaUrl });
  };

  _handleSetViewer = viewer => this.setState({ viewer, pageMode: viewer ? 'browse' : 'sign-in' });

  _handleURLChange = e => this.setState({ [e.target.name]: e.target.value });

  _handleURLSubmit = () => {
    if (Strings.isEmpty(this.state.mediaUrl)) {
      alert('You must provide a URL');
      return;
    }

    if (this.state.mediaUrl.endsWith('.lua')) {
      this.goToLUA(this.state.mediaUrl);
      return;
    }

    this.goToHTML5Media({ mediaUrl: this.state.mediaUrl });
  };

  goToHTML5Media = async media => {
    this.closeCEF();

    // HACK(jim): This is a great way to disable this feature for local web.
    if (window.cefQuery) {
      this.setState({ mediaLoading: true });
    }

    const existingMedia = await Actions.getMediaByURL({
      mediaUrl: media.mediaUrl,
    });

    this._handleSetHistory(existingMedia ? existingMedia : media);

    this.setStateWithCEF({
      media: existingMedia ? existingMedia : media,
      mediaUrl: media.mediaUrl,
      pageMode: null,
      creator: null,
    });
  };

  goToLUA = async mediaUrl => {
    if (Strings.isEmpty(mediaUrl)) {
      return;
    }

    this.closeCEF();

    const media = await Actions.getMediaByURL({ mediaUrl });

    this.openCEF(mediaUrl);

    this._handleSetHistory(media ? media : { mediaUrl });

    this.setStateWithCEF({
      media: media ? media : { mediaUrl },
      mediaUrl,
      pageMode: null,
      creator: null,
    });
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
    if (isReloadHotkey(e)) {
      return this.reload(e);
    }

    if (isAppReloadHotkey(e)) {
      return this.appReload(e);
    }

    if (isOverlayHotkey(e) && ENABLE_HIDE_OVERLAY) {
      return this._handleToggleOverlay(e);
    }

    if (isDevelopmentLogHotkey(e)) {
      return this._handleToggleDevelopmentLogs(e);
    }
  };

  _stringAsSearchInvariant = s => {
    return s.toLowerCase().trim();
  };

  _stringIncludesSearchQuery = (s, query) => {
    if (Strings.isEmpty(s)) {
      return false;
    }

    return this._stringAsSearchInvariant(s).includes(query);
  };

  _filterMediaItemWithSearchState = m => {
    const query = this._stringAsSearchInvariant(this.state.searchQuery);
    if (this._stringIncludesSearchQuery(m.name, query)) {
      return true;
    }

    if (this._stringIncludesSearchQuery(m.mediaUrl, query)) {
      return true;
    }

    if (m.user) {
      if (this._stringIncludesSearchQuery(m.user.name, query)) {
        return true;
      }
      if (this._stringIncludesSearchQuery(m.user.username, query)) {
        return true;
      }
    }

    return false;
  };

  _filterPlaylistWithSearchState = p => {
    const query = this._stringAsSearchInvariant(this.state.searchQuery);
    if (this._stringIncludesSearchQuery(p.name, query)) {
      return true;
    }

    if (p.user) {
      if (this._stringIncludesSearchQuery(p.user.name, query)) {
        return true;
      }
      if (this._stringIncludesSearchQuery(p.user.username, query)) {
        return true;
      }
    }

    return false;
  };

  _handleSearchSubmit = async e => this._handleSearchChange(e);

  _handleSearchChange = async e => {
    this.setState(
      {
        pageMode: 'browse',
        searchQuery: e.target.value,
      },
      () => {
        if (Strings.isEmpty(this.state.searchQuery)) {
          return this.setState({
            allMediaFiltered: [...this.state.allMedia],
            allPlaylistsFiltered: [...this.state.allPlaylists],
          });
        }

        this.setState({
          allMediaFiltered: this.state.allMedia.filter(this._filterMediaItemWithSearchState),
          allPlaylistsFiltered: this.state.allPlaylists.filter(this._filterPlaylistWithSearchState),
        });
      }
    );
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

  _handlePlaylistSelect = async playlist => {
    if (!this.state.pageMode) {
      this.closeCEF();
    }

    const serverPlaylist = await Actions.getPlaylist(playlist);
    if (!serverPlaylist) {
      return;
    }

    this.setStateWithCEF({
      pageMode: 'playlist',
      allMediaFiltered:
        serverPlaylist.mediaItems && serverPlaylist.mediaItems.length
          ? [...serverPlaylist.mediaItems]
          : [...this.state.allMediaFiltered],
      creator: null,
      playlist: serverPlaylist,
      searchQuery: '',
      media: null,
    });
  };

  _handleUserSelect = async user => {
    if (!user) {
      return;
    }

    const creator = await Actions.getUser(user);

    if (!creator) {
      return;
    }

    if (!this.state.pageMode) {
      this.closeCEF();
    }

    if (this.state.pageMode === 'profile') {
      this.setState({ pageMode: 'profile', creator: { ...creator } });
      return;
    }

    this.setStateWithCEF({ pageMode: 'profile', creator: { ...creator } });
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
      this.goToLUA(media.mediaUrl);
      return;
    }

    this.goToHTML5Media(media);
  };

  _handleSelectRandom = () => {
    const list = this.state.allMediaFiltered.length
      ? this.state.allMediaFiltered
      : this.state.allMedia;

    const max = list.length;
    const min = 1;

    const index = Utilities.getRandomInt(min, max);
    this._handleMediaSelect(list[index]);
  };

  determineNextStateOfCEF = ({ isClosing, isOpening, mediaUrl }) => {
    if (isClosing) {
      this.closeCEF();
      return;
    }

    if (!isOpening) {
      return;
    }

    // NOTE(jim): Restores the dead state.
    if (!Strings.isEmpty(mediaUrl)) {
      if (mediaUrl.endsWith('.lua')) {
        this.openCEF(mediaUrl);
      }
    }
  };

  _handleToggleProfile = () => {
    const updates = {
      pageMode: 'profile',
      creator: { ...this.state.viewer },
    };

    this.determineNextStateOfCEF({
      isClosing: !Strings.isEmpty(updates.pageMode),
      isOpening: Strings.isEmpty(updates.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({ ...updates });
  };

  _handleTogglePlay = () => {
    const updates = {
      pageMode: null,
      creator: null,
    };

    this.determineNextStateOfCEF({
      isClosing: !Strings.isEmpty(updates.pageMode),
      isOpening: Strings.isEmpty(updates.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleBrowse = () => {
    const updates = {
      pageMode: 'browse',
      creator: null,
    };

    this.determineNextStateOfCEF({
      isClosing: !Strings.isEmpty(updates.pageMode),
      isOpening: Strings.isEmpty(updates.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleSignIn = () => {
    const updates = {
      pageMode: 'sign-in',
      creator: null,
    };

    this.determineNextStateOfCEF({
      isClosing: !Strings.isEmpty(updates.pageMode),
      isOpening: Strings.isEmpty(updates.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({ ...updates });
  };

  _handleToggleCurrentPlaylistDetails = () => {
    const updates = {
      pageMode: 'playlist',
      creator: null,
    };

    this.determineNextStateOfCEF({
      isClosing: !Strings.isEmpty(updates.pageMode),
      isOpening: Strings.isEmpty(updates.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleCurrentContext = () => {
    const updates = {
      pageMode: null,
      creator: null,
      sidebarMode: this.state.sidebarMode === 'current-context' ? null : 'current-context',
    };

    this.determineNextStateOfCEF({
      isClosing: false,
      isOpening: !Strings.isEmpty(this.state.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleDevelopmentLogs = () => {
    const updates = {
      sidebarMode: this.state.sidebarMode === 'development' ? null : 'development',
      pageMode: null,
      creator: null,
    };

    this.determineNextStateOfCEF({
      isClosing: false,
      isOpening: !Strings.isEmpty(this.state.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

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

    this.determineNextStateOfCEF({
      isClosing: true,
      isOpening: false,
    });

    this.setStateWithCEF({
      viewer: null,
      creator: null,
      pageMode: 'browse',
    });
  };

  _handleDismissSidebar = () => this.setStateWithCEF({ sidebarMode: null });

  _handleHideOverlay = () => {
    const updates = {
      isOverlayActive: false,
      pageMode: null,
    };

    this.determineNextStateOfCEF({
      isClosing: false,
      isOpening: !Strings.isEmpty(this.state.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({ ...updates });
  };

  _handleToggleOverlay = () => {
    const updates = {
      isOverlayActive: !this.state.isOverlayActive,
      pageMode: null,
    };

    this.determineNextStateOfCEF({
      isClosing: false,
      isOpening: !Strings.isEmpty(this.state.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleMediaExpanded = () => {
    const updates = {
      isMediaExpanded: !this.state.isMediaExpanded,
      pageMode: null,
    };

    this.determineNextStateOfCEF({
      isClosing: false,
      isOpening: !Strings.isEmpty(this.state.pageMode),
      mediaUrl: this.state.mediaUrl,
    });

    this.setStateWithCEF({ ...updates });
  };

  _handleGetReference = reference => {
    this._layout = reference;
  };

  renderRootURLInput = () => (
    <CoreRootURLInput
      name="mediaUrl"
      placeholder="Type in the URL to a Castle game..."
      value={this.state.mediaUrl}
      viewer={this.state.viewer}
      media={this.state.media}
      expanded={this.state.isMediaExpanded}
      isLoading={this.state.mediaLoading}
      onChange={this._handleURLChange}
      onSubmit={this.reload}
      onToggleMediaExpanded={this._handleToggleMediaExpanded}
      onHideOverlay={this._handleHideOverlay}
      onFavoriteMedia={this._handleFavoriteMedia}
    />
  );

  renderRootSearchInput = () => (
    <CoreBrowseSearchInput
      searchQuery={this.state.searchQuery}
      onChange={this._handleSearchChange}
      onSubmit={this._handleSearchSubmit}
    />
  );

  render() {
    const { state } = this;

    const isViewerViewingBrowseScene = state.pageMode === 'browse';
    const isViewerViewingSignInScene = state.pageMode === 'sign-in';
    const isViewerViewingProfileScene = state.pageMode === 'profile';
    const isViewerViewingPlaylistScene = state.pageMode === 'playlist';
    const isViewerPlayingMedia = !state.pageMode;

    const isViewingOwnProfile =
      isViewerViewingProfileScene &&
      state.viewer &&
      state.creator &&
      state.viewer.userId === state.creator.userId;

    let maybeLeftSidebarNode;
    if (state.isOverlayActive) {
      maybeLeftSidebarNode = (
        <CoreRootLeftSidebar
          viewer={state.viewer}
          isPlaying={isViewerPlayingMedia}
          isBrowsing={
            isViewerViewingBrowseScene ||
            isViewerViewingPlaylistScene ||
            (isViewerViewingProfileScene && !isViewingOwnProfile)
          }
          isSignIn={isViewerViewingSignInScene}
          isViewingProfile={isViewingOwnProfile}
          onToggleProfile={this._handleToggleProfile}
          onToggleBrowse={this._handleToggleBrowse}
          onToggleSignIn={this._handleToggleSignIn}
          onTogglePlay={this._handleTogglePlay}
          onSignOut={this._handleSignOut}
        />
      );
    }

    if (isViewerViewingBrowseScene) {
      return (
        <CoreLayout
          ref={this._handleGetReference}
          topNode={this.renderRootSearchInput()}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CoreBrowseResults
            mediaItems={state.allMediaFiltered}
            playlists={state.allPlaylistsFiltered}
            featuredPlaylists={state.featuredPlaylists}
            featuredMedia={state.featuredMedia}
            isPristine={Strings.isEmpty(state.searchQuery)}
            onUserSelect={this._handleUserSelect}
            onMediaSelect={this._handleMediaSelect}
            onPlaylistSelect={this._handlePlaylistSelect}
            onToggleCurrentPlaylist={this._handleToggleCurrentContext}
          />
        </CoreLayout>
      );
    }

    if (isViewerViewingSignInScene) {
      return (
        <CoreLayout ref={this._handleGetReference} leftSidebarNode={maybeLeftSidebarNode}>
          <CoreLoginSignup onLogin={this._handleSetViewer} />
        </CoreLayout>
      );
    }

    if (isViewerViewingPlaylistScene) {
      return (
        <CoreLayout
          ref={reference => {
            this._layout = reference;
          }}
          topNode={this.renderRootSearchInput()}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CorePlaylist
            viewer={state.viewer}
            playlist={state.playlist}
            onUserSelect={this._handleUserSelect}
            onMediaSelect={this._handleMediaSelect}
            onMediaRemoveFromPlaylist={this._handleRemoveMediaFromPlaylist}
          />
        </CoreLayout>
      );
    }

    if (isViewerViewingProfileScene) {
      return (
        <CoreLayout
          ref={this._handleGetReference}
          leftSidebarNode={maybeLeftSidebarNode}
          topNode={this.renderRootSearchInput()}
          rightNode={
            isViewingOwnProfile ? (
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
            onUserSelect={this._handleUserSelect}
            onDismiss={this._handleToggleProfile}
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
          isContextSidebarActive={state.sidebarMode === 'current-context'}
          onToggleCurrentContext={this._handleToggleCurrentContext}
        />
      );
    }

    let maybeRightNode;
    if (state.isOverlayActive && state.sidebarMode === 'current-context') {
      maybeRightNode = (
        <CoreRootContextSidebar
          ref={c => {
            this._contextSidebar = c;
          }}
          media={state.media}
          viewer={state.viewer}
          allMedia={state.allMedia}
          storage={this.props.storage}
          allMediaFiltered={state.allMediaFiltered}
          onRefreshViewer={this.refreshViewer}
          onRegisterMedia={this._handleRegisterGame}
          onToggleBrowse={this._handleToggleBrowse}
          onToggleProfile={this._handleToggleProfile}
          onMediaSelect={this._handleMediaSelect}
          onUserSelect={this._handleUserSelect}
          onViewCurrentPlaylistDetails={this._handleToggleCurrentPlaylistDetails}
          onClearHistory={this._handleClearHistory}
          onSelectRandom={this._handleSelectRandom}
          onDismiss={this._handleDismissSidebar}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'development') {
      maybeRightNode = (
        <CoreDevelopmentLogs logs={state.logs} onDismiss={this._handleDismissSidebar} />
      );
    }

    // NOTE(jim): Rendering an IFrame while rendering a Lua window will trigger a double Open_URI
    const isRenderingIFrame =
      state.media &&
      !Strings.isEmpty(state.media.mediaUrl) &&
      !state.media.mediaUrl.endsWith('.lua');

    return (
      <CoreLayout
        ref={this._handleGetReference}
        topNode={maybeTopNode}
        bottomNode={maybeBottomNode}
        leftSidebarNode={maybeLeftSidebarNode}
        rightNode={maybeRightNode}>
        {state.mediaLoading ? <CoreLoadingScreen /> : null}
        {isRenderingIFrame ? (
          <CoreMediaScreen expanded={state.isMediaExpanded} media={state.media} />
        ) : null}
      </CoreLayout>
    );
  }
}
