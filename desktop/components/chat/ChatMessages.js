import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatEventElement from '~/components/chat/ChatEventElement';
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

export default class ChatMessages extends React.Component {
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

  render() {
    const { social, navigator, chat } = this.props;

    let messages = this.props.messages.map((m, i) => {
      if (m.type === 'NOTICE') {
        return <ChatEventElement key={`chat-event-${i}`} message={m} />;
      }

      const user = this.props.social.userIdToUser[m.fromUserId];
      return (
        <ChatMessageElement
          key={`chat-${m.fromUserId}-${m.chatMessageId}-${i}`}
          message={m}
          user={user}
          social={this.props.social}
          navigator={this.props.navigator}
          chat={this.props.chat}
          onNavigateToUserProfile={this.props.navigator.navigateToUserProfile}
        />
      );
    });

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
