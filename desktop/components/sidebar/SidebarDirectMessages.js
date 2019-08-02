import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarMessageItem from '~/components/sidebar/SidebarMessageItem';
import UserStatus from '~/common/userstatus';

const STYLES_CONTAINER = css`
  margin-bottom: 16px;
`;

const SUGGEST_MORE_ONLINE_USERS = true;
const MIN_NUM_DIRECT_MESSAGES = 5;

export default class SidebarDirectMessages extends React.Component {
  _suggestMoreOnlineUsers = (directMessages) => {
    const { viewer } = this.props;
    const { onlineUserIds, userIdToUser } = this.props.userPresence;

    // if you haven't started any DM threads, fill the list with some online users
    let userIdsInList = {};
    directMessages.forEach((channel) => (userIdsInList[channel.otherUserId] = true));

    let onlineUserIdIndex = 0;
    let onlineUserIdsList = Object.keys(onlineUserIds);
    while (
      onlineUserIdIndex < onlineUserIdsList.length &&
      directMessages.length < MIN_NUM_DIRECT_MESSAGES
    ) {
      let userId = onlineUserIdsList[onlineUserIdIndex];
      if (!userIdsInList[userId] && viewer.userId !== userId) {
        let user = userIdToUser[userId];
        directMessages.push({
          channelId: null,
          otherUserId: userId,
          otherUserIsOnline: true,
        });
        userIdsInList[userId] = true;
      }
      onlineUserIdIndex++;
    }
  };

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

    if (SUGGEST_MORE_ONLINE_USERS && directMessages.length < MIN_NUM_DIRECT_MESSAGES) {
      this._suggestMoreOnlineUsers(directMessages);
    }

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

          let { status } = UserStatus.renderStatusText(user.lastUserStatus);

          let onClick;
          if (c.channelId) {
            onClick = () => this.props.onSelectChannel(c);
          } else {
            onClick = () => this.props.onSendMessage(user);
          }
          return (
            <SidebarMessageItem
              key={`direct-message-${ii}-${c.otherUserId}`}
              name={user.username}
              isUnread={c.hasUnreadMessages}
              notificationCount={c.unreadNotificationCount}
              isOnline={c.otherUserIsOnline}
              isSelected={isSelected}
              status={status}
              avatarUrl={user.photo ? user.photo.url : null}
              onClick={onClick}
            />
          );
        })}
      </div>
    );
  }
}
