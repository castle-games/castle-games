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
  width: 100%;
`;

const STYLES_LOBBY_ICON = css`
  font-size: 20px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default class SocialSidebarNavigator extends React.Component {
  render() {
    const { chat, viewer } = this.props;
    if (!viewer) {
      return null;
    }

    const channels = chat.channels;
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

    let lobbyItem;
    try {
      let lobbyChannel,
        isLobbySelected = false,
        lobbyAvatar = null;
      lobbyChannel = chat.findChannel(ChatUtilities.EVERYONE_CHANNEL_NAME);
      if (lobbyChannel) {
        isLobbySelected = this.props.selectedChannelId === lobbyChannel.channelId;
        lobbyAvatar = <div className={STYLES_LOBBY_ICON}>🏰</div>;
        lobbyItem = (
          <SocialSidebarNavigationItem
            isUnread={lobbyChannel.hasUnreadMessages}
            notificationCount={lobbyChannel.notificationCount}
            isOnline={true}
            isSelected={isLobbySelected}
            avatarElement={lobbyAvatar}
            onClick={() => this.props.onSelectChannel(lobbyChannel)}
          />
        );
      }
    } catch (_) {}

    return (
      <div className={STYLES_CONTAINER}>
        {lobbyItem}
        {directMessages.map((c, ii) => {
          const isSelected = c.channelId === this.props.selectedChannelId;

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
