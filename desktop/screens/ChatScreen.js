import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import regexMatch from 'react-string-replace';
import ChatHeader from '~/components/chat/ChatHeader';
import ChatHeaderActive from '~/components/chat/ChatHeaderActive';
import ChatMessages from '~/components/chat/ChatMessages';
import ChatMembers from '~/components/chat/ChatMembers';
import ChatInput from '~/components/chat/ChatInput';
import ChatOptions from '~/components/chat/ChatOptions';

const DIRECT_MESSAGE_PREFIX = 'dm-';

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
  _timeout;

  state = {
    value: '',
    users: [],
    mode: 'MESSAGES',
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.chat) {
      return;
    }

    if (!prevProps.channelId) {
      return;
    }

    if (prevProps.channelId !== this.props.channelId) {
      this.setState({ mode: 'MESSAGES' });
    }
  }

  componentWillUnmount() {
    this.clear();
  }

  clear = () => {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  };

  _handleLeaveChannel = async () => {
    await ChatActions.leaveChatChannel({ channelId: this.props.chat.channelId });
    this.props.chat.refreshChannelData();
    this.props.navigator.navigateToHome();
  };

  _handleResetChatWindow = () => this.setState({ mode: 'MESSAGES' });

  _handleShowSingleChannelMembers = () => this.setState({ mode: 'MEMBERS' });

  _handleShowSingleChannelOptions = () => this.setState({ mode: 'OPTIONS' });

  _handleForceChange = (valueState) => {
    this.setState(valueState);
  };

  _handleChange = (e) => {
    const value = e.target.value;
    this.setState({ [e.target.name]: value }, () => {
      window.clearTimeout(this._timeout);
      this._timeout = null;

      let found = false;
      regexMatch(value, /([@][\w_-]+)$/g, (match, i) => {
        if (!found) {
          this._handleSearch(match);
          found = true;
          return;
        }

        return match;
      });

      if (!found) {
        return this.setState({ users: [] });
      }
    });
  };

  _handleSearch = (value) => {
    this._timeout = window.setTimeout(async () => {
      let users = [];

      let autocompleteResults = await Actions.getAutocompleteAsync(value);
      if (autocompleteResults.users) {
        users = autocompleteResults.users;
      }

      this.props.userPresence.addUsers(users);

      this.setState({ users: users });
    }, 120);
  };

  _handleKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      event.preventDefault();

      if (Strings.isEmpty(this.state.value.trim())) {
        return;
      }

      let user;
      const channel = this.props.chat.channels[this.props.channelId];
      // TODO: check type
      if (this.props.channelId.startsWith(DIRECT_MESSAGE_PREFIX)) {
        const channelUserIds = this.props.channelId.replace(DIRECT_MESSAGE_PREFIX, '').split(',');
        const otherUserId = channelUserIds.find((id) => id !== this.props.viewer.userId);
        user = this.props.userPresence.userIdToUser[otherUserId];
      }

      this.props.chat.sendMessage(this.state.value, user);
      this.clear();
      this.setState({ value: '', users: [] });
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

    if (!this.props.channelId) {
      return null;
    }

    const channel = this.props.chat.channels[this.props.channelId];

    if (mode === 'OPTIONS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Settings
          </ChatHeaderActive>
          <ChatOptions onLeaveChannel={this._handleLeaveChannel} channel={channel} />
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

    let messages = this.props.chat.channels[this.props.channelId].messages;

    return (
      <div className={className}>
        <ChatHeader
          userIdToUser={this.props.userPresence.userIdToUser}
          viewer={this.props.viewer}
          channel={channel}
          onSettingsClick={this._handleShowSingleChannelOptions}
          onMembersClick={this._handleShowSingleChannelMembers}
        />
        <ChatMessages
          messages={messages}
          chat={this.props.chat}
          navigator={this.props.navigator}
          userPresence={this.props.userPresence}
        />
        <ChatInput
          value={this.state.value}
          name="value"
          users={this.state.users}
          placeholder="Type a message"
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          onForceChange={this._handleForceChange}
        />
      </div>
    );
  }
}

export default class ChatScreenWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <UserPresenceContext.Consumer>
            {(userPresence) => (
              <ChatContext.Consumer>
                {(chat) => (
                  <NavigationContext.Consumer>
                    {(navigation) => (
                      <NavigatorContext.Consumer>
                        {(navigator) => (
                          <ChatScreen
                            viewer={currentUser.user}
                            currentUser={currentUser}
                            navigator={navigator}
                            channelId={navigation.chatChannelId}
                            userPresence={userPresence}
                            chat={chat}
                          />
                        )}
                      </NavigatorContext.Consumer>
                    )}
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
