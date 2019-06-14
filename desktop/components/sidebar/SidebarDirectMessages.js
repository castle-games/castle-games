import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarDirectMessageItem from '~/components/sidebar/SidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarDirectMessages extends React.Component {
  render() {
    if (!this.props.viewer) {
      return null;
    }

    const { onlineUserIds, userIdToUser } = this.props.social;
    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </SidebarGroupHeader>
        {this.props.directMessages.map((c) => {
          const active =
            c.channelId === this.props.selectedChannelId && this.props.contentMode === 'chat';

          const user = userIdToUser[c.otherUserId];
          if (!user) {
            return;
          }

          const online = onlineUserIds[c.otherUserId] === true;

          return (
            <SidebarDirectMessageItem
              key={`direct-message-${c.channelId}-${c.otherUserId}`}
              data={{
                name: `${Strings.getName(user)}`,
                channelId: c.channelId,
                active,
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
