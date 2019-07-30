import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarChannelItem from '~/components/sidebar/SidebarChannelItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

const STYLES_TOGGLE_MORE_LINK = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  padding: 0 16px 0 16px;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  color: ${Constants.colors.text2};

  :hover {
    color: ${Constants.colors.brand2};
  }
`;

export default class SidebarChannels extends React.Component {
  static defaultProps = {
    channels: [],
    filterChannel: (channel) => true,
  };

  state = {
    showingMore: false,
  };

  _handleToggleMore = () => {
    this.setState((prevState, props) => ({
      showingMore: !prevState.showingMore,
    }));
  };

  // Returns the time of the most recent activity for the channel. Join and leave notifications do not count
  _getTimeOfMostRecentChannelActivity = (channel) => {
    if (channel.messages) {
      for (let i = channel.messages.length - 1; i >= 0; i--) {
        let message = channel.messages[i];
        if (!message.body || (message.body.notificationType !== 'joined-channel' && message.body.notificationType !== 'left-channel')) {
          let date = new Date(message.timestamp);
          return date.getTime();
        }
      }
    }
    return 0;
  };

  render() {
    const { channels, filterChannel } = this.props;
    let filteredChannels = [];
    Object.entries(channels).forEach(([channelId, channel]) => {
      if (filterChannel(channel)) {
        filteredChannels.push(channel);
      }
    });

    if (!filteredChannels.length) {
      return null;
    }

    // Of the filtered channels, figure out which ones are visible
    let visibleChannels;
    // If we're showing all the channels or don't have many to begin with, show all of them
    if (this.state.showingMore || filteredChannels.length <= 5) {
      visibleChannels = filteredChannels;
    // Otherwise we display channels with high activity
    } else {
      // Sort by activity
      let channelsSortedByActivity = filteredChannels.sort((a, b) => {
        return this._getTimeOfMostRecentChannelActivity(b) - this._getTimeOfMostRecentChannelActivity(a);
      });
      visibleChannels = [];
      let now = Date.now();
      let twentyFourHours = 24 * 60 * 60 * 1000;
      for (let c of channelsSortedByActivity) {
        let hasVeryRecentActivity = this._getTimeOfMostRecentChannelActivity(c) > now - twentyFourHours;
        let isSelectedChannel = c.channelId === this.props.selectedChannelId && this.props.isChatVisible;
        let hasNotifications = c.unreadNotificationCount > 0;
        // Always display the 5 most active channels, any channels with messages in the past day,
        //  the selected channel, and any channels with unread notifications
        if (visibleChannels.length < 5 || hasVeryRecentActivity || isSelectedChannel || hasNotifications) {
          visibleChannels.push(c);
        }
      }
    }

    // Sort the list of visible channels
    visibleChannels = ChatUtilities.sortChannels(visibleChannels);

    let showToggleMore = this.state.showingMore || visibleChannels.length < filteredChannels.length;

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader>{this.props.title}</SidebarGroupHeader>
        {visibleChannels.map((c) => {
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
        {showToggleMore && (
          <div className={STYLES_TOGGLE_MORE_LINK} onClick={this._handleToggleMore}>
            {this.state.showingMore ? 'Show less' : 'Show more'}
          </div>
        )}
      </div>
    );
  }
}
