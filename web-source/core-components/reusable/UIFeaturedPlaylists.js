import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_PLAYLISTS = css`
  display: flex;
`;

const STYLES_PLAYLIST_ITEM = css`
  border-radius: 8px;
  overflow: hidden;
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  display: inline-block;
  width: 264px;
  height: 420px;
  transition: 200ms ease all;
  transform: scale(1);
  cursor: pointer;
  margin: 0 24px 24px 0;
  background-color: ${Constants.colors.white};
  background-size: cover;
  background-position: 50% 50%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  color: ${Constants.colors.white};
  border: 1px solid ${Constants.colors.yellow};

  :hover {
    transform: scale(1.05);
  }
`;

const STYLES_PLAYLIST_ITEM_BOTTOM = css`
  padding: 8px;
  height: 100%;
  width: 100%;
  background: -moz-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  ); /* FF3.6-15 */
  background: -webkit-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  ); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#cc000000', endColorstr='#00000000',GradientType=1 );
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const STYLES_PLAYLIST_ITEM_BOTTOM_HEADING = css`
  font-size: 28px;
  line-height: 32px;
  font-weight: 400;
`;

const STYLES_PLAYLIST_ITEM_BOTTOM_DESCRIPTION = css`
  font-size: 12px;
  margin-top: 8px;
  line-height: 1.725;
`;

class UIPlaylistItem extends React.Component {
  render() {
    return (
      <div
        className={STYLES_PLAYLIST_ITEM}
        onClick={() => this.props.onPlaylistSelect(this.props.playlist)}
        style={{ backgroundImage: this.props.src ? `url(${this.props.src})` : null }}>
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
      <div className={STYLES_PLAYLISTS}>
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
