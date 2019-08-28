import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { Tooltip } from 'react-tippy';

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

const TOOLTIP_PROPS = {
  arrow: true,
  duration: 170,
  animation: 'fade',
  hideOnClick: false,
  position: 'left',
};

export default class SocialSidebarNavigator extends React.Component {
  state = {
    game: null,
  };

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  componentDidMount() {
    this._update(null, null);
  }

  _update = async (prevProps, prevState) => {
    // TODO: put this game fetch inside navigation context and merge w meta screen
    const { chat, gameMetaChannelId } = this.props;
    if (!prevProps || prevProps.gameMetaChannelId !== gameMetaChannelId) {
      if (this.state.game) {
        await this.setState({ game: null });
      }
      if (gameMetaChannelId) {
        const channel = chat.channels[gameMetaChannelId];
        if (channel.type === 'game' && channel.gameId) {
          try {
            let game = await Actions.getGameByGameId(channel.gameId);
            this.setState({ game });
          } catch (_) {}
        }
      }
    }
  };

  _renderGameItem = () => {
    const { chat, gameMetaChannelId, isChatExpanded, selectedChannelId } = this.props;
    let gameItem = null;
    if (gameMetaChannelId) {
      let iconSrc;
      const channel = chat.channels[gameMetaChannelId];
      const { game } = this.state;
      if (game && game.coverImage) {
        iconSrc = game.coverImage.url;
      }
      const isGameSelected = isChatExpanded && selectedChannelId === channel.channelId;
      const title = channel.name ? channel.name : 'Untitled Game Chat';
      gameItem = (
        <Tooltip title={title} {...TOOLTIP_PROPS}>
          <SocialSidebarNavigationItem
            isUnread={channel.hasUnreadMessages}
            notificationCount={channel.notificationCount}
            isSelected={isGameSelected}
            avatarUrl={iconSrc}
            showOnlineIndicator={false}
            onClick={() => this.props.onSelectChannel(channel)}
          />
        </Tooltip>
      );
    }
    return gameItem;
  };

  _renderLobbyItem = () => {
    const { chat, isChatExpanded, selectedChannelId } = this.props;
    let lobbyItem = null;
    try {
      let lobbyChannel,
        isLobbySelected = false,
        lobbyAvatar = null;
      lobbyChannel = chat.findChannel(ChatUtilities.EVERYONE_CHANNEL_NAME);
      if (lobbyChannel) {
        isLobbySelected = isChatExpanded && selectedChannelId === lobbyChannel.channelId;
        lobbyAvatar = <div className={STYLES_LOBBY_ICON}>🏰</div>;
        lobbyItem = (
          <Tooltip title="Community Chat" {...TOOLTIP_PROPS}>
            <SocialSidebarNavigationItem
              isUnread={lobbyChannel.hasUnreadMessages}
              notificationCount={lobbyChannel.notificationCount}
              isOnline={true}
              isSelected={isLobbySelected}
              avatarElement={lobbyAvatar}
              onClick={() => this.props.onSelectChannel(lobbyChannel)}
            />
          </Tooltip>
        );
      }
    } catch (_) {}
    return lobbyItem;
  };

  render() {
    const { chat, viewer, isChatExpanded, selectedChannelId, gameMetaChannelId } = this.props;
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

    return (
      <div className={STYLES_CONTAINER}>
        {this._renderGameItem()}
        {this._renderLobbyItem()}
        {directMessages.map((c, ii) => {
          const isSelected = isChatExpanded && c.channelId === selectedChannelId;

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
            <Tooltip
              title={c.name}
              {...TOOLTIP_PROPS}
              key={`direct-message-${ii}-${c.otherUserId}`}>
              <SocialSidebarNavigationItem
                name={user.username}
                isUnread={c.hasUnreadMessages}
                notificationCount={c.unreadNotificationCount}
                isOnline={c.otherUserIsOnline}
                isSelected={isSelected}
                avatarUrl={user.photo ? user.photo.url : null}
                onClick={onClick}
              />
            </Tooltip>
          );
        })}
      </div>
    );
  }
}
