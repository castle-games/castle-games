import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIMessageBody from '~/components/reusable/UIMessageBody';

const STYLES_CONTAINER = css`
  width: 100%;
  font-family: ${Constants.REFACTOR_FONTS.system};
  cursor: default;
`;

const STYLES_ROW = css`
  display: flex;
  padding: 8px 16px;
`;

const STYLES_LEFT = css`
  width: 32px;
  flex-shrink: 0;
  display: flex;
`;

const STYLES_RIGHT = css`
  width: 100%;
`;

const STYLES_BODY = css`
  font-size: 12px;
  line-height: 16px;
`;

const STYLES_TIMESTAMP = css`
  font-size: 10px;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-top: 2px;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;

export default class NotificationItem extends React.Component {
  static defaultProps = {
    notification: {},
    onSelectNotification: () => {},
  };

  _getEmoji = (n) => {
    switch (n.type) {
      case 'play_game_owner':
      case 'post': {
        return '👾';
      }
      case 'chat_message_game_channel_owner':
      case 'chat_message_game_channel_tagged':
      case 'chat_message': {
        return '📣';
      }
    }
    return '🎉';
  };

  render() {
    const { notification, theme } = this.props;
    if (!notification || !notification.body) {
      return null;
    }

    let themeContainerStyles;
    if (theme) {
      themeContainerStyles = css`
        color: ${theme.textColor};
      `;
    }

    return (
      <div className={`${STYLES_CONTAINER} ${themeContainerStyles}`}>
        <div className={STYLES_ROW}>
          <div className={STYLES_LEFT}>
            <p>{this._getEmoji(notification)}</p>
          </div>
          <div className={STYLES_RIGHT}>
            <div className={STYLES_BODY}>
              <UIMessageBody body={notification.body} theme={this.props.theme} />
            </div>
            <div
              className={STYLES_TIMESTAMP}
              onClick={() => this.props.onSelectNotification(notification)}>
              {Strings.toChatDate(notification.createdTime)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
