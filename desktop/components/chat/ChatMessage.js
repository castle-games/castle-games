import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';

import ChatMessageEditElement from '~/components/chat/ChatMessageEditElement';
import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatEventElement from '~/components/chat/ChatEventElement';
import ChatRolePlayElement from '~/components/chat/ChatRolePlayElement';

export default class ChatMessage extends React.Component {
  static defaultProps = {
    message: null,
    previousMessage: null,
    user: {
      name: 'Anonymous',
      photo: {
        url: null,
      },
    },
    theme: {
      textColor: null,
    },
    size: null,
    messageIdToEdit: null,
    onNavigateToUserProfile: (user) => {},
    onSendMessageEdit: () => {},
    onEditCancel: () => {},
  };

  render() {
    const { message, previousMessage, messageIdToEdit } = this.props;

    if (message.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      return <ChatEventElement {...this.props} />;
    }

    const slashCommand = ChatUtilities.getSlashCommand(message.body);

    if (messageIdToEdit && message.chatMessageId === messageIdToEdit) {
      return <ChatMessageEditElement {...this.props} />;
    }

    if (slashCommand.isCommand && slashCommand.command === 'me') {
      return <ChatRolePlayElement {...this.props} />;
    }

    let showAuthor = true;
    if (previousMessage) {
      const prevSlashCommand = ChatUtilities.getSlashCommand(previousMessage.body);
      let timeBetween = (new Date(message.timestamp) - new Date(previousMessage.timestamp)) / 1000;
      if (
        !prevSlashCommand.isCommand &&
        previousMessage.fromUserId === message.fromUserId &&
        timeBetween < 60 * 5
      ) {
        showAuthor = false;
      }
    }

    const isEmojiMessage = ChatUtilities.isEmojiBody(message.body);
    return (
      <ChatMessageElement {...this.props} isEmojiMessage={isEmojiMessage} showAuthor={showAuthor} />
    );
  }
}
