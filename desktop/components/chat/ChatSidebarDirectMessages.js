import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatSidebarGroupHeader from '~/components/chat/ChatSidebarGroupHeader';
import ChatSidebarDirectMessageItem from '~/components/chat/ChatSidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class ChatSidebarDirectMessages extends React.Component {
  render() {
    if (!this.props.viewer) {
      return null;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <ChatSidebarGroupHeader onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </ChatSidebarGroupHeader>
        <ChatSidebarDirectMessageItem data={{ online: true, name: 'Person #1', pending: 50 }} />
        <ChatSidebarDirectMessageItem data={{ online: true, name: 'Person #2', pending: 40 }} />
        <ChatSidebarDirectMessageItem data={{ online: true, name: 'Person #3', pending: 20 }} />
        <ChatSidebarDirectMessageItem data={{ online: false, name: 'Person #4', pending: 0 }} />
        <ChatSidebarDirectMessageItem data={{ online: false, name: 'Person #5', pending: 0 }} />
        <ChatSidebarDirectMessageItem data={{ online: false, name: 'Person #6', pending: 0 }} />
      </div>
    );
  }
}
