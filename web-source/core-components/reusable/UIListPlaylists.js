import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_ICON_COLUMN = css`
  width: 40px;
  flex-shrink: 0;
  padding: 12px 16px 12px 16px;

  :hover {
    color: ${Constants.colors.selected};
  }
`;

const STYLES_CONTAINER = css`
  padding: 0 0 0 0;
  color: ${Constants.colors.white};
`;

const STYLES_ROW_TITLE = css`
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: ${Constants.colors.foreground};
`;

const STYLES_ROW = css`
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid ${Constants.colors.border};
  overflow-wrap: break-word;
  word-wrap: break-word;
  cursor: pointer;

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_COLUMN = css`
  flex-shrink: 0;
  width: 112px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: 12px 16px 12px 16px;

  :hover {
    color: ${Constants.colors.selected};
  }
`;

const STYLES_COLUMN_NO_INTERACTION = css`
  flex-shrink: 0;
  width: 112px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: 12px 16px 12px 16px;
`;

const STYLES_FLUID_COLUMN = css`
  min-width: 25%;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: 12px 16px 12px 16px;

  :hover {
    color: ${Constants.colors.selected};
  }
`;

const STYLES_FLUID_COLUMN_NO_INTERACTION = css`
  min-width: 25%;
  width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  padding: 12px 16px 12px 16px;
`;

const STYLES_ITEM = css`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`;

export default class UIListPlaylists extends React.Component {
  render() {
    const isOwner =
      this.props.viewer &&
      this.props.creator &&
          this.props.viewer.userId === this.props.creator.userId;

    let maybeTitleRow;
    if (this.props.noTitleRow) {
      maybeTitleRow = (<div style={{ borderTop: `16px solid ${Constants.colors.border}` }} />);
    } else {
      const ownerCol = (isOwner) ? (<div className={STYLES_COLUMN_NO_INTERACTION} />) : null;
      maybeTitleRow = (
        <div className={STYLES_ROW_TITLE}>
          <div className={STYLES_ICON_COLUMN} />
          <div className={STYLES_FLUID_COLUMN_NO_INTERACTION}>Playlist Name</div>
          <div className={STYLES_COLUMN_NO_INTERACTION} style={{ width: '20%' }}>
            Author
          </div>
          <div className={STYLES_COLUMN_NO_INTERACTION}>Games</div>
          {ownerCol}
        </div>
      );
    }
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        {maybeTitleRow}
        {this.props.playlists.map((p, i) => {
          let mediaItems = [];
          if (p.mediaItems && p.mediaItems.length) {
            mediaItems = p.mediaItems;
          }

          const author = p && p.user && p.user.username ? p.user.username : '-';
          const actionsElement = isOwner ? (
            <div className={STYLES_COLUMN}>
              <span className={STYLES_ITEM} onClick={() => this.props.onPlaylistRemove(p)}>
                Delete
              </span>
            </div>
          ) : null;

          return (
            <div className={STYLES_ROW} key={`playlist-list-item-${p.playlistId}`}>
              <div className={STYLES_ICON_COLUMN} onClick={() => this.props.onPlaylistSelect(p)}>
                <SVG.PlaylistIcon height="16px" />
              </div>
              <div className={STYLES_FLUID_COLUMN} onClick={() => this.props.onPlaylistSelect(p)}>
                {p.name}
              </div>
              <div
                className={STYLES_COLUMN}
                style={{ width: '20%' }}
                onClick={() => this.props.onUserSelect(p.user)}>
                {author}
              </div>
              <div className={STYLES_COLUMN_NO_INTERACTION}>{mediaItems.length}</div>
              {actionsElement}
            </div>
          );
        })}
      </div>
    );
  }
}
