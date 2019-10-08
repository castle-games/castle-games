import * as React from 'react';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import NotificationItem from '~/components/notifications/NotificationItem';
import NotificationSectionHeader from '~/components/notifications/NotificationSectionHeader';

const STYLES_CONTAINER = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

class NotificationsList extends React.Component {
  static defaultProps = {
    notifications: [],
    reloadNotifications: async () => {},
    setAppNotificationsStatus: (notificationIds, status) => {},
  };

  componentDidMount() {
    this.props.reloadNotifications();
  }

  async componentDidUpdate(prevProps) {
    const prevNotifs = prevProps ? prevProps.notifications : null;
    if (this.props.notifications && prevNotifs !== this.props.notifications) {
      let notificationIdsRead = [];
      this.props.notifications.forEach((n) => {
        if (n.status === 'unseen') {
          notificationIdsRead.push(n.appNotificationId);
        }
      });
      if (notificationIdsRead.length) {
        this.props.setAppNotificationsStatus(notificationIdsRead, 'seen');
      }
    }
  }

  _handleSelectNotification = async (notification) => {
    switch (notification.type) {
      case 'post': {
        try {
          const fullGame = await Actions.getGameByGameId(notification.gameId);
          this.props.navigator.navigateToGameMeta(fullGame);
        } catch (e) {}
        break;
      }
    }
  };

  _renderNotification = (n, ii) => {
    const { notifications } = this.props;
    let prevNotification = ii > 0 ? notifications[ii - 1] : null;

    const status = n.status === 'unseen';
    const prevStatus = prevNotification ? prevNotification.status === 'unseen' : null;

    const notifElement = (
      <NotificationItem
        key={`notification-${ii}`}
        notification={n}
        onSelectNotification={this._handleSelectNotification}
      />
    );

    if (status !== prevStatus) {
      return (
        <React.Fragment>
          <NotificationSectionHeader unseen={status} key={`notif-header-${ii}`} />
          {notifElement}
        </React.Fragment>
      );
    } else {
      return notifElement;
    }
  };

  render() {
    const { notifications } = this.props;
    return (
      <div className={STYLES_CONTAINER}>
        {notifications.map((n, ii) => this._renderNotification(n, ii))}
      </div>
    );
  }
}

export default class NotificationsListWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <NavigatorContext.Consumer>
            {(navigator) => (
              <NotificationsList
                notifications={currentUser.appNotifications}
                reloadNotifications={currentUser.loadAppNotifications}
                setAppNotificationsStatus={currentUser.setAppNotificationsStatus}
                navigator={navigator}
              />
            )}
          </NavigatorContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
