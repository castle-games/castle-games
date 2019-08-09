import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

import ChatEventElement from '~/components/chat/ChatEventElement';
import ChatMessageActions from '~/components/chat/ChatMessageActions';
import ChatMessageEditElement from '~/components/chat/ChatMessageEditElement';
import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatRolePlayElement from '~/components/chat/ChatRolePlayElement';
import UIBoundary from '~/components/reusable/UIBoundary';
import UIEmojiPicker from '~/components/reusable/UIEmojiPicker';

const STYLES_CONTAINER = css`
  position: relative;
  :hover {
    #actions {
      display: flex;
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
    enableHoverActions: true,
    onNavigateToUserProfile: (user) => {},
    onSelectEdit: (messageIdToEdit) => {},
    onSelectReaction: (messageReactedTo, emoji) => {},
    onSendMessageEdit: () => {},
    onEditCancel: () => {},
  };

  state = {
    isShowingEmojiPicker: false,
  };

  _handleToggleEmojiPicker = () => {
    this.setState({
      isShowingEmojiPicker: !this.state.isShowingEmojiPicker,
    });
  };

  _handleSelectEmoji = (emoji) => {
    this.props.onSelectReaction(this.props.message, emoji);
    this.setState({ isShowingEmojiPicker: false });
  };

  _getMessageActions = () => {
    const { message, previousMessage, messageIdToEdit, isEditable } = this.props;

    if (messageIdToEdit && message.chatMessageId === messageIdToEdit) {
      // message is actively being edited, there are no further actions you can take
      return null;
    }

    if (message.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      // you can react to admin messages, but nothing else
      return { isReactable: true };
    }

    return { isEditable, isReactable: true };
  };

  _renderEmojiPicker = () => {
    if (this.state.isShowingEmojiPicker) {
      return (
        <UIBoundary
          enabled={true}
          captureResize={false}
          captureScroll={false}
          onOutsideRectEvent={this._handleToggleEmojiPicker}>
          <UIEmojiPicker onSelectEmoji={this._handleSelectEmoji} />
        </UIBoundary>
      );
    }
    return null;
  };

  _renderMessage = () => {
    const { message, previousMessage, messageIdToEdit } = this.props;

    const props = {
      ...this.props,
      onSelectReaction: this._handleSelectEmoji,
    };

    if (messageIdToEdit && message.chatMessageId === messageIdToEdit) {
      return <ChatMessageEditElement {...props} />;
    }

    if (message.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      return <ChatEventElement {...props} />;
    }

    const slashCommand = ChatUtilities.getSlashCommand(message.body);

    if (slashCommand.isCommand && slashCommand.command === 'me') {
      return <ChatRolePlayElement {...props} />;
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

    props.isEmojiMessage = ChatUtilities.isEmojiBody(message.body);
    props.showAuthor = showAuthor;
    return <ChatMessageElement {...props} />;
  };

  render() {
    const messageElement = this._renderMessage();

    let actionsElement;
    const actions = this._getMessageActions();
    if (actions && this.props.enableHoverActions) {
      const { message } = this.props;
      actionsElement = (
        <div id="actions" className={STYLES_ACTIONS}>
          <ChatMessageActions
            {...actions}
            theme={this.props.theme}
            onSelectEdit={() => this.props.onSelectEdit(message.chatMessageId)}
            onSelectReaction={this._handleToggleEmojiPicker}
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
        {this._renderEmojiPicker()}
      </div>
    );
  }
}
