import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatSessionContext } from '~/contexts/ChatSessionContext';

import ChatHeader from '~/components/chat/ChatHeader';
import ChatHeaderActive from '~/components/chat/ChatHeaderActive';
import ChatMessages from '~/components/chat/ChatMessages';
import ChatMembers from '~/components/chat/ChatMembers';
import ChatInput from '~/components/chat/ChatInput';
import ChatOptions from '~/components/chat/ChatOptions';

const STYLES_CONTAINER_BASE = `
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  min-width: 10%;
  height: 100vh;
  transition: 0ms ease all;
  transition-property: transform, opacity;
  background: ${Constants.colors.white};
`;

const STYLES_CONTAINER = css`
  ${STYLES_CONTAINER_BASE};
  transform: translateX(0px);
  opacity: 1;
`;

const STYLES_CONTAINER_LEAVING = css`
  ${STYLES_CONTAINER_BASE};
  opacity: 0;
  transform: translateX(24px);
`;

const STYLES_CONTAINER_ENTERING = css`
  ${STYLES_CONTAINER_BASE};
  opacity: 0;
`;

class ChatScreen extends React.Component {
  state = {
    value: '',
    mode: 'MESSAGES',
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.chat) {
      return;
    }

    if (!prevProps.chat.channel) {
      return;
    }

    if (prevProps.chat.channel.channelId !== this.props.chat.channel.channelId) {
      this.setState({ mode: 'MESSAGES' });
    }
  }

  _handleLeaveChannel = async () => {
    await ChatActions.leaveChatChannel({ channelId: this.props.chat.channel.channelId });
    this.props.social.refreshChannelData();
    this.props.navigator.navigateToHome();
  };

  _handleResetChatWindow = () => this.setState({ mode: 'MESSAGES' });

  _handleShowSingleChannelMembers = () => this.setState({ mode: 'MEMBERS' });

  _handleShowSingleChannelOptions = () => this.setState({ mode: 'OPTIONS' });

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleKeyDown = (e) => {
    if (e.which === 13) {
      this.props.chat.handleSendChannelMessage(this.state.value);
      this.setState({ value: '' });
    }
  };

  render() {
    const { mode } = this.state;

    let className = STYLES_CONTAINER;
    if (this.props.chat.animating === 3) {
      className = STYLES_CONTAINER_LEAVING;
    }

    if (this.props.chat.animating === 1) {
      className = STYLES_CONTAINER_ENTERING;
    }

    if (!this.props.chat.channel) {
      return null;
    }

    if (mode === 'OPTIONS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Settings
          </ChatHeaderActive>
          <ChatOptions onLeaveChannel={this._handleLeaveChannel} />
        </div>
      );
    }

    if (mode === 'MEMBERS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Members
          </ChatHeaderActive>
          <ChatMembers />
        </div>
      );
    }

    let messages = [];
    if (this.props.chat.channel && this.props.chat.messages[this.props.chat.channel.channelId]) {
      messages = this.props.chat.messages[this.props.chat.channel.channelId];
    }

    return (
      <div className={className}>
        <ChatHeader
          social={this.props.social}
          viewer={this.props.viewer}
          channel={this.props.chat.channel}
          onSettingsClick={this._handleShowSingleChannelOptions}
          onMembersClick={this._handleShowSingleChannelMembers}
        />
        <ChatMessages
          messages={messages}
          chat={this.props.chat}
          navigator={this.props.navigator}
          social={this.props.social}
        />
        <ChatInput
          value={this.state.value}
          name="value"
          placeholder="Type a message"
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
        />
      </div>
    );
  }
}

export default class ChatScreenWithContext extends React.Component {
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
                                  <ChatScreen
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
