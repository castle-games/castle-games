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
  static defaultProps = {
    channels: [],
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>Channels</SidebarGroupHeader>
        {this.props.channels.map((c) => {
          return (
            <SidebarChannelItem
              key={`channel-${c.channelId}`}
              onClick={() => this.props.onSelectChannel({ ...c })}
              data={{
                active: c.channelId === this.props.selectedChannelId,
                name: c.name,
                pending: 0,
              }}
            />
          );
        })}
      </div>
    );
  }
}
