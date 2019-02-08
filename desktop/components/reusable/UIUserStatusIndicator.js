import * as React from 'react';
import * as Constants from '~/common/constants';
import { SocialContext } from '~/contexts/SocialContext';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: flex;
`;

const STYLES_INDICATOR_CONTAINER = css`
  width: 12px;
  height: 12px;
  margin: 2px 4px 2px 0;
  border-radius: 6px;
`;

const STYLES_STATUS = css`
  font-size: 14px;
  line-height: 16px;
`;

const STYLES_MEDIA_NAME = css`
  color: ${Constants.colors.white};

  :hover {
    color: ${Constants.colors.yellow};
  }
`;

// TODO: restore status
class UIUserStatusIndicator extends React.Component {
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
      return secondsElapsed < 60 * 60 * 24 * 7;
    }
    return false;
  };

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
    } else if (secondsElapsed < 60 * 2) {
      return 'just now';
    } else if (secondsElapsed < 60 * 15) {
      return `${Math.floor(secondsElapsed / 60)} minutes ago`;
    } else if (secondsElapsed < 60 * 60) {
      return 'less than an hour ago';
    } else if (secondsElapsed < 60 * 60 * 2) {
      return 'an hour ago';
    } else if (secondsElapsed < 60 * 60 * 6) {
      return `${Math.floor(secondsElapsed / 60 / 60)} hours ago`;
    } else if (secondsElapsed < 60 * 60 * 24) {
      return `in the last day`;
    } else if (secondsElapsed < 60 * 60 * 24 * 2) {
      return `a day ago`;
    } else if (secondsElapsed < 60 * 60 * 24 * 7) {
      return `${Math.floor(secondsElapsed / 60 / 60 / 24)} days ago`;
    }
    return 'over a week ago';
  };

  _renderIndicator = () => {
    // offline
    let indicatorStyle = { border: `2px solid ${Constants.colors.indicatorOffline}` };
    const { user } = this.props;
    if (user.userId && this.props.social.onlineUserIds[user.userId]) {
      // online
      indicatorStyle = { background: Constants.colors.indicatorOnline };
    }
    return <div className={STYLES_INDICATOR_CONTAINER} style={indicatorStyle} />;
  };

  _renderStatus = () => {
    const { user } = this.props;
    if (user.mostRecentUserplay) {
      const { media, mediaUrl, active, imputedEndTime } = user.mostRecentUserplay;
      const mediaName = media ? media.name : 'an untitled game';
      if (mediaName.length > 24) {
        mediaName = `${mediaName.substring(0, 21)}...`;
      }
      let mediaElement;
      if (media) {
        mediaElement = (
          <span
            className={STYLES_MEDIA_NAME}
            onClick={() => {
              this.props.onMediaSelect && this.props.onMediaSelect(media);
            }}>
            {mediaName}
          </span>
        );
      } else {
        mediaElement = <span>{mediaName}</span>;
      }
      if (active) {
        return <div>Playing {mediaElement}</div>;
      } else if (this._isRecent(user.mostRecentUserplay)) {
        return (
          <div>
            Last played {mediaElement} {this._recentDateToString(imputedEndTime)}
          </div>
        );
      }
    }
    return <div>Offline</div>;
  };

  render() {
    let { user, hideIfNotRecent } = this.props;
    if (hideIfNotRecent && !this._isRecent(user.mostRecentUserplay)) {
      return null;
    }
    return (
      <div className={STYLES_CONTAINER}>
        {this._renderIndicator()}
        {/* <div className={STYLES_STATUS}>{this._renderStatus()}</div> */}
      </div>
    );
  }
}

export default class UIUserStatusIndicatorWithContext extends React.Component {
  render() {
    return (
      <SocialContext.Consumer>
        {(social) => <UIUserStatusIndicator social={social} {...this.props} />}
      </SocialContext.Consumer>
    );
  }
}
