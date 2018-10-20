import * as React from 'react';
import * as Constants from '~/common/constants';
import { css } from 'react-emotion';

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

class UIPlaylistItem extends React.Component {
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

export default class UIFeaturedPlaylists extends React.Component {
  render() {
    const { playlists } = this.props;
    return (
      <div>
        {playlists.map(p => {
          return (
            <UIPlaylistItem
              key={p.playlistId}
              onPlaylistSelect={this.props.onPlaylistSelect}
              src={p.coverImage && p.coverImage.imgixUrl}
              playlist={p}>
              {p.mediaItems.length} games
            </UIPlaylistItem>
          );
        })}
      </div>
    );
  }
}
