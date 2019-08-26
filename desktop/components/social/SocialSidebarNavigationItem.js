import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_USER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  margin: 0 0 4px 0;
  padding: 4px 8px 4px 8px;
  cursor: pointer;
  user-select: none;
`;

const STYLES_NOTIFICATION = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  background: rgb(255, 0, 235);
  color: white;
  height: 14px;
  margin-top: 2px;
  padding: 0 6px 0 6px;
  border-radius: 14px;
  font-size: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0px;
`;

export default (props) => {
  const { isUnread, notificationCount, isOnline, isSelected, onClick } = props;
  const { avatarUrl, avatarElement } = props;

  let color,
    backgroundColor,
    fontWeight = '400',
    unreadCount;
  if (isSelected) {
    color = 'magenta';
    backgroundColor = '#f9f9f9';
  }
  if (isUnread && !isSelected) {
    fontWeight = '700';
    unreadCount = notificationCount;
  }

  let avatar;
  if (avatarElement) {
    avatar = avatarElement;
  } else if (avatarUrl) {
    avatar = <UIAvatar src={avatarUrl} isOnline={isOnline} />;
  }

  return (
    <div className={STYLES_USER} onClick={!isSelected ? onClick : null} style={{ backgroundColor }}>
      {avatar}
      {unreadCount ? <span className={STYLES_NOTIFICATION}>{unreadCount}</span> : null}
    </div>
  );
};
