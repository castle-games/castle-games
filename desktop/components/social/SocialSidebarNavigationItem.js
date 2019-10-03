import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin: 0;
  cursor: pointer;
  user-select: none;
  position: relative;
  width: ${Constants.sidebar.collapsedWidth};
`;

const STYLES_VOICE_CHAT_ACTIVE = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 6px 0 6px 0;
  position: relative;
  width: ${Constants.sidebar.collapsedWidth};

  @keyframes voice-chat-live-color-change {
    0% {
      background-color: #ff0000;
    }
    50% {
      background-color: transparent;
    }
    100% {
      background-color: #ff0000;
    }
  }

  animation: voice-chat-live-color-change infinite 1600ms;
`;

const STYLES_VOICE_CHAT_INACTIVE = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 6px 0 6px 0;
  position: relative;
  width: ${Constants.sidebar.collapsedWidth};
`;

export default class SocialSidebarNavigationItem extends React.Component {
  static defaultProps = {
    showOnlineIndicator: true,
    isVoiceChatActive: false,
    theme: {},
  };

  render() {
    const {
      isUnread,
      notificationCount,
      isSelected,
      onClick,
      theme,
      isVoiceChatActive,
    } = this.props;
    const { isOnline, showOnlineIndicator } = this.props;
    const { avatarUrl, avatarElement } = this.props;

    let backgroundColor,
      unreadCount,
      indicatorStyles = {};
    if (isSelected) {
      backgroundColor = theme.navigatorSelectedBackground || '#d3d3d3';
    }
    if (isUnread && !isSelected) {
      unreadCount = notificationCount;
      if (unreadCount > 0) {
        indicatorStyles = {
          backgroundColor: 'rgb(255, 0, 235)',
          height: '14px',
          padding: '0 6px 0 6px',
        };
      } else {
        indicatorStyles = {
          backgroundColor: theme.navigatorBackground ? 'white' : 'black',
        };
      }
    }
    if (theme.navigatorBackground) {
      indicatorStyles = { ...indicatorStyles, borderColor: theme.navigatorBackground };
    }

    let avatar;
    if (avatarElement) {
      avatar = avatarElement;
    } else if (avatarUrl) {
      avatar = (
        <UIAvatar
          src={avatarUrl}
          showIndicator={showOnlineIndicator}
          isOnline={isOnline}
          style={{ width: 24, height: 24 }}
          indicatorStyle={indicatorStyles}
          indicatorCount={unreadCount}
        />
      );
    }

    return (
      <div
        className={STYLES_CONTAINER}
        onClick={!isSelected ? onClick : null}
        style={{ backgroundColor }}>
        <div className={isVoiceChatActive ? STYLES_VOICE_CHAT_ACTIVE : STYLES_VOICE_CHAT_INACTIVE}>
          {avatar}
        </div>
      </div>
    );
  }
}
