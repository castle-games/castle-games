import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin: 0;
  padding: 6px 0 6px 0;
  cursor: pointer;
  user-select: none;
  position: relative;
  width: ${Constants.sidebar.collapsedWidth};
`;

export default class SocialSidebarNavigationItem extends React.Component {
  static defaultProps = {
    showOnlineIndicator: true,
    theme: {},
  };

  render() {
    const { isUnread, notificationCount, isSelected, onClick, theme } = this.props;
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
        {avatar}
      </div>
    );
  }
}
