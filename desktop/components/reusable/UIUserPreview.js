import * as React from 'react';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: flex;
  padding-top: 8px;
`;

const STYLES_INFO = css`
  margin-left: 12px;
`;

const STYLES_NAME = css`
  font-weight: 200;
  font-size: 18px;
  line-height: 1.5em;
  cursor: default;
`;

const STYLES_USERNAME = css`
  font-size: 12px;
`;

export default class UIUserPreview extends React.Component {
  render() {
    const { user } = this.props;
    const avatarSrc = (user && user.photo)
          ? user.photo.imgixUrl
          : null;
    const name = (user.name) ? user.name : user.username;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar src={avatarSrc} />
        <div className={STYLES_INFO}>
          <p className={STYLES_NAME}>{name}</p>
          <p className={STYLES_USERNAME}>{'@' + user.username}</p>
        </div>
      </div>
    );
  }
}
