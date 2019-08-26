import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { EVERYONE_CHANNEL_NAME } from '~/common/chat-utilities';

import SocialSidebarNavigationItem from '~/components/social/SocialSidebarNavigationItem';
import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_AVATARS = css`
  display: inline-block;
  position: relative;
`;

export default (props) => {
  const { channel, isSelected, onClick, numMembersOnline, userPresence } = props;
  if (!channel) return null;

  let maybeAvatar = null;
  if (userPresence && numMembersOnline > 0) {
    let someUserIds = Object.keys(userPresence.onlineUserIds).filter(
      (userId) => !!userPresence.userIdToUser[userId] && !!userPresence.userIdToUser[userId].photo
    );
    if (someUserIds && someUserIds.length) {
      const selectedUserIds = someUserIds.slice(0, 4);
      const avatarSpacing = 6;
      maybeAvatar = (
        <div
          className={STYLES_AVATARS}
          style={{ height: 18 + (selectedUserIds.length - 1) * avatarSpacing }}>
          {selectedUserIds.map((userId, ii) => (
            <UIAvatar
              key={`avatar-group-${ii}`}
              src={userPresence.userIdToUser[userId].photo.url}
              isOnline={true}
              style={{ position: 'absolute', top: ii * avatarSpacing, border: '1px solid #fcfcfc' }}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <SocialSidebarNavigationItem
      {...props}
      isUnread={channel.hasUnreadMessages}
      notificationCount={channel.notificationCount}
      isOnline={true}
      isSelected={isSelected}
      avatarElement={maybeAvatar}
      onClick={onClick}
    />
  );
};
