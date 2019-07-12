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
    filterChannel: (channel) => true,
  };

  render() {
    const { channels, filterChannel } = this.props;
    let filteredChannels = [];
    Object.entries(channels).forEach(([channelId, channel]) => {
      if (filterChannel(channel)) {
        filteredChannels.push(channel);
      }
    });
    filteredChannels = ChatUtilities.sortChannels(filteredChannels);

    if (!filteredChannels.length) {
      return null;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader>{this.props.title}</SidebarGroupHeader>
        {filteredChannels.map((c) => {
          const isSelected =
            c.channelId === this.props.selectedChannelId && this.props.isChatVisible;

          return (
            <SidebarChannelItem
              key={`channel-${c.channelId}`}
              channel={c}
              isSelected={isSelected}
              onClick={!isSelected ? () => this.props.onSelectChannel(c) : null}
            />
          );
        })}
      </div>
    );
  }
}
