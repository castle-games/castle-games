import * as React from 'react';
import * as Strings from '~/common/strings';
import * as Utilities from '~/common/utilities';
import * as ReactDOM from 'react-dom';
import * as Slack from '~/common/slack';
import * as Actions from '~/common/actions';
import * as Network from '~/common/network';
import * as CEF from '~/common/cef';

import { css } from 'react-emotion';
import { isKeyHotkey } from 'is-hotkey';
import { LOADER_STRING } from '~/core-components/primitives/loader';

import CoreLayout from '~/core-components/layouts/CoreLayout';
import CoreLoadingScreen from '~/core-components/CoreLoadingScreen';
import CoreRootHeader from '~/core-components/CoreRootHeader';
import CoreRootURLInput from '~/core-components/CoreRootURLInput';
import CoreRootLeftSidebar from '~/core-components/CoreRootLeftSidebar';
import CoreRootToolbar from '~/core-components/CoreRootToolbar';
import CoreRootContextSidebar from '~/core-components/CoreRootContextSidebar';
import CoreLoginSignup from '~/core-components/CoreLoginSignup';
import CoreMediaScreen from '~/core-components/CoreMediaScreen';
import CoreBrowserScreen from '~/core-components/CoreBrowserScreen';
import CoreBrowseResults from '~/core-components/CoreBrowseResults';
import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';
import CoreProfile from '~/core-components/CoreProfile';
import CoreProfileSidebar from '~/core-components/CoreProfileSidebar';
import CorePlaylist from '~/core-components/CorePlaylist';
import CoreDevelopmentLogs from '~/core-components/CoreDevelopmentLogs';

const isOverlayHotkey = isKeyHotkey('mod+e');
const isDevelopmentLogHotkey = isKeyHotkey('mod+j');
const isOrientationHotkey = isKeyHotkey('mod+shift+o');
const isReloadHotkey = isKeyHotkey('mod+r');
const isAppReloadHotkey = isKeyHotkey('mod+shift+r');

const POLL_DELAY = 300;
const ENABLE_HIDE_OVERLAY = false;

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
      this.updateFrame();
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

  updateFrame = () => {
    if (this._isLockedFromCEFUpdates) {
      return;
    }

    const element = this._layout.getMediaContainerRef();
    const rect = element.getBoundingClientRect();
    CEF.updateWindowFrame(rect);
  };

  hideFrame = () => {
    // TODO(jim): Hide Frame doesn't actually close the CEF. but makes it invisible instead.
    this.closeCEF();

    if (this._isLockedFromCEFUpdates) {
      return;
    }

    // TODO(jim): when we are ready to, we can replace this with actual hide code.
    const element = this._layout.getMediaContainerRef();
    const rect = element.getBoundingClientRect();
    CEF.updateWindowFrame(rect);
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
    await Actions.delay(2000);

    this.setState({ mediaLoading: false });
  };

  _handleNativeLoadError = () => {
    this.setState({ mediaLoading: false });
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

    this.setState({ ...state }, this.updateFrame);
  };

  setStateHideCEF = state => {
    if (this._isLockedFromCEFUpdates) {
      return this.setState({ ...state });
    }

    this.setState({ ...state }, this.hideFrame);
  };

  appReload = async e => {
    if (e) {
      e.preventDefault();
    }

    const loader = document.createElement('div');
    loader.innerHTML = LOADER_STRING.trim();
    loader.id = 'loader';

    document.body.appendChild(loader);

    const {
      featuredMedia,
      featuredPlaylists,
      allMedia,
      allPlaylists,
      viewer,
      isOffline,
    } = await Network.getProductData();

    const state = {
      featuredMedia,
      featuredPlaylists,
      viewer,
      allMedia,
      allPlaylists,
      allMediaFiltered: [...allMedia],
      allPlaylistsFiltered: [...allPlaylists],
      isOffline,
    };

    document.getElementById('loader').classList.add('loader--finished');
    await Actions.delay(300);

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

    this.setState({ media: null, mediaUrl }, async () => {
      await Actions.delay(100);

      if (mediaUrl.endsWith('.lua')) {
        this.goToLUA(mediaUrl);
        return;
      }

      this.goToHTML5Media({ mediaUrl });
    });
  };

  _handleLogin = viewer =>
    this.setState({ viewer, creator: viewer, pageMode: viewer ? 'profile' : 'browse' });

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
    if (this.state.mediaUrl !== media.mediaUrl && window.cefQuery) {
      this.setState({ mediaLoading: true });
    }

    amplitude.getInstance().logEvent('OPEN_HTML5', {
      mediaUrl: media.mediaUrl,
    });

    const existingMedia = await Actions.getMediaByURL({
      mediaUrl: media.mediaUrl,
    });

    this._handleSetHistory(existingMedia ? existingMedia : media);

    this.setStateWithCEF({
      media: existingMedia ? existingMedia : media,
      mediaUrl: media.mediaUrl,
      pageMode: null,
      creator: null,
      browserUrl: null,
    });
  };

  goToLUA = async mediaUrl => {
    if (Strings.isEmpty(mediaUrl)) {
      return;
    }

    amplitude.getInstance().logEvent('OPEN_LUA', {
      mediaUrl,
    });

    this.closeCEF();

    const media = await Actions.getMediaByURL({ mediaUrl });

    this.openCEF(mediaUrl);

    this._handleSetHistory(media ? media : { mediaUrl });

    this.setStateWithCEF({
      media: media ? media : { mediaUrl },
      mediaUrl,
      pageMode: null,
      creator: null,
      browserUrl: null,
    });
  };

  _handleNativeOpenUrl = e => {
    let { params } = e;
    let { url } = params;

    if (Strings.isEmpty(url)) {
      return;
    }

    url = url.replace('castle://', 'http://');
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

    if (isOrientationHotkey(e)) {
      return this._handleOrientationChange(e);
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

  _handleNavigateToBrowserPage = browserUrl => {
    if (window.cefQuery) {
      CEF.openExternalURL(browserUrl);

      return;
    }

    this.setState({ browserUrl, pageMode: null });
  };

  _handleDismissBrowserPage = () => this.setState({ browserUrl: null });

  _handleSearchSubmit = async e => this._handleSearchChange(e);

  _handleSearchReset = () => {
    this.setState({
      searchQuery: '',
      allMediaFiltered: [...this.state.allMedia],
      allPlaylistsFiltered: [...this.state.allPlaylists],
      pageMode: 'browse',
    });
  };

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

  _handlePlaylistSelect = async playlist => {
    const serverPlaylist = await Actions.getPlaylist(playlist);
    if (!serverPlaylist) {
      return;
    }

    this.setState({
      pageMode: 'playlist',
      allMediaFiltered:
        serverPlaylist.mediaItems && serverPlaylist.mediaItems.length
          ? [...serverPlaylist.mediaItems]
          : [...this.state.allMediaFiltered],
      creator: null,
      playlist: serverPlaylist,
      searchQuery: Strings.isEmpty(playlist.name) ? '' : playlist.name.slice(0),
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

    if (this.state.pageMode === 'profile') {
      this.setState({ pageMode: 'profile', creator: { ...creator } });
      return;
    }

    this.setStateHideCEF({
      pageMode: 'profile',
      profileMode: 'media',
      creator: { ...creator }
    });
  };

  _handleMediaSelect = (media, isHistory) => {
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

    if (isHistory) {
      this.setState({
        playlist: null,
        searchQuery: '',
        allMediaFiltered: [...this.state.allMedia],
      });
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

  _handleSelectNext = () => {
    if (!this.state.allMediaFiltered.length) {
      return;
    }

    const index = this.state.allMediaFiltered.findIndex(m => m.mediaUrl === this.state.mediaUrl);
    const newIndex = (index + 1) % this.state.allMediaFiltered.length;

    this._handleMediaSelect(this.state.allMediaFiltered[newIndex]);
  };

  _handleSelectPrevious = () => {
    if (!this.state.allMediaFiltered.length) {
      return;
    }

    const index = this.state.allMediaFiltered.findIndex(m => m.mediaUrl === this.state.mediaUrl);
    const newIndex =
      (index + this.state.allMediaFiltered.length - 1) % this.state.allMediaFiltered.length;

    this._handleMediaSelect(this.state.allMediaFiltered[newIndex]);
  };

  _handleOrientationChange = () => {
    this.setStateWithCEF({
      isHorizontalOrientation: this.state.isHorizontalOrientation ? false : true,
    });
  };

  _handleToggleProfile = () => {
    const updates = {
      pageMode: 'profile',
      creator: { ...this.state.viewer },
    };

    this.setStateHideCEF({ ...updates });
  };

  _handleTogglePlay = () => {
    const updates = {
      pageMode: null,
      creator: null,
    };

    // TODO(jim): Won't be necessary when we enable hide.
    if (!Strings.isEmpty(this.state.mediaUrl)) {
      if (this.state.mediaUrl.endsWith('.lua')) {
        this.openCEF(this.state.mediaUrl);
      }
    }

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleToggleBrowse = () => {
    // NOTE(jim):
    // We can probably make this more elegant later.
    if (this.state.pageMode === 'playlist') {
      return;
    }

    const updates = {
      pageMode: 'browse',
      creator: null,
    };

    this.setStateHideCEF({
      ...updates,
    });
  };

  _handleToggleSignIn = () => {
    const updates = {
      pageMode: 'sign-in',
      creator: null,
    };

    this.setStateHideCEF({ ...updates });
  };

  _handleToggleCurrentPlaylistDetails = () => {
    const updates = {
      pageMode: 'playlist',
      creator: null,
    };

    this.setStateHideCEF({
      ...updates,
    });
  };

  _handleToggleCurrentContext = () => {
    const updates = {
      pageMode: null,
      creator: null,
      sidebarMode: this.state.sidebarMode === 'current-context' ? null : 'current-context',
    };

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

    this.setStateWithCEF({
      ...updates,
    });
  };

  _handleShowProfileMediaList = () => {
    this.setState({
      profileMode: 'media',
    });
  };

  _handleShowProfilePlaylistList = () =>
    this.setState({
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

    this.setStateHideCEF({
      viewer: null,
      creator: null,
      pageMode: 'sign-in',
    });
  };

  _handleDismissSidebar = () => this.setStateWithCEF({ sidebarMode: null });

  _handleHideOverlay = () => {
    const updates = {
      isOverlayActive: false,
      pageMode: null,
    };

    this.setStateWithCEF({ ...updates });
  };

  _handleToggleOverlay = () => {
    const updates = {
      isOverlayActive: !this.state.isOverlayActive,
      pageMode: null,
    };

    this.setStateWithCEF({
      ...updates,
    });
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
      onHideOverlay={this._handleHideOverlay}
    />
  );

  renderRootSearchInput = () => (
    <CoreBrowseSearchInput
      searchQuery={this.state.searchQuery}
      onSearchReset={this._handleSearchReset}
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

    // NOTE(jim): Rendering an IFrame while rendering a Lua window will trigger a double Open_URI
    const isRenderingIFrame =
      state.media &&
      !Strings.isEmpty(state.media.mediaUrl) &&
      !state.media.mediaUrl.endsWith('.lua');

    const isRenderingBrowser = !Strings.isEmpty(state.browserUrl);

    let maybeFrameNode;
    if (isRenderingIFrame) {
      maybeFrameNode = (
        <CoreMediaScreen
          key="core-media-screen"
          isExpanded={state.isMediaExpanded}
          isVisible={!state.pageMode}
          media={state.media}
        />
      );
    }

    let maybeBrowserNode;
    if (isRenderingBrowser) {
      maybeBrowserNode = (
        <CoreBrowserScreen
          key="core-browser-screen"
          isVisible={!state.pageMode}
          onDismiss={this._handleDismissBrowserPage}
          browserUrl={state.browserUrl}
        />
      );
    }

    let maybeLeftSidebarNode;
    if (state.isOverlayActive && !state.isOffline) {
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
          {maybeFrameNode}
          <CoreBrowseResults
            allMedia={state.allMedia}
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
          {maybeFrameNode}
          <CoreLoginSignup onLogin={this._handleLogin} />
        </CoreLayout>
      );
    }

    if (isViewerViewingPlaylistScene) {
      return (
        <CoreLayout
          ref={reference => {
            this._layout = reference;
          }}
          leftSidebarNode={maybeLeftSidebarNode}>
          {maybeFrameNode}
          <CorePlaylist
            viewer={state.viewer}
            playlist={state.playlist}
            onSearchReset={this._handleSearchReset}
            onDismiss={this._handleSearchReset}
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
          rightNode={
            isViewingOwnProfile ? (
              <CoreProfileSidebar
                onMediaAdd={this._handleMediaAdd}
                onPlaylistAdd={this._handlePlaylistAdd}
              />
            ) : null
          }>
          {maybeFrameNode}
          <CoreProfile
            viewer={state.viewer}
            creator={state.creator}
            profileMode={state.profileMode}
            isViewingOwnProfile={isViewingOwnProfile}
            onDismiss={this._handleSearchReset}
            onSearchReset={this._handleSearchReset}
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
          isOffline={state.isOffline}
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
          searchQuery={state.searchQuery}
          onNavigateToBrowserPage={this._handleNavigateToBrowserPage}
          onRefreshViewer={this.refreshViewer}
          onRegisterMedia={this._handleRegisterGame}
          onToggleBrowse={this._handleToggleBrowse}
          onToggleProfile={this._handleToggleProfile}
          onMediaSelect={this._handleMediaSelect}
          onUserSelect={this._handleUserSelect}
          onViewCurrentPlaylistDetails={this._handleToggleCurrentPlaylistDetails}
          onClearHistory={this._handleClearHistory}
          onSelectRandom={this._handleSelectRandom}
          onSelectNext={this._handleSelectNext}
          onSelectPrevious={this._handleSelectPrevious}
          onDismiss={this._handleDismissSidebar}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'development') {
      maybeRightNode = (
        <CoreDevelopmentLogs logs={state.logs} onDismiss={this._handleDismissSidebar} />
      );
    }

    return (
      <CoreLayout
        ref={this._handleGetReference}
        topNode={maybeTopNode}
        bottomNode={maybeBottomNode}
        leftSidebarNode={maybeLeftSidebarNode}
        isHorizontalOrientation={state.isHorizontalOrientation}
        rightNode={maybeRightNode}>
        {maybeBrowserNode}
        {state.mediaLoading ? <CoreLoadingScreen /> : null}
        {maybeFrameNode}
      </CoreLayout>
    );
  }
}
