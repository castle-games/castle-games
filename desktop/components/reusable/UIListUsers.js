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

export default class UIListPlaylists extends React.Component {
  render() {
    let maybeTitleRow;
    if (this.props.noTitleRow) {
      maybeTitleRow = (<div style={{ borderTop: `16px solid ${Constants.colors.border}` }} />);
    } else {
      maybeTitleRow = (
        <div className={STYLES_ROW_TITLE}>
          <div className={STYLES_ICON_COLUMN} />
          <div className={STYLES_FLUID_COLUMN_NO_INTERACTION}>User</div>
        </div>
      );
    }
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        {maybeTitleRow}
        {this.props.users.map((u, i) => {
          return (
            <div className={STYLES_ROW} key={`user-list-item-${u.userId}`}>
              <div className={STYLES_ICON_COLUMN} onClick={() => this.props.onUserSelect(u)}>
                <SVG.Profile height="16px" />
              </div>
              <div className={STYLES_FLUID_COLUMN} onClick={() => this.props.onUserSelect(u)}>
                {u.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
