import ReactDOM from 'react-dom';

import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import ChatMessage from '~/components/chat/ChatMessage';

const STYLES_CONTAINER = css`
  height: 100%;
  min-height: 25%;
  width: 100%;
  overflow-y: scroll;
  overflow-wrap: break-word;
  padding-top: 16px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_BOTTOM = css`
  height: 16px;
`;

const STYLES_DATELINE = css`
  width: 100%;
  font-family: ${Constants.REFACTOR_FONTS.system};
  color: ${Constants.REFACTOR_COLORS.subdued};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  text-align: center;
  border-bottom: 1px solid #ececec;
  margin: 16px 0 16px 0;
  padding-bottom: 8px;
  cursor: default;
`;

export default class ChatMessages extends React.Component {
  static defaultProps = {
    messages: [],
    theme: {
      textColor: Constants.REFACTOR_COLORS.text,
    },
    messageIdToEdit: null,
  };

  _container;
  _containerBottom;

  componentDidUpdate(prevProps) {
    const isBottom =
      this._container.scrollHeight - this._container.scrollTop === this._container.clientHeight;
    const hasMoreMessages = prevProps.messages.length < this.props.messages.length;

    if (isBottom && hasMoreMessages) {
      this.scroll();
    }
  }

  componentDidMount() {
    this.scroll();
  }

  scroll = () => {
    window.setTimeout(() => {
      if (this._containerBottom) {
        this._containerBottom.scrollIntoView(false);
      }
    });
  };

  _renderDateline = (m, previousMessage, i) => {
    if (previousMessage) {
      const date = new Date(m.timestamp);
      const prevDate = new Date(previousMessage.timestamp);
      if (date.getDate() === prevDate.getDate()) {
        // no dateline needed
        return null;
      }
    }
    return (
      <div className={STYLES_DATELINE} key={`dateline-${m.chatMessageId}`}>
        {Strings.toChatDateline(m.timestamp)}
      </div>
    );
  };

  _renderMessage = (m, previousMessage, i) => {
    const { navigator, userIdToUser, size, theme, messageIdToEdit, viewer } = this.props;

    let user,
      isEditable = false;
    if (m.fromUserId) {
      user = userIdToUser[m.fromUserId];
      if (viewer) {
        isEditable = m.fromUserId === viewer.userId && this.props.onSelectEdit;
      }
    }
    if (ChatUtilities.isMessageHidden(m)) {
      return null;
    }
    return (
      <ChatMessage
        key={`chat-message-${i}`}
        message={m}
        isEditable={isEditable}
        previousMessage={previousMessage}
        user={user}
        size={size}
        theme={theme}
        enableHoverActions={true}
        messageIdToEdit={messageIdToEdit}
        onSelectEdit={this.props.onSelectEdit}
        onSelectReaction={this.props.onSelectReaction}
        onNavigateToUserProfile={navigator.navigateToUserProfile}
        onSendMessageEdit={this.props.onSendMessageEdit}
        onEditCancel={this.props.onEditCancel}
      />
    );
  };

  render() {
    let messages = [];
    if (this.props.messages) {
      let previousMessage = null;
      this.props.messages.forEach((m, i) => {
        const message = this._renderMessage(m, previousMessage, i);
        const maybeDateline = this._renderDateline(m, previousMessage, i);
        if (message) {
          if (maybeDateline) {
            messages.push(maybeDateline);
          }
          messages.push(message);
          previousMessage = m;
        }
      });
    }

    return (
      <div
        className={STYLES_CONTAINER}
        ref={(c) => {
          this._container = c;
        }}>
        {messages}
        <div
          className={STYLES_BOTTOM}
          ref={(c) => {
            this._containerBottom = c;
            this.scroll();
          }}
        />
      </div>
    );
  }
}
