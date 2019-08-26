import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SocialSidebarNavigationItem from '~/components/social/SocialSidebarNavigationItem';

const STYLES_CONTAINER = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #e5e5e5;
  height: 100%;
`;

export default class SocialSidebarNavigator extends React.Component {
  render() {
    const { channels, viewer } = this.props;
    if (!viewer) {
      return null;
    }

    const { onlineUserIds, userIdToUser } = this.props.userPresence;
    let directMessages = [];
    Object.entries(channels).forEach(([channelId, channel]) => {
      if (channel.type === 'dm') {
        directMessages.push({
          ...channel,
          otherUserIsOnline: onlineUserIds[channel.otherUserId],
        });
      }
    });

    directMessages = ChatUtilities.sortChannels(directMessages);

    return (
      <div className={STYLES_CONTAINER}>
        {directMessages.map((c, ii) => {
          const isSelected =
            c.channelId === this.props.selectedChannelId && this.props.isChatVisible;

          const user = userIdToUser[c.otherUserId];
          if (!user) {
            return;
          }

          let onClick;
          if (c.channelId) {
            onClick = () => this.props.onSelectChannel(c);
          } else {
            onClick = () => this.props.onSendMessage(user);
          }
          return (
            <SocialSidebarNavigationItem
              key={`direct-message-${ii}-${c.otherUserId}`}
              name={user.username}
              isUnread={c.hasUnreadMessages}
              notificationCount={c.unreadNotificationCount}
              isOnline={c.otherUserIsOnline}
              isSelected={isSelected}
              avatarUrl={user.photo ? user.photo.url : null}
              onClick={onClick}
            />
          );
        })}
      </div>
    );
  }
}
