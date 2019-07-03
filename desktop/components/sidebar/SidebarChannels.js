import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
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
    const { channels } = this.props;
    let filteredChannels = [];
    Object.entries(channels).forEach(([channelId, channel]) => {
      if (channel.isSubscribed && channel.type !== 'dm') {
        filteredChannels.push(channel);
      }
    });
    filteredChannels = ChatUtilities.sortChannels(filteredChannels);

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onShowOptions={this.props.onShowOptions}>Channels</SidebarGroupHeader>
        {filteredChannels.map((c) => {
          const isSelected =
            c.channelId === this.props.selectedChannelId && this.props.contentMode === 'chat';

          return (
            <SidebarChannelItem
              key={`channel-${c.channelId}`}
              channel={c}
              isSelected={isSelected}
              onClick={
                !(isSelected && this.props.isChatVisible)
                  ? () => this.props.onSelectChannel(c)
                  : null
              }
              data={{
                pending: 0,
              }}
            />
          );
        })}
      </div>
    );
  }
}
