import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatSidebarNavigationItem from '~/components/chat/ChatSidebarNavigationItem';

const STYLES_CONTAINER = css`
  margin-bottom: 16px;
`;

export default class ChatSidebarNavigation extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <ChatSidebarNavigationItem
          data={{
            name: 'Make a game',
            svg: 'make',
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'Featured games',
            svg: 'featured',
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'Posts',
            svg: 'posts',
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'History',
            svg: 'history',
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'Documentation',
            svg: 'documentation',
          }}
        />
      </div>
    );
  }
}
