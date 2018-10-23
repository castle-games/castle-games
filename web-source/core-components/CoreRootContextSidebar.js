import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import CoreRootDashboard from '~/core-components/CoreRootDashboard';

import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UICardMedia from '~/core-components/reusable/UICardMedia';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UILink from '~/core-components/reusable/UILink';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_FIXED_CONTAINER = css`
  position: relative;
  width: 420px;
  height: 100%;
  padding-top: 48px;
  border-left: 1px solid ${Constants.colors.border};
`;

const STYLES_FIXED_HEADER = css`
  background: ${Constants.colors.background};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const STYLES_CONTAINER = css`
  @keyframes playlist-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: playlist-animation 280ms ease;

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_ACTION = css`
  margin-top: 8px;
  padding: 0 16px 0 16px;
`;

const STYLES_ACTION_ITEM = css`
  margin-top: 8px;
`;

export default class CoreRootContextSidebar extends React.Component {
  _reference;

  static defaultProps = {
    allMedia: [],
    allMediaFiltered: [],
  };

  state = {
    mode: 'media',
  };

  viewMediaContext = () => {
    this.setState({ mode: 'media' });
  };

  viewPlaylistContext = () => {
    this.setState({ mode: 'playlist' });
  };

  viewHistoryContext = () => {
    this.setState({ mode: 'history' });
  };

  getRef = () => {
    return this._reference;
  };

  render() {
    const headerNode = (
      <div className={STYLES_FIXED_HEADER}>
        <UIHeaderDismiss>
          <UIControl
            onClick={this.viewMediaContext}
            style={{ marginRight: 24 }}
            isActive={this.state.mode === 'media'}>
            <SVG.MediaIcon height="19px" />
          </UIControl>
          <UIControl
            onClick={this.viewPlaylistContext}
            isActive={this.state.mode === 'playlist'}
            style={{ marginRight: 24 }}>
            <SVG.PlaylistIcon height="16px" />
          </UIControl>
          <UIControl onClick={this.viewHistoryContext} isActive={this.state.mode === 'history'}>
            <SVG.History height="22px" />
          </UIControl>
        </UIHeaderDismiss>
      </div>
    );

    if (this.state.mode === 'history') {
      return (
        <div
          className={STYLES_FIXED_CONTAINER}
          ref={c => {
            this._reference = c;
          }}>
          {headerNode}
          <CoreRootDashboard
            media={this.props.media}
            storage={this.props.storage}
            onMediaSelect={this.props.onMediaSelect}
            onUserSelect={this.props.onUserSelect}
            onClearHistory={this.props.onClearHistory}
            onSelectRandom={this.props.onSelectRandom}
          />
        </div>
      );
    }

    if (this.state.mode === 'media') {
      if (!this.props.media) {
        return (
          <div
            className={STYLES_FIXED_CONTAINER}
            ref={c => {
              this._reference = c;
            }}>
            {headerNode}
            <div className={STYLES_CONTAINER}>
              <UIEmptyState title="No media loaded">
                You aren't playing anything at the moment. Want to get started with Castle?
              </UIEmptyState>
              <div className={STYLES_ACTION}>
                <div className={STYLES_ACTION_ITEM}>
                  <UIButtonIconHorizontal
                    onClick={this.props.onToggleBrowse}
                    icon={<SVG.Search height="16px" />}>
                    Browse media
                  </UIButtonIconHorizontal>
                </div>
                <div className={STYLES_ACTION_ITEM}>
                  <UIButtonIconHorizontal
                    onClick={this.props.onSelectRandom}
                    icon={<SVG.MediaIcon height="16px" />}>
                    Play a random game
                  </UIButtonIconHorizontal>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          className={STYLES_FIXED_CONTAINER}
          ref={c => {
            this._reference = c;
          }}>
          {headerNode}
          <div className={STYLES_CONTAINER}>
            <UIEmptyState title="Now playing" />
            <UICardMedia
              viewer={this.props.viewer}
              media={this.props.media}
              onUserSelect={this.props.onUserSelect}
              onRegisterMedia={this.props.onRegisterMedia}
              onToggleProfile={this.props.onToggleProfile}
              onSelectRandom={this.props.onSelectRandom}
              onRefreshViewer={this.props.onRefreshViewer}
            />
          </div>
        </div>
      );
    }

    let titleString = `Showing ${this.props.allMedia.length} creations`;
    if (!Strings.isEmpty(this.props.searchQuery) && this.props.allMediaFiltered.length) {
      titleString = `Results for "${this.props.searchQuery}" (${
        this.props.allMediaFiltered.length
      })`;
    }

    return (
      <div
        className={STYLES_FIXED_CONTAINER}
        ref={c => {
          this._reference = c;
        }}>
        {headerNode}
        <div className={STYLES_CONTAINER}>
          <UIEmptyState title={titleString} />
          <UIListMedia
            media={this.props.media}
            onMediaSelect={this.props.onMediaSelect}
            onUserSelect={this.props.onUserSelect}
            mediaItems={
              this.props.allMediaFiltered.length ? this.props.allMediaFiltered : this.props.allMedia
            }
          />
        </div>
      </div>
    );
  }
}
