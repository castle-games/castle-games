import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarDirectMessageItem from '~/components/sidebar/SidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

const DIRECT_MESSAGE_PREFIX = 'dm-';

export default class SidebarDirectMessages extends React.Component {
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
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </SidebarGroupHeader>
        {directMessages.map((c) => {
          const isSelected =
            c.channelId === this.props.selectedChannelId && this.props.contentMode === 'chat';

          const user = userIdToUser[c.otherUserId];
          if (!user) {
            return;
          }

          return (
            <SidebarDirectMessageItem
              key={`direct-message-${c.channelId}-${c.otherUserId}`}
              channel={c}
              isSelected={isSelected}
              data={{
                name: `${Strings.getName(user)}`,
              }}
              user={user}
              onClick={() => this.props.onSelectChannel(c)}
            />
          );
        })}
      </div>
    );
  }
}
