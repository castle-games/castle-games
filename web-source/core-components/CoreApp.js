import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Fixtures from '~/common/fixtures';

import { css } from 'react-emotion';
import { isKeyHotkey } from 'is-hotkey';

import CoreLayout from '~/core-components/layouts/CoreLayout';

// NOTE(jim): Media Page
import CoreMediaScreen from '~/core-components/CoreMediaScreen';
import CoreBrowserHeader from '~/core-components/CoreBrowserHeader';
import CoreBrowserURLInput from '~/core-components/CoreBrowserURLInput';
import CoreNavigationSidebar from '~/core-components/CoreNavigationSidebar';
import CoreGameInfo from '~/core-components/CoreGameInfo';
import CoreUserDashboard from '~/core-components/CoreUserDashboard';
import CoreScoreInfo from '~/core-components/CoreScoreInfo';
import CoreToolbar from '~/core-components/CoreToolbar';

// NOTE(jim): Browse Page
import CoreBrowsePlaylistResults from '~/core-components/CoreBrowsePlaylistResults';
import CoreBrowseMediaResults from '~/core-components/CoreBrowseMediaResults';
import CoreBrowseSearchInput from '~/core-components/CoreBrowseSearchInput';

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
      { viewer: this.state.viewer ? null : Fixtures.User },
      this._handleSetGameWindowSize
    );
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

  _handleToggleSearch = () => {
    this.setState({ pageMode: this.state.pageMode === 'browse' ? null : 'browse' });
  };

  _handleToggleProfile = () => {
    this.setState({ pageMode: this.state.pageMode === 'profile' ? null : 'profile' });
  };

  _handleRegisterGame = () => window.alert('register');
  _handleFavoriteMedia = () => window.alert('favorite');

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
        <CoreNavigationSidebar
          viewer={state.viewer}
          onToggleProfile={this._handleToggleProfile}
          onToggleSearch={this._handleToggleSearch}
        />
      );
    }

    // NOTE(jim): Browse/Search Page
    // TODO(jim): Reusable Components
    if (state.pageMode === 'browse') {
      return (
        <CoreLayout
          topNode={<CoreBrowseSearchInput />}
          rightSidebarNode={<CoreBrowsePlaylistResults />}
          leftSidebarNode={maybeLeftSidebarNode}>
          <CoreBrowseMediaResults />
        </CoreLayout>
      );
    }

    // NOTE(jim): Playlist Page.
    // TODO(jim): Reusable Components.
    if (state.pageMode === 'playlist') {
      return (
        <CoreLayout leftSidebarNode={maybeLeftSidebarNode} rightSidebarNode={<div>Hello</div>}>
          Playlist
        </CoreLayout>
      );
    }

    // NOTE(jim): Profile Page
    // TDOO(jim): Reusable Components
    if (state.pageMode === 'profile') {
      return <CoreLayout leftSidebarNode={maybeLeftSidebarNode}>Profile</CoreLayout>;
    }

    // NOTE(jim): Media Page
    let maybeBottomNode;
    if (state.isOverlayActive) {
      maybeBottomNode = (
        <CoreBrowserURLInput
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
        <CoreBrowserHeader
          viewer={state.viewer}
          onToggleDashboard={this._handleToggleDashboard}
          onToggleAuthentication={this._handleToggleAuthentication}
          onToggleMediaInfo={this._handleToggleMediaInfo}
          onToggleScores={this._handleToggleScore}
        />
      );
    }

    let maybeRightSidebarNode;
    if (state.isOverlayActive && state.isScoreVisible) {
      maybeRightSidebarNode = <CoreScoreInfo onDismiss={this._handleDismissScore} />;
    }

    let maybeRightNode;
    if (state.isOverlayActive && state.sidebarMode === 'media-info') {
      maybeRightNode = (
        <CoreGameInfo
          onDismiss={this._handleDismissMediaInfo}
          onRegisterMedia={this._handleRegisterGame}
        />
      );
    }

    if (state.isOverlayActive && state.sidebarMode === 'dashboard') {
      maybeRightNode = <CoreUserDashboard onDismiss={this._handleDismissDashboard} />;
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
