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
          const active =
            c.channelId === this.props.selectedChannelId && this.props.contentMode === 'chat';

          return (
            <SidebarChannelItem
              key={`channel-${c.channelId}`}
              channel={c}
              onClick={
                !(active && this.props.isChatVisible)
                  ? () => this.props.onSelectChannel({ ...c })
                  : null
              }
              data={{
                active,
                pending: 0,
              }}
            />
          );
        })}
      </div>
    );
  }
}
