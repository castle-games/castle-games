import * as React from 'react';
import * as Constants from '~/common/constants';
import * as ChatActions from '~/common/actions-chat';
import * as ChatUtilities from '~/common/chat-utilities';
import * as NativeUtil from '~/native/nativeutil';
import * as SVG from '~/components/primitives/svg';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatMessages from '~/components/chat/ChatMessages';
import ChatInputControl from '~/components/chat/ChatInputControl';
import ChatSidebarHeader from '~/components/chat/ChatSidebarHeader';

const STYLES_CONTAINER_BASE = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  min-width: 10%;
  height: 100%;
`;

// TODO(jim): When theming is available, you can just modify this object.
const THEME = {
  textColor: Constants.colors.white,
  background: 'transparent',
  anchorColor: Constants.colors.white,
  inputBackground: `#565656`,
  embedBorder: `none`,
  embedBackground: `#333`,
  embedBoxShadow: `none`,
  embedPadding: `8px 8px 8px 8px`,
  actionItemColor: Constants.colors.white,
  actionItemBackground: '#232323',
  reactionItemColor: Constants.colors.white,
  reactionItemBackground: '#232323',
  reactionItemSelectedBackground: '#230023',
  hideEvents: true, // TODO: hack,
  bylineSize: 12,
  bodySize: 11,
  bodyLineHeight: `14px`,
};

class ChatSidebar extends React.Component {
  state = {
    mode: 'MESSAGES',
    isDarkMode: false,
    isGameChatVisible: false,
  };

  componentDidMount() {
    this._update();
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  _update = (prevProps = {}, prevState = {}) => {
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
    }
  };

  _getChannelIdVisible = () => {
    if (this.state.isGameChatVisible && this.props.gameChannel) {
      return this.props.gameChannel.channelId;
    }
    if (this.props.lobbyChannel) {
      return this.props.lobbyChannel.channelId;
    }
    return null;
  };

  _handleSelectLobby = () => {
    this.setState({ isGameChatVisible: false });
  };

  _handleSelectGameChannel = () => {
    if (this.props.gameChannel) {
      this.setState({ isGameChatVisible: true });
    }
  };

  _handleSendMessage = (message) => {
    const channelId = this._getChannelIdVisible();
    if (channelId) {
      this.props.chat.sendMessage(channelId, message);
    }
  };

  _handleSelectReaction = (messageReactedTo, emojiShortName) => {
    const { chat } = this.props;
    const channelId = this._getChannelIdVisible();
    chat.toggleReaction(channelId, messageReactedTo, emojiShortName);
  };

  render() {
    const { mode } = this.state;
    const channelId = this._getChannelIdVisible();

    if (!this.props.navigation.game || !channelId) {
      return null;
    }

    if (this.props.navigation.isFullScreen) {
      return null;
    }

    const messages = this.props.chat.channels[channelId].messages;
    const name = this.props.chat.channels[channelId].name;

    return (
      <div
        className={STYLES_CONTAINER_BASE}
        style={{
          background: THEME.background,
        }}>
        <ChatSidebarHeader
          gameChannel={this.props.gameChannel}
          isLobbySelected={!this.state.isGameChatVisible}
          onSelectLobby={this._handleSelectLobby}
          onSelectGameChannel={this._handleSelectGameChannel}
        />
        <ChatMessages
          isSidebar
          viewer={this.props.viewer}
          messages={messages}
          navigator={this.props.navigator}
          userIdToUser={this.props.userPresence.userIdToUser}
          onSelectReaction={this._handleSelectReaction}
          theme={THEME}
          size="24px"
        />
        <ChatInputControl
          isSidebar
          placeholder={`Message #${name}`}
          addUsers={this.props.userPresence.addUsers}
          onSendMessage={this._handleSendMessage}
          theme={THEME}
        />
      </div>
    );
  }
}

export default class ChatSidebarWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <UserPresenceContext.Consumer>
            {(userPresence) => (
              <ChatContext.Consumer>
                {(chat) => (
                  <NavigationContext.Consumer>
                    {(navigation) => {
                      const gameChannel = chat.findChannelForGame(navigation.game);
                      const lobbyChannel = chat.findChannel(ChatUtilities.EVERYONE_CHANNEL_NAME);
                      return (
                        <NavigatorContext.Consumer>
                          {(navigator) => (
                            <ChatSidebar
                              viewer={currentUser.user}
                              currentUser={currentUser}
                              navigator={navigator}
                              navigation={navigation}
                              userPresence={userPresence}
                              chat={chat}
                              gameChannel={gameChannel}
                              lobbyChannel={lobbyChannel}
                            />
                          )}
                        </NavigatorContext.Consumer>
                      );
                    }}
                  </NavigationContext.Consumer>
                )}
              </ChatContext.Consumer>
            )}
          </UserPresenceContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
