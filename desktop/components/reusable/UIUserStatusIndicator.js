import * as React from 'react';
import * as Constants from '~/common/constants';
import { SocialContext } from '~/contexts/SocialContext';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  display: inline-flex;
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
`;

// TODO: restore status
class UIUserStatusIndicator extends React.Component {
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
    let indicatorStyle = { border: `2px solid ${Constants.colors.userStatus.offline}` };
    const { user } = this.props;
    if (user.userId && this.props.social.onlineUserIds[user.userId]) {
      // online
      indicatorStyle = {
        border: `2px solid ${Constants.colors.userStatus.online}`,
        background: Constants.colors.userStatus.online,
      };
    }
    return <div className={STYLES_INDICATOR_CONTAINER} style={indicatorStyle} />;
  };

  _renderStatus = () => {
    const { user } = this.props;
    if (user.lastUserStatus) {
      const { status, isRecent, game } = user.lastUserStatus;
      const gameName = game ? game.name : 'an untitled game';
      if (gameName.length > 24) {
        gameName = `${gameName.substring(0, 21)}...`;
      }
      let gameElement;
      if (game) {
        gameElement = (
          <span
            className={STYLES_MEDIA_NAME}
            onClick={() => {
              this.props.navigateToGame && this.props.navigateToGame(game);
            }}>
            {gameName}
          </span>
        );
      } else {
        gameElement = <span>{gameName}</span>;
      }
      if (isRecent) {
        const verb = (status === 'make') ? 'Making' : 'Playing';
        return <div>{verb} {gameElement}</div>;
      } else if (user.lastUserStatus.isRecent) {
        // TODO: need a date field on status
        return (
          <div>
            Last played {gameElement} {this._recentDateToString('')}
          </div>
        );
      }
    }
    return <div>Offline</div>;
  };

  render() {
    let { user, hideIfNotRecent } = this.props;
    if (hideIfNotRecent && (!user.lastUserStatus || !user.lastUserStatus.isRecent)) {
      return null;
    }
    return (
      <div className={STYLES_CONTAINER} style={{ ...this.props.style }}>
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
