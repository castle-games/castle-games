import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatMessages from '~/components/chat/ChatMessages';
import ChatInput from '~/components/chat/ChatInput';
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

class ChatSidebar extends React.Component {
  state = {
    value: '',
    mode: 'MESSAGES',
    isDarkMode: false,
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      event.preventDefault();
      if (Strings.isEmpty(this.state.value.trim())) {
        return;
      }

      this.props.chat.sendMessage(this.props.channelId, this.state.value);
      this.setState({ value: '' });
    }
  };

  _handleThemeChange = () => {
    this.setState({ isDarkMode: !this.state.isDarkMode });
  };

  _handleBack = () => {
    // TODO: instead of navigateToHome, this should call navigator.restoreDeferredState
    // in order to properly "go back".
    // but we need to actually defer the state before we can make this change.
    this.props.navigator.navigateToHome();
  };

  render() {
    const { mode } = this.state;
    const { channelId } = this.props;

    // TODO(jim): When theming is available, you can just modify this object.
    let theme = {
      textColor: Constants.colors.white,
      background: `#000000`,
      inputBackground: `#565656`,
      embedBorder: `none`,
      embedBackground: `#333`,
      embedBoxShadow: `none`,
      embedPadding: `8px 8px 8px 8px`,
    };

    if (!this.props.navigation.game) {
      return null;
    }

    if (this.props.navigation.isFullScreen) {
      return null;
    }

    if (!channelId) {
      return null;
    }
    const messages = this.props.chat.channels[channelId].messages;

    return (
      <div
        className={STYLES_CONTAINER_BASE}
        style={{
          background: theme.background,
        }}>
        <ChatSidebarHeader onBackClick={this._handleBack} onThemeClick={this._handleThemeChange} />
        <ChatMessages
          messages={messages}
          navigator={this.props.navigator}
          userIdToUser={this.props.userPresence.userIdToUser}
          theme={theme}
          size="32px"
        />
        <ChatInput
          value={this.state.value}
          name="value"
          placeholder="Type a message"
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          theme={theme}
          isSidebarGameInput
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
                      const { channelId } = chat.findChannelForGame(navigation.game);
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
                              channelId={channelId}
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
