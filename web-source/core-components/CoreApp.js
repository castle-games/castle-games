import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Fixtures from '~/common/fixtures';

import { css } from 'react-emotion';
import { isKeyHotkey } from 'is-hotkey';

import CoreLayout from '~/core-components/layouts/CoreLayout';

// NOTE(jim): Root Components
import CoreRootHeader from '~/core-components/CoreRootHeader';
import CoreRootURLInput from '~/core-components/CoreRootURLInput';
import CoreRootAuthenticatedSidebar from '~/core-components/CoreRootAuthenticatedSidebar';
import CoreRootDashboard from '~/core-components/CoreRootDashboard';
import CoreRootToolbar from '~/core-components/CoreRootToolbar';
import CoreRootPlaylistSidebar from '~/core-components/CoreRootPlaylistSidebar';

// NOTE(jim): Media Scene
import CoreMediaScreen from '~/core-components/CoreMediaScreen';
import CoreMediaInformation from '~/core-components/CoreMediaInformation';
import CoreMediaScoreInformation from '~/core-components/CoreMediaScoreInformation';

// NOTE(jim): Browse Scene
import CoreBrowsePlaylistResults from '~/core-components/CoreBrowsePlaylistResults';
import CoreBrowseMediaResults from '~/core-components/CoreBrowseMediaResults';
import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';

// NOTE(jim): Profile Scene
import CoreProfile from '~/core-components/CoreProfile';

// NOTE(jim): Playlist Scene
import CorePlaylist from '~/core-components/CorePlaylist';

const isOverlayHotkey = isKeyHotkey('mod+e');

export default class CoreApp extends React.Component {
  _layout;

  constructor(props) {
    super();

    this.state = props.state;
  }

  componentDidMount() {
    window.addEventListener('keydown', this._handleKeyDown);
    // NOTE(nikki): We directly handle resizes in native to prevent late redraw
    //window.addEventListener('resize', this._handleSetGameWindowSize);

    this._handleSetGameWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown);
    // NOTE(nikki): We directly handle resizes in native to prevent late redraw
    //window.removeEventListener('resize'.this._handleSetGameWindowSize);
  }

  _handleSetGameWindowSize = () => {
    const element = this._layout.getMediaContainerRef();
    const rect = element.getBoundingClientRect();

    try {
      window.cefQuery({
        request: JSON.stringify({
          type: 'SET_CHILD_WINDOW_FRAME',
          body: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          },
        }),
      });
    } catch (e) {
      alert('`cefQuery`: ' + e.message);
    }
  };

  _handleKeyDown = e => {
    if (isOverlayHotkey(e)) {
      return this._handleToggleOverlay();
    }
  };

  _handleToggleAuthentication = () => {
    this.setState(
      { viewer: this.state.viewer ? null : Fixtures.User, pageMode: null },
      this._handleSetGameWindowSize
    );
  };

  _handleSearchSubmit = () => {
    this.setState({
      searchResultsMedia: Fixtures.SearchResults,
    });
  };

  _handleSearchChange = e => {
    this.setState({
      searchQuery: e.target.value,
    });
  };

  _handleURLChange = e => this.setState({ [e.target.name]: e.target.value });

  _handleURLSubmit = () => {
    try {
      window.cefQuery({
        request: JSON.stringify({
          type: 'OPEN_URI',
          body: {
            uri: this.state.url,
          },
        }),
      });
    } catch (e) {
      alert('`cefQuery`: ' + e.message);
    }
  };

  _handleToggleBrowse = () => {
    this.setState({ pageMode: this.state.pageMode === 'browse' ? null : 'browse' });
  };

  _handleToggleProfile = () => {
    this.setState({ pageMode: this.state.pageMode === 'profile' ? null : 'profile' });
  };

  _handleRegisterGame = () => window.alert('register');

  _handleFavoriteMedia = () => window.alert('favorite');

  _handlePlayCreatorMedia = creator => {
    console.log({ creator });
  };

  _handleSubscribeToCreator = creator => {
    console.log({ creator });
  };

  _handleClickCreatorAvatar = creator => {
    console.log({ creator });
  };

  _handleClickCreatorCreations = creator => {
    console.log({ creator });
  };

  _handleClickCreatorPlaylists = creator => {
    console.log({ creator });
  };

  _handleToggleCurrentPlaylistDetails = () => {
    this.setState({
      pageMode: this.state.pageMode === 'playlist' ? null : 'playlist',
    });
  };

  _handleToggleCurrentPlaylist = () => {
    this.setState(
      {
        sidebarMode: 'current-playlist',
      },
      this._handleSetGameWindowSize
    );
  };

  _handleToggleDashboard = () => {
    this.setState(
      {
        sidebarMode: 'dashboard',
      },
      this._handleSetGameWindowSize
    );
  };

  _handleToggleMediaInfo = () => {
    this.setState(
      {
        sidebarMode: 'media-info',
      },
      this._handleSetGameWindowSize
    );
  };

  _handleShowProfileMediaList = () => {
    this.setState({
      profileMode: 'media',
    });
  };

  _handleShowProfilePlaylistList = () => {
    this.setState({
      profileMode: 'playlists',
    });
  };

  // NOTE(jim): I know these are identical. Not fully aware of all edge cases here yet.
  _handleDismissPlaylist = () => {
    this.setState({ sidebarMode: null }, this._handleSetGameWindowSize);
  };

  _handleDismissMediaInfo = () => {
    this.setState({ sidebarMode: null }, this._handleSetGameWindowSize);
  };

  _handleDismissDashboard = () => {
    this.setState({ sidebarMode: null }, this._handleSetGameWindowSize);
  };

  _handleToggleScore = () => {
    this.setState({ isScoreVisible: !this.state.isScoreVisible }, this._handleSetGameWindowSize);
  };

  _handleDismissScore = () => {
    this.setState({ isScoreVisible: false }, this._handleSetGameWindowSize);
  };

  _handleHideOverlay = () => {
    this.setState({ isOverlayActive: false }, this._handleSetGameWindowSize);
  };

  _handleToggleOverlay = () => {
    this.setState({ isOverlayActive: !this.state.isOverlayActive }, this._handleSetGameWindowSize);
  };

  _handleToggleMediaExpanded = () => {
    this.setState({ isMediaExpanded: !this.state.isMediaExpanded }, this._handleSetGameWindowSize);
  };

  render() {
    const { state } = this;

    let maybeLeftSidebarNode;
    if (state.isOverlayActive && state.viewer) {
      maybeLeftSidebarNode = (
        <CoreRootAuthenticatedSidebar
          viewer={state.viewer}
          onToggleProfile={this._handleToggleProfile}
          onToggleBrowse={this._handleToggleBrowse}
        />
      );
    }

    // NOTE(jim): Browse/Search Scene
    if (state.pageMode === 'browse') {
      return (
        <CoreLayout
          topNode={
            <CoreBrowseSearchInput
              searchQuery={state.searchQuery}
              onChange={this._handleSearchChange}
              onSubmit={this._handleSearchSubmit}
            />
          }
          rightSidebarNode={<CoreBrowsePlaylistResults onDismiss={this._handleToggleBrowse} />}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CoreBrowseMediaResults media={state.searchResultsMedia} />
        </CoreLayout>
      );
    }

    // NOTE(jim): Playlist Scene.
    // TODO(jim): Reusable Components.
    if (state.pageMode === 'playlist') {
      return (
        <CoreLayout leftSidebarNode={maybeLeftSidebarNode}>
          <CorePlaylist onDismiss={this._handleToggleCurrentPlaylistDetails} />
        </CoreLayout>
      );
    }

    // NOTE(jim): Profile Scene
    if (state.pageMode === 'profile') {
      return (
        <CoreLayout leftSidebarNode={maybeLeftSidebarNode}>
          <CoreProfile
            creator={state.viewer}
            profileMode={state.profileMode}
            onSignOut={this._handleToggleAuthentication}
            onDismiss={this._handleToggleProfile}
            onShowProfileMediaList={this._handleShowProfileMediaList}
            onShowProfilePlaylistList={this._handleShowProfilePlaylistList}
            onPlayCreatorMedia={this._handlePlayCreatorMedia}
            onSubscribeToCreator={this._handleSubscribeToCreator}
            onClickCreatorAvatar={this._handleClickCreatorAvatar}
            onClickCreatorCreations={this._handleClickCreatorCreations}
            onClickCreatorPlaylists={this._handleClickCreatorPlaylists}
          />
        </CoreLayout>
      );
    }

    // NOTE(jim): Media Page
    let maybeBottomNode;
    if (state.isOverlayActive) {
      maybeBottomNode = (
        <CoreRootURLInput
          name="url"
          value={state.url}
          viewer={state.viewer}
          expanded={state.isMediaExpanded}
          onChange={this._handleURLChange}
          onSubmit={this._handleURLSubmit}
          onToggleMediaExpanded={this._handleToggleMediaExpanded}
          onHideOverlay={this._handleHideOverlay}
          onFavoriteMedia={this._handleFavoriteMedia}
        />
      );
    }

    let maybeTopNode;
    if (state.isOverlayActive) {
      maybeTopNode = (
        <CoreRootHeader
          viewer={state.viewer}
          onToggleDashboard={this._handleToggleDashboard}
          onToggleAuthentication={this._handleToggleAuthentication}
          onToggleMediaInfo={this._handleToggleMediaInfo}
          onToggleScores={this._handleToggleScore}
          onToggleCurrentPlaylist={this._handleToggleCurrentPlaylist}
        />
      );
    }

    let maybeRightSidebarNode;
    if (state.isOverlayActive && state.isScoreVisible) {
      maybeRightSidebarNode = <CoreMediaScoreInformation onDismiss={this._handleDismissScore} />;
    }

    let maybeRightNode;
    if (state.isOverlayActive && state.sidebarMode === 'media-info') {
      maybeRightNode = (
        <CoreMediaInformation
          onDismiss={this._handleDismissMediaInfo}
          onRegisterMedia={this._handleRegisterGame}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'dashboard') {
      maybeRightNode = <CoreRootDashboard onDismiss={this._handleDismissDashboard} />;
    }

    if (state.isOverlayActive && state.sidebarMode === 'current-playlist') {
      maybeRightNode = (
        <CoreRootPlaylistSidebar
          playlist={state.playlist}
          onViewCurrentPlaylistDetails={this._handleToggleCurrentPlaylistDetails}
          onDismiss={this._handleDismissPlaylist}
        />
      );
    }

    if (state.isOverlayLayout) {
      return (
        <CoreLayoutOverlay
          topNode={maybeTopNode}
          bottomNode={maybeBottomNode}
          toolbarNode={maybeToolbarNode}
          leftSidebarNode={maybeLeftSidebarNode}
          rightSidebarNode={maybeRightSidebarNode}
          rightNode={maybeRightNode}>
          <CoreMediaScreen expanded={state.isMediaExpanded} />
        </CoreLayoutOverlay>
      );
    }

    return (
      <CoreLayout
        ref={reference => {
          this._layout = reference;
        }}
        topNode={maybeTopNode}
        bottomNode={maybeBottomNode}
        leftSidebarNode={maybeLeftSidebarNode}
        rightSidebarNode={maybeRightSidebarNode}
        rightNode={maybeRightNode}>
        <CoreMediaScreen expanded={state.isMediaExpanded} />
      </CoreLayout>
    );
  }
}
