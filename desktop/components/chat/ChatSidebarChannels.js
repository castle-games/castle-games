import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatSidebarGroupHeader from '~/components/chat/ChatSidebarGroupHeader';
import ChatSidebarChannelItem from '~/components/chat/ChatSidebarChannelItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class ChatSidebarChannels extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <ChatSidebarGroupHeader onShowOptions={this.props.onShowOptions}>
          Channels
        </ChatSidebarGroupHeader>
        <ChatSidebarChannelItem data={{ game: true, active: false, name: 'Game #1', pending: 0 }} />
        <ChatSidebarChannelItem
          data={{ game: true, active: false, name: 'Game #2', pending: 20 }}
        />
        <ChatSidebarChannelItem data={{ active: true, name: 'Channel #1', pending: 50 }} />
        <ChatSidebarChannelItem data={{ active: false, name: 'Channel #2', pending: 20 }} />
        <ChatSidebarChannelItem data={{ active: false, name: 'Channel #3', pending: 10 }} />
        <ChatSidebarChannelItem data={{ active: false, name: 'Channel #4', pending: 10 }} />
        <ChatSidebarChannelItem data={{ active: false, name: 'Channel #5', pending: 0 }} />
        <ChatSidebarChannelItem data={{ active: false, name: 'Channel #6', pending: 0 }} />
      </div>
    );
  }
}
