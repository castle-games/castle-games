import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';
import UIUserStatus from '~/components/reusable/UIUserStatus';

const STYLES_USER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 16px;
`;

const STYLES_INFO = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  min-width: 10%;
  width: 100%;
  padding-left: 16px;
`;

const STYLES_NAME = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-size: 14px;
  font-weight: 600;
  margin: 4px 0;

  span {
    cursor: pointer;
  }
`;

const STYLES_USER_STATUS = css`
  font-family: ${Constants.REFACTOR_FONTS.system}:
  line-height: 20px;
  font-size: 12px;
`;

export default ({ user, isOnline, navigateToGameUrl, navigateToUserProfile }) => {
  return (
    <div className={STYLES_USER}>
      <UIAvatar
        src={user && user.photo ? user.photo.url : null}
        isOnline={isOnline}
        style={{ width: 48, height: 48 }}
        indicatorStyle={{ width: 20, height: 20, borderRadius: 10 }}
      />
      <div className={STYLES_INFO}>
        <h2
          className={STYLES_NAME}
          style={{ color: isOnline ? null : Constants.REFACTOR_COLORS.subdued }}>
          <span onClick={user ? () => navigateToUserProfile(user) : null}>
            {user && user.username ? user.username : 'Loading...'}
          </span>
        </h2>
        <div className={STYLES_USER_STATUS}>
          {user ? <UIUserStatus user={user} navigateToGameUrl={navigateToGameUrl} /> : null}
        </div>
      </div>
    </div>
  );
};
