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
  background: #222;
  border-bottom: 1px solid ${Constants.colors.white10};
`;

const STYLES_ROW = css`
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid ${Constants.colors.white10};
  cursor: pointer;

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_ROW_SELECTED = css`
  font-weight: 400;
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid ${Constants.colors.white10};
  cursor: pointer;
  background: ${Constants.colors.green};

  :last-child {
    border-bottom: 0;
  }
`;

const STYLES_COLUMN_FULL = css`
  flex-shrink: 0;
  width: 100%;
  padding: 12px 16px 12px 16px;
  overflow-wrap: break-word;
`;

const STYLES_COLUMN = css`
  flex-shrink: 0;
  width: 33.33%;
  padding: 12px 16px 12px 16px;
`;

const STYLES_FLUID_COLUMN = css`
  min-width: 25%;
  width: 100%;
  padding: 12px 16px 12px 16px;
`;

export default class UIListPlaylists extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <div className={STYLES_ROW_TITLE}>
          <div className={STYLES_COLUMN}>Name/URL</div>
          <div className={STYLES_COLUMN}>Author</div>
          <div className={STYLES_COLUMN}>-</div>
        </div>
        {this.props.playlistItems.map((p, i) => {
          // TODO(jim): Consolidate this when we properly have usernames
          return (
            <div className={STYLES_ROW} key={`playlist-list-item-${i}`} onClick={() => {}}>
              <div className={STYLES_COLUMN} style={{ fontWeight: 600 }}>
                {p.name}
              </div>
              <div className={STYLES_COLUMN}>-</div>
              <div className={STYLES_COLUMN}>-</div>
            </div>
          );
        })}
      </div>
    );
  }
}
