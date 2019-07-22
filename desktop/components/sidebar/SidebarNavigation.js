import * as React from 'react';

import { css } from 'react-emotion';

import SidebarNavigationItem from '~/components/sidebar/SidebarNavigationItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarNavigation extends React.Component {
  render() {
    const { lobbyChannel, contentMode, chatChannelId } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarNavigationItem
          name="Play"
          svg="home"
          onClick={this.props.onNavigateToGames}
          active={contentMode === 'home'}
        />
        <SidebarNavigationItem
          name="Create"
          svg="make"
          onClick={this.props.onNavigateToMakeGame}
          active={contentMode === 'create'}
        />
        {lobbyChannel ? (
          <SidebarNavigationItem
            name="Chat"
            svg="chat"
            onClick={() => this.props.onNavigateToChat(lobbyChannel)}
            active={contentMode === 'chat' && chatChannelId === lobbyChannel.channelId}
            hasUnreadMessages={lobbyChannel.hasUnreadMessages}
            unreadNotificationCount={lobbyChannel.unreadNotificationCount}
          />
        ) : null}
      </div>
    );
  }
}
