import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatInputControl from '~/components/chat/ChatInputControl';
import ChatMessages from '~/components/chat/ChatMessages';

class ChatChannel extends React.Component {
  _inputRef;

  static defaultProps = {
    channel: null,
  };

  state = {
    messageIdToEdit: null,
  };

  _handleSelectEdit = (messageIdToEdit = null) => {
    const { chat, channelId, viewer } = this.props;
    const messages = chat.channels[channelId].messages;
    if (messages && viewer) {
      if (!messageIdToEdit) {
        // select the most recent message belonging to the viewer
        for (let ii = messages.length - 1; ii >= 0; ii--) {
          const m = messages[ii];
          if (m.fromUserId === viewer.userId) {
            messageIdToEdit = m.chatMessageId;
            break;
          }
        }
      }
      if (messageIdToEdit) {
        return this.setState({ messageIdToEdit });
      }
    }
  };

  _handleSelectReaction = (messageReactedTo, emojiShortName) => {
    const { chat, channelId } = this.props;
    chat.toggleReaction(channelId, messageReactedTo, emojiShortName);
  };

  _handleSendMessageEdit = async (chatMessageToEdit, message) => {
    const { messageIdToEdit } = this.state;
    if (messageIdToEdit && chatMessageToEdit.chatMessageId === messageIdToEdit) {
      await this._handleEditCancel();
      this.props.chat.sendMessage(this.props.channelId, message, chatMessageToEdit);
    }
  };

  _handleEditCancel = async () => {
    await this.setState({ messageIdToEdit: null });
    if (this._inputRef) {
      this._inputRef.focus();
    }
  };

  _handleSendMessage = (message) => {
    this.props.chat.sendMessage(this.props.channelId, message);
  };

  _isEditAvailable = () => {
    const { messageIdToEdit } = this.state;
    const { chat, channelId, viewer, isSidebar } = this.props;
    const channel = chat.channels[channelId];
    return (
      !messageIdToEdit &&
      viewer &&
      channel.messages &&
      channel.messages.some((message) => message.fromUserId === viewer.userId)
    );
  };

  render() {
    const { chat, channelId, navigator, userPresence, viewer } = this.props;
    const channel = chat.channels[channelId];

    // hack
    let name = channel.name;
    if (name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
      name = 'everyone';
    }

    return (
      <React.Fragment>
        <ChatMessages
          isSidebar={this.props.isSidebar}
          theme={this.props.theme}
          size={this.props.size}
          viewer={viewer}
          messages={channel.messages}
          navigator={navigator}
          userIdToUser={userPresence.userIdToUser}
          onSelectEdit={this._handleSelectEdit}
          onSelectReaction={this._handleSelectReaction}
          messageIdToEdit={this.state.messageIdToEdit}
          onSendMessageEdit={this._handleSendMessageEdit}
          onEditCancel={this._handleEditCancel}
        />
        <ChatInputControl
          ref={(c) => (this._inputRef = c)}
          isSidebar={this.props.isSidebar}
          theme={this.props.theme}
          placeholder={`Message ${name}`}
          addUsers={userPresence.addUsers}
          onSendMessage={this._handleSendMessage}
          isEditAvailable={this._isEditAvailable()}
          onSelectEdit={this._handleSelectEdit}
        />
      </React.Fragment>
    );
  }
}

export default class ChatChannelWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <UserPresenceContext.Consumer>
            {(userPresence) => (
              <NavigatorContext.Consumer>
                {(navigator) => (
                  <ChatChannel
                    navigator={navigator}
                    userPresence={userPresence}
                    viewer={currentUser.user}
                    {...this.props}
                  />
                )}
              </NavigatorContext.Consumer>
            )}
          </UserPresenceContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
