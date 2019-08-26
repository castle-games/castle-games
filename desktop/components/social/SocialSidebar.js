import * as React from 'react';
import * as Constants from '~/common/constants';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatChannel from '~/components/chat/ChatChannel';
import SidebarHeader from '~/components/sidebar/SidebarHeader';
import SocialSidebarGroupItem from '~/components/social/SocialSidebarGroupItem';
import SocialSidebarNavigator from '~/components/social/SocialSidebarNavigator';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  width: ${Constants.sidebar.width};
  min-width: 10%;
  height: 100%;
`;

const STYLES_SIDEBAR_BODY = css`
  display: flex;
  width: 100%;
  height: 100%;
`;

const STYLES_CHANNEL_NAVIGATOR = css`
  width: 15%;
  flex-shrink: 0;
  height: 100%;
`;

const STYLES_CHANNEL = css`
  width: 85%;
  display: flex;
  flex-direction: column;
`;

class SocialSidebar extends React.Component {
  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  _update = (prevProps = {}, prevState = {}) => {
    /*  TODO: BEN: mark channel read logic
       const { chat, gameChannel, lobbyChannel } = this.props;
    let prevChannelId = prevProps.gameChannel ? prevProps.gameChannel.channelId : null;
    let channelId = gameChannel ? gameChannel.channelId : null;
    if (prevChannelId !== channelId) {
      this.setState({ isGameChatVisible: channelId !== null });
    }

    if (chat && lobbyChannel) {
      let channelIdVisible = this.state.isGameChatVisible ? channelId : lobbyChannel.channelId;
      let prevChannelIdVisible = prevState.isGameChatVisible
        ? prevChannelId
        : lobbyChannel.channelId;
      if (channelIdVisible !== prevChannelIdVisible) {
        chat.markChannelRead(channelIdVisible);
      }
    } */
  };

  _getChannelIdVisible = () => {
    const navigatorChannelId = this.props.chatChannelId;
    if (navigatorChannelId) {
      return navigatorChannelId;
    } else {
      const { lobbyChannel } = this.props;
      return lobbyChannel ? lobbyChannel.channelId : null;
    }
  };

  _handleNavigateToChat = async (channel) => {
    this.props.navigator.showChatChannel(channel.channelId);
  };

  render() {
    const { chat, viewer, userPresence } = this.props;
    const channelId = this._getChannelIdVisible();

    if (!viewer) {
      return null;
    }

    /* TODO: BEN: header props
       onShowOptions={this._handleShowOptions}
       onSignIn={this._handleSignIn}
       onSignOut={this._handleSignOut} */

    let lobbyChannel,
      isLobbySelected = false,
      numUsersOnline = 0;
    try {
      lobbyChannel = chat.findChannel(ChatUtilities.EVERYONE_CHANNEL_NAME);
      if (lobbyChannel) {
        isLobbySelected = channelId === lobbyChannel.channelId;
        numUsersOnline = chat.channelOnlineCounts[lobbyChannel.channelId];
      }
    } catch (_) {}

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarHeader viewer={viewer} navigator={navigator} />
        <div className={STYLES_SIDEBAR_BODY}>
          <div className={STYLES_CHANNEL_NAVIGATOR}>
            <SocialSidebarGroupItem
              numMembersOnline={numUsersOnline}
              channel={lobbyChannel}
              userPresence={userPresence}
              isSelected={isLobbySelected}
              onClick={() => this._handleNavigateToChat(lobbyChannel)}
            />
            <SocialSidebarNavigator
              selectedChannelId={channelId}
              viewer={viewer}
              userPresence={userPresence}
              channels={chat.channels}
              onSelectChannel={this._handleNavigateToChat}
            />
          </div>
          <div className={STYLES_CHANNEL}>
            {channelId && (
              <ChatChannel isSidebar chat={this.props.chat} channelId={channelId} size="24px" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default class SocialSidebarWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <ChatContext.Consumer>
            {(chat) => (
              <UserPresenceContext.Consumer>
                {(userPresence) => (
                  <NavigatorContext.Consumer>
                    {(navigator) => (
                      <NavigationContext.Consumer>
                        {(navigation) => {
                          const lobbyChannel = chat.findChannel(
                            ChatUtilities.EVERYONE_CHANNEL_NAME
                          );
                          return (
                            <SocialSidebar
                              userPresence={userPresence}
                              viewer={currentUser.user}
                              chatChannelId={navigation.chatChannelId}
                              chat={chat}
                              lobbyChannel={lobbyChannel}
                              navigator={navigator}
                            />
                          );
                        }}
                      </NavigationContext.Consumer>
                    )}
                  </NavigatorContext.Consumer>
                )}
              </UserPresenceContext.Consumer>
            )}
          </ChatContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
