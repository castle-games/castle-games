import ReactDOM from 'react-dom';

import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as URLS from '~/common/urls';

import { css } from 'react-emotion';

import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatMessageElementSameUser from '~/components/chat/ChatMessageElementSameUser';
import ChatEventElement from '~/components/chat/ChatEventElement';
import ChatRolePlayElement from '~/components/chat/ChatRolePlayElement';
import ChatPost from '~/components/chat/ChatPost';

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
  height: 8px;
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
`;

export default class ChatMessages extends React.Component {
  static defaultProps = {
    messages: [],
    theme: {
      textColor: Constants.REFACTOR_COLORS.text,
    },
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

  _renderDateline = (m, previousMessage) => {
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
    const { navigator, userIdToUser, theme } = this.props;
    if (m.fromUserId == ChatUtilities.ADMIN_USER_ID) {
      return <ChatEventElement key={`chat-event-${i}`} message={m} theme={theme} />;
    }

    const user = userIdToUser[m.fromUserId];
    const slashCommand = ChatUtilities.getSlashCommand(m.body);
    const isEmojiMessage = ChatUtilities.isEmojiBody(m.body);
    if (slashCommand.isCommand && slashCommand.command === 'me') {
      return (
        <ChatRolePlayElement
          key={`chat-roleplay-${i}`}
          message={m}
          isEmojiMessage={isEmojiMessage}
          user={user}
          onNavigateToUserProfile={navigator.navigateToUserProfile}
          theme={theme}
        />
      );
    }

    if (previousMessage) {
      const prevSlashCommand = ChatUtilities.getSlashCommand(previousMessage.body);
      let timeBetween = (new Date(m.timestamp) - new Date(previousMessage.timestamp)) / 1000;
      if (
        !prevSlashCommand.isCommand &&
        previousMessage.fromUserId === m.fromUserId &&
        timeBetween < 60 * 5
      ) {
        return (
          <ChatMessageElementSameUser
            key={`chat-${m.fromUserId}-${m.chatMessageId}-${i}`}
            message={m}
            isEmojiMessage={isEmojiMessage}
            theme={theme}
            size={this.props.size}
          />
        );
      }
    }

    return (
      <ChatMessageElement
        key={`chat-${m.fromUserId}-${m.chatMessageId}-${i}`}
        message={m}
        isEmojiMessage={isEmojiMessage}
        user={user}
        onNavigateToUserProfile={navigator.navigateToUserProfile}
        theme={theme}
        size={this.props.size}
      />
    );
  };

  render() {
    let messages = [];
    if (this.props.messages) {
      this.props.messages.forEach((m, i) => {
        let previousMessage = i > 0 ? this.props.messages[i - 1] : null;
        const message = this._renderMessage(m, previousMessage, i);
        const maybeDateline = this._renderDateline(m, previousMessage, i);
        if (maybeDateline) {
          messages.push(maybeDateline);
        }
        messages.push(message);
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
