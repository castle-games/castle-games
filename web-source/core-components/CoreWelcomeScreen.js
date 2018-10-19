import * as React from 'react';
import * as Constants from '~/common/constants';
import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';
import UIListMedia from '~/core-components/reusable/UIListMedia';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
`;

const STYLES_CONTENT = css`
  padding: 48px 16px 16px 16px;
  max-width: 480px;
  width: 100%;
`;

const STYLES_TITLE = css`
  font-family: ${Constants.font.mono};
  color: ${Constants.colors.white};
  font-size: 24px;
  font-weight: 400;
  display: flex;
  align-items: center;
`;

const STYLES_HEADING = css`
  color: ${Constants.colors.white};
  font-size: 18px;
  font-weight: 600;
`;

const STYLES_SUB_PARAGRAPH = css`
  color: ${Constants.colors.white};
  font-size: 14px;
  margin-top: 8px;
  line-height: 1.725;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.white};
  font-size: 14px;
  margin-top: 16px;
  line-height: 1.725;
`;

const STYLES_ACTIONS = css`
  margin-top: 24px;
  font-size: 18px;
  flex-shrink: 0;
  border-top: 1px solid ${Constants.colors.border};
`;

const STYLES_OPTION = css`
  color: ${Constants.colors.white60};
  border-bottom: 1px solid ${Constants.colors.border};
  font-size: 12px;
  font-weight: 600;
  padding: 16px 0 16px 0;
  transition: 200ms ease color;
  display: flex;
  align-items: center;
  :hover {
    cursor: pointer;
    color: ${Constants.colors.white};
  }
`;

// -----------------------------------------------------------
// TODO(jim): Move this this
const STYLES_PLAYLIST_ITEM = css`
  border-radius: 8px;
  overflow: hidden;
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  display: inline-block;
  width: 264px;
  transition: 200ms ease all;
  transform: scale(1);
  cursor: pointer;
  margin: 0 16px 16px 0;

  :hover {
    transform: scale(1.1);
  }
`;

const STYLES_PLAYLIST_ITEM_IMAGE = css`
  width: 100%;
  height: 128px;
  display: block;
  background: #ececec;
  background-size: cover;
  background-position: 50% 50%;
`;

const STYLES_PLAYLIST_ITEM_BOTTOM = css`
  padding: 8px;
`;

const STYLES_PLAYLIST_ITEM_BOTTOM_HEADING = css`
  font-size: 14px;
  line-height: 28px;
  font-weight: 600;
`;

const STYLES_PLAYLIST_ITEM_BOTTOM_DESCRIPTION = css`
  font-size: 14px;
  line-height: 1.725;
`;

export class UIPlaylistItem extends React.Component {
  render() {
    return (
      <div
        className={STYLES_PLAYLIST_ITEM}
        onClick={() => this.props.onPlaylistSelect(this.props.playlist)}>
        <figure
          className={STYLES_PLAYLIST_ITEM_IMAGE}
          style={{ backgroundImage: this.props.src ? `url(${this.props.src})` : null }}
        />
        <div className={STYLES_PLAYLIST_ITEM_BOTTOM}>
          <div className={STYLES_PLAYLIST_ITEM_BOTTOM_HEADING}>{this.props.playlist.name}</div>
          <div className={STYLES_PLAYLIST_ITEM_BOTTOM_DESCRIPTION}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}

// TODO(jim): Move this this
// -----------------------------------------------------------

const STYLES_SECTION = css`
  padding: 32px 16px 16px 16px;
`;

const STYLES_PLAYLISTS = css`
  padding: 16px 0 0 0;
`;

export default class CoreWelcomeScreen extends React.Component {
  static defaultProps = {
    featuredMedia: [],
    featuredPlaylists: [],
  };

  render() {
    const { featuredMedia, featuredPlaylists } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <img height="48px" src="static/castle-wordmark.png" />
          <p className={STYLES_PARAGRAPH}>
            Use the top search bar to search for games. Below are some cool experiences that people
            have made:
          </p>
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Playlists</div>
          <div className={STYLES_PLAYLISTS}>
            {featuredPlaylists.map(p => {
              return (
                <UIPlaylistItem
                  key={p.playlistId}
                  onPlaylistSelect={this.props.onPlaylistSelect}
                  playlist={p}>
                  {p.mediaItems.length} games
                </UIPlaylistItem>
              );
            })}
          </div>
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>Staff Picks</div>
          <div className={STYLES_SUB_PARAGRAPH}>
            Here are some games we enjoy playing on Castle.
          </div>
        </div>
        <UIListMedia
          mediaItems={featuredMedia}
          onUserSelect={this.props.onUserSelect}
          onMediaSelect={this.props.onMediaSelect}
        />
      </div>
    );
  }
}
