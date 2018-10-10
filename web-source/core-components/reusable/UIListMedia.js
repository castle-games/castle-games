import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_CONTAINER = css`
  padding: 0 0 88px 0;
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
  cursor: pointer;

  :last-child {
    border-bottom: 0;
  }

  transition: 200ms background ease;
`;

const STYLES_COLUMN = css`
  flex-shrink: 0;
  width: 128px;
  padding: 12px 16px 12px 16px;
  overflow-wrap: break-word;

  :hover {
    color: ${Constants.colors.yellow};
  }
`;

const STYLES_COLUMN_NO_INTERACTION = css`
  flex-shrink: 0;
  width: 128px;
  overflow-wrap: break-word;
  padding: 12px 16px 12px 16px;
`;

const STYLES_FLUID_COLUMN = css`
  min-width: 25%;
  width: 100%;
  overflow-wrap: break-word;
  padding: 12px 16px 12px 16px;
  :hover {
    color: ${Constants.colors.yellow};
  }
`;

const STYLES_FLUID_COLUMN_NO_INTERACTION = css`
  min-width: 25%;
  width: 100%;
  overflow-wrap: break-word;
  padding: 12px 16px 12px 16px;
`;

const STYLES_ITEM = css`
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

export default class UIListMedia extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <div className={STYLES_ROW_TITLE}>
          <div className={STYLES_FLUID_COLUMN_NO_INTERACTION}>Name/URL</div>
          <div className={STYLES_COLUMN_NO_INTERACTION} style={{ width: '20%' }}>
            Author
          </div>
          <div className={STYLES_COLUMN_NO_INTERACTION}>Published</div>
          <div className={STYLES_COLUMN_NO_INTERACTION} />
        </div>
        {this.props.mediaItems.map((m, i) => {
          const isSelected = this.props.media && this.props.media.mediaUrl === m.mediaUrl;
          const actionsElement =
            this.props.viewer &&
            this.props.creator &&
            this.props.viewer.userId === this.props.creator.userId ? (
              <div className={STYLES_COLUMN}>
                <span className={STYLES_ITEM} onClick={() => this.props.onMediaRemove(m)}>
                  Delete
                </span>
              </div>
            ) : (
              <div className={STYLES_COLUMN_NO_INTERACTION} />
            );

          // NOTE(jim): God help me.
          let username = null;
          let date = null;
          if (m.user) {
            username = m.user.username;
            date = m.createdTime;
          }

          if (m.extraData && m.extraData.itch && m.extraData.itch.itchUsername) {
            username = m.extraData.itch.itchUsername;
          }

          if (m.published) {
            date = m.published;
          }

          if (!username) {
            return (
              <div
                className={STYLES_ROW}
                key={`playlist-list-item-${i}`}
                onClick={() => this.props.onMediaSelect(m)}>
                <div className={STYLES_FLUID_COLUMN}>{m.mediaUrl}</div>
                {actionsElement}
              </div>
            );
          }

          return (
            <div className={STYLES_ROW} key={`media-list-item-${m.mediaId}-${i}`}>
              <div className={STYLES_FLUID_COLUMN} onClick={() => this.props.onMediaSelect(m)}>
                {m.name}
              </div>
              <div className={STYLES_COLUMN} style={{ width: '20%' }}>
                {username ? username : '-'}
              </div>
              <div className={STYLES_COLUMN_NO_INTERACTION}>
                {date ? Strings.toDate(date) : 'Unknown'}
              </div>
              {actionsElement}
            </div>
          );
        })}
      </div>
    );
  }
}
