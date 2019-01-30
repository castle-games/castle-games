import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';

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

  transition: 200ms background ease;
`;

const STYLES_COLUMN = css`
  flex-shrink: 0;
  width: 112px;
  padding: 12px 16px 12px 16px;
  overflow-wrap: break-word;
  word-wrap: break-word;

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
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
`;

export default class GameList extends React.Component {
  _handleGameUpdate = game => {
    if (this.props.onGameUpdate) {
      this.props.onGameUpdate(game);
    }
  };

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
          <div className={STYLES_FLUID_COLUMN_NO_INTERACTION}>Game Title</div>
          <div className={STYLES_COLUMN_NO_INTERACTION} style={{ width: '20%' }}>
            Author
          </div>
          <div className={STYLES_COLUMN_NO_INTERACTION}>Published</div>
          {ownerCol}
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        {maybeTitleRow}
        {this.props.gameItems
          ? this.props.gameItems.map((m, i) => {
              if (!m) {
                return null;
              }
              let maybeUpdateButton;
              if (this.props.onGameUpdate) {
                maybeUpdateButton = (
                  <span className={STYLES_ITEM} onClick={() => this._handleGameUpdate(m)}>
                    Sync
                  </span>
                );
              }
              const isSelected = this.props.game && this.props.game.url === m.url;
              const actionsElement = isOwner ? (
                <div className={STYLES_COLUMN}>
                  {maybeUpdateButton}
                </div>
              ) : null;

              let author = m && m.user && m.user.username ? m.user.username : '-';
              let date = m && m.createdTime ? m.createdTime : '-';

              if (!m.user || !m.user.username) {
                return (
                  <div
                    className={STYLES_ROW}
                    key={`playlist-list-item-${i}`}
                    style={isSelected ? { color: Constants.colors.green } : null}
                    onClick={() => this.props.onGameSelect(m, this.props.isHistory)}>
                    <div className={STYLES_ICON_COLUMN}>
                      <SVG.MediaIcon height="16px" />
                    </div>
                    <div className={STYLES_FLUID_COLUMN}>{m.url}</div>
                    {actionsElement}
                  </div>
                );
              }

              return (
                <div
                  className={STYLES_ROW}
                  key={`game-list-item-${m.gameId}-${i}`}
                  style={isSelected ? { color: Constants.colors.green } : null}>
                  <div
                    className={STYLES_ICON_COLUMN}
                    onClick={() => this.props.onGameSelect(m, this.props.isHistory)}>
                    <SVG.MediaIcon height="16px" />
                  </div>
                  <div
                    className={STYLES_FLUID_COLUMN}
                    onClick={() => this.props.onGameSelect(m, this.props.isHistory)}>
                    {m.name}
                  </div>
                  <div
                    className={STYLES_COLUMN}
                    style={{ width: '20%' }}
                    onClick={() => this.props.onUserSelect(m.user)}>
                    {author}
                  </div>
                  <div className={STYLES_COLUMN_NO_INTERACTION}>
                    {date ? Strings.toDate(date) : 'Unknown'}
                  </div>
                  {actionsElement}
                </div>
              );
            })
          : null}
      </div>
    );
  }
}
