import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';
import * as Emojis from '~/common/emojis';
import * as NativeUtil from '~/native/nativeutil';
import * as Actions from '~/common/actions';
import * as ChatActions from '~/common/actions-chat';

import { css } from 'react-emotion';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import regexMatch from 'react-string-replace';
import ChatHeader from '~/components/chat/ChatHeader';
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
    autocomplete: {
      type: null,
    },
    mode: 'MESSAGES',
  };

  constructor(props) {
    super(props);
    this._update(null, null);
  }

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  _update = (prevProps, prevState) => {
    const { chat, channelId } = this.props;
    if (chat) {
      chat.markChannelRead(channelId);
    }
    if (prevProps && prevProps.channelId !== channelId) {
      this.setState({ mode: 'MESSAGES' });
    }
  };

  componentWillUnmount() {
    this.clear();
  }

  clear = () => {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  };

  _handleSelectChannelName = () => {
    const channel = this.props.chat.channels[this.props.channelId];
    if (channel.type === 'dm') {
      const user = this.props.userPresence.userIdToUser[channel.otherUserId];
      if (user) {
        this.props.navigator.navigateToUserProfile(user);
      }
    }
  };

  _handleLeaveChannel = async () => {
    this.props.chat.closeChannel(this.props.channelId);
    this.props.navigator.navigateToHome();
  };

  _handleResetChatWindow = () => this.setState({ mode: 'MESSAGES' });

  _handleShowSingleChannelMembers = () => this.setState({ mode: 'MEMBERS' });

  _handleForceChange = (valueState) => {
    this.setState(valueState);
  };

  _handleChange = (e) => {
    const value = e.target.value;
    this.setState({ [e.target.name]: value }, () => {
      let autocompleteType, query;
      regexMatch(value, /([@][\w_-]+)$/g, (match, i) => {
        if (!autocompleteType) {
          autocompleteType = 'users';
          query = match;
        }
        return match;
      });
      regexMatch(value, /[:]([\w_\-\+]+)$/g, (match, i) => {
        if (!autocompleteType) {
          autocompleteType = 'emoji';
          query = match;
        }
        return match;
      });

      if (autocompleteType) {
        this._handleSearch(query, autocompleteType);
      } else {
        window.clearTimeout(this._timeout);
        this._timeout = null;
        return this.setState({
          autocomplete: {
            type: null,
          },
        });
      }
    });
  };

  _handleSearch = (value, type) => {
    let callback,
      isNetworkRequest = false;
    if (type === 'users') {
      isNetworkRequest = true;
      callback = async () => {
        let users = [];
        let autocompleteResults = await ChatActions.getAutocompleteAsync(value, ['users']);
        if (autocompleteResults.users) {
          users = autocompleteResults.users;
        }
        this.props.userPresence.addUsers(users);
        this.setState({
          autocomplete: {
            type: 'users',
            users,
          },
        });
      };
    } else if (type === 'emoji') {
      callback = () => {
        let emoji = Emojis.autocompleteShortNames(value);
        this.setState({
          autocomplete: {
            type: 'emoji',
            emoji,
          },
        });
      };
    }
    window.clearTimeout(this._timeout);
    this._timeout = null;
    if (isNetworkRequest) {
      this._timeout = window.setTimeout(callback, 200);
    } else {
      callback();
    }
  };

  _handleKeyDown = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      event.preventDefault();

      if (Strings.isEmpty(this.state.value.trim())) {
        return;
      }
      this.props.chat.sendMessage(this.props.channelId, this.state.value);
      this.clear();
      this.setState({ value: '', autocomplete: { type: null } });
    }
  };

  render() {
    const { mode } = this.state;
    const { userPresence } = this.props;

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
    let onLeaveChannel, numChannelMembers;
    if (!(channel.name === 'lobby' && channel.type === 'public')) {
      // caint leave the lobby
      onLeaveChannel = this._handleLeaveChannel;
    }
    if (channel.type !== 'dm') {
      // don't show online counts for a 2 person dm thread
      numChannelMembers = this.props.chat.channelOnlineCounts[this.props.channelId];
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

    return (
      <div className={className}>
        <ChatHeader
          channel={channel}
          numChannelMembers={numChannelMembers}
          onSelectGame={this.props.navigator.navigateToGame}
          onSelectChannelName={this._handleSelectChannelName}
          onLeaveChannel={onLeaveChannel}
          onMembersClick={this._handleShowSingleChannelMembers}
        />
        <ChatMessages
          messages={channel.messages}
          navigator={this.props.navigator}
          userIdToUser={userPresence.userIdToUser}
        />
        <ChatInput
          value={this.state.value}
          name="value"
          autocomplete={this.state.autocomplete}
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
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <ChatContext.Consumer>
            {(chat) => (
              <NavigationContext.Consumer>
                {(navigation) => (
                  <NavigatorContext.Consumer>
                    {(navigator) => (
                      <ChatScreen
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
    );
  }
}
