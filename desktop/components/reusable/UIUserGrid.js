import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
  max-width: 960px;
  margin: 24px 0 0 24px;
`;

const STYLES_ITEM = css`
  width: ${Constants.card.width};
  margin: 0 16px 16px 0;
  background-color: ${Constants.colors.backgroundNavigation};
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const STYLES_AVATAR = css`
  width: 90px;
  height: 90px;
  background-size: cover;
  background-position: 50% 50%;
  border-radius: 4px;
  cursor: pointer;
`;

const STYLES_USER_NAME = css`
  font-family: ${Constants.font.system};
  color: ${Constants.colors.white};
  font-weight: 700;
  margin-top: 8px;
  cursor: pointer;
`;

const STYLES_USER_USERNAME = css`
  color: ${Constants.colors.white};
  text-transform: uppercase;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 11px;
  line-height: ${Constants.linescale.lvl6};
  cursor: pointer;
`;

export default class UIUserGrid extends React.Component {
  render() {
    const { users } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {users.map((u) => {
          return (
            <div key={u.userId} className={STYLES_ITEM}>
              <div
                className={STYLES_AVATAR}
                onClick={() => this.props.onUserSelect(u)}
                style={{
                  backgroundImage: u.photo && u.photo.url ? `url(${u.photo.url})` : null,
                }}
              />
              <div className={STYLES_USER_NAME} onClick={() => this.props.onUserSelect(u)}>
                {u.name}
              </div>
              <div className={STYLES_USER_USERNAME} onClick={() => this.props.onUserSelect(u)}>
                @{u.username}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
