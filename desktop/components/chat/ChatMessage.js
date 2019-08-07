import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

import ChatMessageActions from '~/components/chat/ChatMessageActions';
import ChatMessageEditElement from '~/components/chat/ChatMessageEditElement';
import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatEventElement from '~/components/chat/ChatEventElement';
import ChatRolePlayElement from '~/components/chat/ChatRolePlayElement';

const STYLES_CONTAINER = css`
  position: relative;
  :hover {
    #actions {
      display: block;
    }
  }
`;

const STYLES_CONTAINER_HOVER_BACKGROUND = css`
  :hover {
    background: #f6f6f6;
  }
`;

const STYLES_ACTIONS = css`
  display: none;
  position: absolute;
  right: 16px;
  top: -4px;
`;

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
    isEditable: false,
    messageIdToEdit: null,
    onNavigateToUserProfile: (user) => {},
    onSelectEdit: (messageIdToEdit) => {},
    onSendMessageEdit: () => {},
    onEditCancel: () => {},
  };

  _getMessageActions = () => {
    const { message, previousMessage, messageIdToEdit, isEditable } = this.props;

    if (messageIdToEdit && message.chatMessageId === messageIdToEdit) {
      // message is actively being edited, there are no further actions you can take
      return null;
    }

    if (message.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      // you can react to admin messages, but nothing else
      // TODO: reactions
      return null;
    }

    // TODO: reactions
    return { isEditable };
  };

  _renderMessage = () => {
    const { message, previousMessage, messageIdToEdit } = this.props;

    if (messageIdToEdit && message.chatMessageId === messageIdToEdit) {
      return <ChatMessageEditElement {...this.props} />;
    }

    if (message.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      return <ChatEventElement {...this.props} />;
    }

    const slashCommand = ChatUtilities.getSlashCommand(message.body);

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
  };

  render() {
    const messageElement = this._renderMessage();

    let actionsElement;
    const actions = this._getMessageActions();
    if (actions) {
      actionsElement = (
        <div id="actions" className={STYLES_ACTIONS}>
          <ChatMessageActions
            {...actions}
            onSelectEdit={() => this.props.onSelectEdit(this.props.message.chatMessageId)}
          />
        </div>
      );
    }

    let containerClass;
    if (this.props.theme && this.props.theme.background) {
      containerClass = STYLES_CONTAINER;
    } else {
      containerClass = `${STYLES_CONTAINER} ${STYLES_CONTAINER_HOVER_BACKGROUND}`;
    }

    return (
      <div className={containerClass}>
        {messageElement}
        {actionsElement}
      </div>
    );
  }
}
