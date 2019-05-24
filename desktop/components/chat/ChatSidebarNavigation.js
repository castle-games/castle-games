import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatSidebarNavigationItem from '~/components/chat/ChatSidebarNavigationItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class ChatSidebarNavigation extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <ChatSidebarNavigationItem
          data={{
            name: 'Make a game',
            svg: 'make',
            onClick: this.props.onNavigateToMakeGame,
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'Featured games',
            svg: 'featured',
            onClick: this.props.onNavigateToFeaturedGames,
          }}
        />
        <ChatSidebarNavigationItem
          data={{
            name: 'Posts',
            svg: 'posts',
            onClick: this.props.onNavigateToAllPosts,
          }}
        />
        {this.props.viewer ? (
          <ChatSidebarNavigationItem
            data={{
              name: 'History',
              svg: 'history',
              onClick: this.props.onNavigateToHistory,
            }}
          />
        ) : null}
        <ChatSidebarNavigationItem
          data={{
            name: 'Documentation',
            svg: 'documentation',
            onClick: this.props.onOpenBrowserForDocumentation,
          }}
        />
      </div>
    );
  }
}
