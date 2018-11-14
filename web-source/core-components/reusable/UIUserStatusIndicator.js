import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
  padding: 12px 4px 16px 0;
`;

const STYLES_INDICATOR_CONTAINER = css`
  width: 12px;
  height: 12px;
  margin: 2px 4px 2px 0;
  border-radius: 6px;
`;

const STYLES_STATUS = css`
  font-size: 12px;
  line-height: 16px;
`;

export default class UIUserStatusIndicator extends React.Component {
  _isRecent = (userplay) => {
    // "recent" is anything newer than seven days
    if (userplay) {
      let secondsElapsed = 0;
      try {
        const date = new Date(dateStr);
        const recentTime = Math.floor(date.getTime() / 1000);
        const currentTime = Math.floor(Date.now() / 1000);
        secondsElapsed = currentTime - recentTime;
      } catch (_) {}
      return (secondsElapsed < 60 * 60 * 24 * 7);
    }
    return false;
  }

  _recentDateToString = (dateStr) => {
    let secondsElapsed = 0;
    try {
      const date = new Date(dateStr);
      const recentTime = Math.floor(date.getTime() / 1000);
      const currentTime = Math.floor(Date.now() / 1000);
      secondsElapsed = currentTime - recentTime;
    } catch (_) {}
    if (!secondsElapsed) {
      return '';
    } else if (secondsElapsed < 60) {
      return 'just now';
    } else if (secondsElapsed < 60 * 15) {
      return `${Math.floor(secondsElapsed / 60)} minutes ago`;
    } else if (secondsElapsed < 60 * 60) {
      return 'less than an hour ago';
    } else if (secondsElapsed < 60 * 60 * 6) {
      return `${Math.floor((secondsElapsed / 60) / 60)} hours ago`;
    } else if (secondsElapsed < 60 * 60 * 24) {
      return `in the last day`;
    } else if (secondsElapsed < 60 * 60 * 24 * 7) {
      return `${Math.floor(((secondsElapsed / 60) / 60) / 24)} days ago`;
    }
    return 'over a week ago';
  }

  _renderIndicator = () => {
    // offline
    let indicatorStyle = { border: `2px solid ${Constants.colors.subdued}` };
    const { user } = this.props;
    if (user.mostRecentUserplay) {
      if (user.mostRecentUserplay.active) {
        // online
        indicatorStyle = { background: Constants.colors.green };
      } else if (this._isRecent(user.mostRecentUserplay)) {
        // recently online
        indicatorStyle = { border: `2px solid ${Constants.colors.green}` };
      }
    }
    return (
      <div className={STYLES_INDICATOR_CONTAINER} style={indicatorStyle} />
    );
  }

  _renderStatusText = () => {
    const { user } = this.props;
    if (user.mostRecentUserplay) {
      const { media, mediaUrl, active, imputedEndTime } = user.mostRecentUserplay;
      const mediaName = (media) ? media.name : 'an untitled game';
      if (active) {
        return `Playing ${mediaName}`;
      } else if (this._isRecent(user.mostRecentUserplay)) {
        return `Last played ${mediaName} ${this._recentDateToString(imputedEndTime)}`;
      }
    }
    return 'Offline';
  };
  
  render() {
    let { user, hideIfNotRecent } = this.props;
    if (hideIfNotRecent && !this._isRecent(user.mostRecentUserplay)) {
      return null;
    }
    return (
      <div className={STYLES_CONTAINER}>
        {this._renderIndicator()}
        <div className={STYLES_STATUS}>
          {this._renderStatusText()}
        </div>
      </div>
    );
  }
}
