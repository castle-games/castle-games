import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';
import { Tooltip } from 'react-tippy';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_HEADER = css`
  background: #ececed;
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  height: ${Constants.sidebar.collapsedWidth};
  max-height: ${Constants.sidebar.collapsedWidth};
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_VIEWER = css`
  display: flex;
  width: ${Constants.sidebar.collapsedWidth};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const STYLES_VIEWER_CONTAINER = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const STYLES_NOTIFICATION_BADGE = css`
  position: absolute;
  flex-shrink: 0;
  bottom: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: ${Constants.brand.fuchsia};
  border: 2px solid ${Constants.REFACTOR_COLORS.elements.channels};
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  color: white;
  font-size: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0px;
  padding: 0 2px;
`;

const TOOLTIP_PROPS = {
  arrow: true,
  duration: 170,
  animation: 'fade',
  hideOnClick: false,
  position: 'left',
};

const STYLES_HEADER_LEFT = css`
  padding: 8px 8px 8px 16px;
  min-width: 25%;
  width: 100%;
`;

const STYLES_H2 = css`
  font-size: 12px;
`;

const STYLES_P = css`
  margin: 4px 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  height: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued};

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

const STYLES_ACTIONS = css`
  color: ${Constants.REFACTOR_COLORS.subdued}:
  cursor: pointer;

  span {
    padding: 0 8px 0 8px;
  }

  #action {
    display: inline;
    cursor: pointer;

    :hover {
      color: magenta;
    }
  }
`;

const STYLES_LINK = css`
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
`;

const STYLES_CHANNEL_NAME = css``;

export default class SocialSidebarHeader extends React.Component {
  static defaultProps = {
    mode: 'chat',
    isExpanded: true,
    unseenNotificationCount: 0,
  };

  _renderTitle = () => {
    const { mode, channel, onChannelClick } = this.props;
    let content;
    if (mode === 'notifications') {
      content = <span className={STYLES_CHANNEL_NAME}>My Notifications</span>;
    } else if (channel.type === 'dm') {
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {channel.name}
        </span>
      );
    } else {
      let name;
      if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
        name = 'Community Chat';
      } else {
        name = channel.name;
      }
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {name}
        </span>
      );
    }
    return <h2 className={STYLES_H2}>{content}</h2>;
  };

  _getHeading = () => {
    const { mode, channel } = this.props;
    if (mode === 'notifications') {
      return '';
    }
    switch (channel.type) {
      case 'dm':
        return `A private conversation with ${channel.name}`;
      case 'game':
        return `People playing ${channel.name}`;
      default:
        if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
          return 'Everyone on Castle';
        }
        break;
    }
    return 'This is a public channel.';
  };

  _getLeaveMessage = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'dm':
        return 'Leave conversation';
        break;
      default:
        return 'Leave channel';
        break;
    }
  };

  _renderActions = () => {
    const { mode, channel, numChannelMembers, viewer } = this.props;

    if (mode === 'notifications') {
      let username = viewer ? viewer.username : '';
      return (
        <span className={STYLES_ACTIONS} onClick={this.props.onViewerClick}>
          <div id="action">Signed in as {username}</div>
        </span>
      );
    }
    if (channel.type !== 'dm' && numChannelMembers) {
      return (
        <span className={STYLES_ACTIONS} onClick={this.props.onMembersClick}>
          <span>&middot;</span>
          <div id="action">{numChannelMembers} online</div>
        </span>
      );
    }
    return null;
  };

  _renderNotificationBadge = () => {
    const { unseenNotificationCount } = this.props;
    if (unseenNotificationCount > 0) {
      const displayCount = unseenNotificationCount > 99 ? '99+' : unseenNotificationCount;
      return <div className={STYLES_NOTIFICATION_BADGE}>{displayCount}</div>;
    }
    return null;
  };

  _renderViewer = () => {
    const { viewer, onSelectNotifications, unseenNotificationCount } = this.props;
    const avatarSrc = viewer && viewer.photo ? viewer.photo.url : null;
    let tooltip = `Notifications for ${viewer.username}`;
    if (unseenNotificationCount > 0) {
      tooltip = `${tooltip} (${unseenNotificationCount} new)`;
    }
    return (
      <Tooltip title={tooltip} {...TOOLTIP_PROPS}>
        <div className={STYLES_VIEWER_CONTAINER} onClick={onSelectNotifications}>
          <UIAvatar
            src={avatarSrc}
            showIndicator={false}
            style={{
              height: `28px`,
              width: `28px`,
            }}
          />
          {this._renderNotificationBadge()}
        </div>
      </Tooltip>
    );
  };

  render() {
    const { channel, isExpanded } = this.props;
    if (!channel) {
      return null;
    }

    return (
      <header className={STYLES_HEADER}>
        {isExpanded ? (
          <div className={STYLES_HEADER_LEFT}>
            {this._renderTitle()}
            <div className={STYLES_P}>
              <span>{this._getHeading()}</span>
              {this._renderActions()}
            </div>
          </div>
        ) : null}
        <div className={STYLES_VIEWER}>{this._renderViewer()}</div>
      </header>
    );
  }
}
