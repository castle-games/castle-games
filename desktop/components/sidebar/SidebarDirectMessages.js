import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarDirectMessageItem from '~/components/sidebar/SidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarDirectMessages extends React.Component {
  render() {
    if (!this.props.viewer) {
      return null;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onClick={this.props.onChat} onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </SidebarGroupHeader>
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: true, name: 'Person #1', status: 'Is playing Blast Flocks', pending: 50 }}
        />
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: true, name: 'Person #2', status: 'Is playing Blast Flocks', pending: 40 }}
        />
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: true, name: 'Person #3', status: 'Is playing Blast Flocks', pending: 20 }}
        />
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: false, name: 'Person #4', status: 'Is playing Blast Flocks', pending: 0 }}
        />
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: false, name: 'Person #5', status: 'Is playing Blast Flocks', pending: 0 }}
        />
        <SidebarDirectMessageItem
          onClick={this.props.onChat}
          data={{ online: false, name: 'Person #6', status: 'Is playing Blast Flocks', pending: 0 }}
        />
      </div>
    );
  }
}
