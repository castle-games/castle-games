import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';
import UIUserStatus from '~/components/reusable/UIUserStatus';

const STYLES_USER = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  padding: 8px;

  :hover {
    background: #f3f3f3;
  }
`;

const STYLES_INFO = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  min-width: 10%;
  width: 100%;
  padding: 0 8px;
`;

const STYLES_NAME = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-size: 12px;
  font-weight: 600;
  margin: 4px 0;

  span {
    cursor: pointer;
  }
`;

const STYLES_ACTIONS = css`
  flex-shrink: 0;
`;

const STYLES_ACTION = css`
  text-decoration: underline;
  color: ${Constants.REFACTOR_COLORS.text};
  cursor: pointer;
  white-space: nowrap;
`;

const STYLES_USER_STATUS = css`
  font-family: ${Constants.REFACTOR_FONTS.system}:
  line-height: 20px;
  font-size: 11px;
`;

export default ({
  user,
  isOnline,
  navigateToGameMeta,
  navigateToUserProfile,
  onSendMessage,
  theme,
}) => {
  let textColor, userDarkStyles, indicatorDarkStyles;
  if (theme && theme.textColor) {
    textColor = theme.textColor;
    userDarkStyles = css`
      :hover {
        background: #222223;
      }
    `;
    indicatorDarkStyles = { borderColor: '#222223' };
  }
  return (
    <div className={`${STYLES_USER} ${userDarkStyles}`}>
      <UIAvatar
        src={user && user.photo ? user.photo.url : null}
        isOnline={isOnline}
        isAnonymous={user && user.isAnonymous}
        style={{ width: 36, height: 36 }}
        indicatorStyle={{ width: 12, height: 12, borderRadius: 6, ...indicatorDarkStyles }}
      />
      <div className={STYLES_INFO}>
        <h2
          className={STYLES_NAME}
          style={{ color: isOnline ? textColor : Constants.REFACTOR_COLORS.subdued }}>
          <span onClick={user ? () => navigateToUserProfile(user) : null}>
            {user && user.username ? user.username : 'Loading...'}
          </span>
        </h2>
        <div className={STYLES_USER_STATUS} style={{ color: textColor }}>
          {user ? <UIUserStatus user={user} navigateToGame={navigateToGameMeta} /> : null}
        </div>
      </div>
      <div className={STYLES_ACTIONS}>
        <span
          className={STYLES_ACTION}
          onClick={() => onSendMessage(user)}
          style={{ color: textColor }}>
          <SVG.Mail style={{ width: 14, height: 14, marginRight: 4 }} />
        </span>
      </div>
    </div>
  );
};
