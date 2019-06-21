import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatSessionContext } from '~/contexts/ChatSessionContext';

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

  async componentDidUpdate(prevProps) {
    if (prevProps.navigation.game.title !== this.props.navigation.game.title) {
      await this._handleJoinGameChannel();
    }
  }

  async componentDidMount() {
    await this._handleJoinGameChannel();
  }

  _handleJoinGameChannel = async () => {
    if (!this.props.navigation.game) {
      return;
    }

    const response = await ChatActions.createChatChannel({
      name: this.props.navigation.game.title,
    });

    await this.props.social.refreshChannelData();

    if (!response || response.errors) {
      const error = response.errors[0];
      if (error) {
        if (error.extensions && error.extensions.code === 'CHANNEL_NAME_ALREADY_EXISTS') {
          const channel = this.props.social.allChatChannels.find((c) => {
            return c.name === this.props.navigation.game.title;
          });

          if (channel) {
            await this.props.chat.handleConnectGameContext(channel);
          }
        }
      }
      return;
    }

    if (response.data && response.data.createChatChannel) {
      this.props.chat.handleConnectGameContext(response.data.createChatChannel);
    }
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

      this.props.chat.handleSendChannelMessage(this.state.value);
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

    let theme = {
      textColor: Constants.colors.white,
      background: `#000000`,
      inputBackground: `#565656`,
    };

    // TODO(jim): Will need to do a design system with
    // dark and light mode for everything. And change
    // arbitrary color uses like `#AAA` for the splitter.
    if (!this.state.isDarkMode) {
      theme = {
        textColor: null,
        background: Constants.colors.white,
        inputBackground: `#f3f3f3`,
      };
    }

    if (!this.props.navigation.game) {
      return null;
    }

    if (this.props.navigation.isFullScreen) {
      return null;
    }

    if (!this.props.chat.channel) {
      return null;
    }

    let messages = [];
    if (this.props.chat.channel && this.props.chat.messages[this.props.chat.channel.channelId]) {
      messages = this.props.chat.messages[this.props.chat.channel.channelId];
    }

    return (
      <div
        className={STYLES_CONTAINER_BASE}
        style={{
          background: theme.background,
        }}>
        <ChatSidebarHeader
          chat={this.props.chat}
          onBackClick={this._handleBack}
          onThemeClick={this._handleThemeChange}
        />
        <ChatMessages
          messages={messages}
          chat={this.props.chat}
          navigator={this.props.navigator}
          social={this.props.social}
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
        {(currentUser) => {
          return (
            <SocialContext.Consumer>
              {(social) => {
                return (
                  <ChatSessionContext.Consumer>
                    {(chat) => {
                      return (
                        <NavigationContext.Consumer>
                          {(navigation) => {
                            return (
                              <NavigatorContext.Consumer>
                                {(navigator) => (
                                  <ChatSidebar
                                    viewer={currentUser.user}
                                    currentUser={currentUser}
                                    navigator={navigator}
                                    navigation={navigation}
                                    social={social}
                                    chat={chat}
                                  />
                                )}
                              </NavigatorContext.Consumer>
                            );
                          }}
                        </NavigationContext.Consumer>
                      );
                    }}
                  </ChatSessionContext.Consumer>
                );
              }}
            </SocialContext.Consumer>
          );
        }}
      </CurrentUserContext.Consumer>
    );
  }
}
