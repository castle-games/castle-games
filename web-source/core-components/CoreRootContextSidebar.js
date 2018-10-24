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
  width: 100%;
  height: 100%;
  padding: 48px 0 48px 0;
`;

const STYLES_FIXED_HEADER = css`
  background: ${Constants.colors.background};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const STYLES_FIXED_FOOTER = css`
  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-top: 1px solid ${Constants.colors.border};
  height: 48px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  padding-left: 16px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_MIDDLE = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 25%;
  width: 100%;
  height: 100%;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  padding-right: 16px;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

  width: 100%;
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

    const footerNode = this.props.allMediaFiltered.length ? (
      <footer className={STYLES_FIXED_FOOTER}>
        <div className={STYLES_LEFT}>
          <UIControl onClick={this.props.onSelectPrevious}>Previous</UIControl>
        </div>
        <div className={STYLES_MIDDLE}>
          <UIControl onClick={this.props.onSelectRandom}>Random</UIControl>
        </div>
        <div className={STYLES_RIGHT}>
          <UIControl onClick={this.props.onSelectNext}>Next</UIControl>
        </div>
      </footer>
    ) : null;

    if (this.state.mode === 'history') {
      return (
        <div
          className={STYLES_FIXED_CONTAINER}
          ref={c => {
            this._reference = c;
          }}
          style={{ padding: `48px 0 0 0` }}>
          {headerNode}
          <div className={STYLES_CONTAINER}>
            <CoreRootDashboard
              media={this.props.media}
              storage={this.props.storage}
              onMediaSelect={this.props.onMediaSelect}
              onUserSelect={this.props.onUserSelect}
              onClearHistory={this.props.onClearHistory}
              onSelectRandom={this.props.onSelectRandom}
            />
          </div>
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
              </div>
            </div>
            {footerNode}
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
              onRefreshViewer={this.props.onRefreshViewer}
            />
          </div>
          {footerNode}
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
        {footerNode}
      </div>
    );
  }
}
