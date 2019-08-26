import * as React from 'react';
import * as Constants from '~/common/constants';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

import { NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatChannel from '~/components/chat/ChatChannel';
import SocialSidebarNavigator from '~/components/social/SocialSidebarNavigator';
import SidebarHeader from '~/components/sidebar/SidebarHeader';

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
`;

const STYLES_CHANNEL_NAVIGATOR = css`
  width: 15%;
  flex-shrink: 0;
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
    const { lobbyChannel } = this.props;
    return lobbyChannel ? lobbyChannel.channelId : null;
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

    /* TODO: BEN: messages props
       onSelectChannel={this._handleNavigateToChat}
       onSendMessage={this._handleCreateDirectMessage}
    */

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarHeader viewer={viewer} navigator={navigator} />
        <div className={STYLES_SIDEBAR_BODY}>
          <div className={STYLES_CHANNEL_NAVIGATOR}>
            <SocialSidebarNavigator
              selectedChannelId={channelId}
              viewer={viewer}
              userPresence={userPresence}
              channels={chat.channels}
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
                  <NavigationContext.Consumer>
                    {(navigation) => {
                      const lobbyChannel = chat.findChannel(ChatUtilities.EVERYONE_CHANNEL_NAME);
                      return (
                        <SocialSidebar
                          userPresence={userPresence}
                          viewer={currentUser.user}
                          navigation={navigation}
                          chat={chat}
                          lobbyChannel={lobbyChannel}
                        />
                      );
                    }}
                  </NavigationContext.Consumer>
                )}
              </UserPresenceContext.Consumer>
            )}
          </ChatContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
