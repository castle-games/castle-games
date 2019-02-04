import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_USER_CELL = css`
  display: inline-flex;
  margin-bottom: 16px;
  margin-right: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 180px;
  min-width: 100px;
  cursor: pointer;
`;

const STYLES_USER_NAME = css`
  font-size: 12px;
  margin-top: 8px;
`;

class UIUserCell extends React.Component {
  render() {
    const { user } = this.props;
    const avatarSrc = user && user.photo ? user.photo.imgixUrl : null;
    const name = user.name ? user.name : user.username;
    return (
      <div className={STYLES_USER_CELL} onClick={() => this.props.onUserSelect(this.props.user)}>
        <UIAvatar src={avatarSrc} style={{ width: 48, height: 48, borderRadius: 24 }} />
        <div className={STYLES_USER_NAME}>{name}</div>
      </div>
    );
  }
}

export default class UIUserGrid extends React.Component {
  render() {
    const { users } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {users.map((u) => {
          return <UIUserCell key={u.userId} user={u} onUserSelect={this.props.onUserSelect} />;
        })}
      </div>
    );
  }
}
