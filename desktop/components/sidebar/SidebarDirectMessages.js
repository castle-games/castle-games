import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarDirectMessageItem from '~/components/sidebar/SidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

const DIRECT_MESSAGE_PREFIX = 'dm-';

export default class SidebarDirectMessages extends React.Component {
  render() {
    if (!this.props.viewer) {
      return null;
    }

    const { onlineUserIds, userIdToUser } = this.props.userPresence;
    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </SidebarGroupHeader>
        {this.props.directMessages.map((c) => {
          const isSelected =
            c.channelId === this.props.selectedChannelId && this.props.contentMode === 'chat';

          const user = userIdToUser[c.otherUserId];
          if (!user) {
            return;
          }

          const online = onlineUserIds[c.otherUserId] === true;

          return (
            <SidebarDirectMessageItem
              key={`direct-message-${c.channelId}-${c.otherUserId}`}
              channel={c}
              isSelected={isSelected}
              data={{
                name: `${Strings.getName(user)}`,
                online,
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
