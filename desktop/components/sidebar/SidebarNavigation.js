import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarNavigationItem from '~/components/sidebar/SidebarNavigationItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarNavigation extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <SidebarNavigationItem
          data={{
            name: 'Make a game',
            svg: 'make',
            onClick: this.props.onNavigateToMakeGame,
          }}
        />
        <SidebarNavigationItem
          data={{
            name: 'Featured games',
            svg: 'featured',
            onClick: this.props.onNavigateToFeaturedGames,
          }}
        />
        <SidebarNavigationItem
          data={{
            name: 'Posts',
            svg: 'posts',
            onClick: this.props.onNavigateToAllPosts,
          }}
        />
        {this.props.viewer ? (
          <SidebarNavigationItem
            data={{
              name: 'History',
              svg: 'history',
              onClick: this.props.onNavigateToHistory,
            }}
          />
        ) : null}
        <SidebarNavigationItem
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
