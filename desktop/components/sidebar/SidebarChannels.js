import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarChannelItem from '~/components/sidebar/SidebarChannelItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarChannels extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>Channels</SidebarGroupHeader>
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: true, name: 'Channel #1', pending: 50 }}
        />
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: false, name: 'Channel #2', pending: 20 }}
        />
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: false, name: 'Channel #3', pending: 10 }}
        />
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: false, name: 'Channel #4', pending: 10 }}
        />
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: false, name: 'Channel #5', pending: 0 }}
        />
        <SidebarChannelItem
          onClick={this.props.onChat}
          data={{ active: false, name: 'Channel #6', pending: 0 }}
        />
      </div>
    );
  }
}
