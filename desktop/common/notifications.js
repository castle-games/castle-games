import * as ChatUtilities from '~/common/chat-utilities';

import { NativeBinds } from '~/native/nativebinds';

export const NotificationLevel = {
  NONE: 0,
  TAG: 1,
  EVERY: 2,
};

const _getChatNotificationLevel = (user) => {
  if (!user) {
    return NotificationLevel.NONE;
  }

  let notifications = user.notifications;
  if (!notifications || !notifications.desktop) {
    return NotificationLevel.NONE;
  }

  let result = NotificationLevel.NONE;
  for (let i = 0; i < notifications.desktop.length; i++) {
    let preference = notifications.desktop[i];
    if (preference.type === 'chat_tagged' && preference.frequency === 'every') {
      result = NotificationLevel.TAG;
    }
    if (preference.type === 'chat_all' && preference.frequency === 'every') {
      return NotificationLevel.EVERY;
    }
  }
  return result;
};

export const showNotification = ({ title, message }) => {
  if (!title || !message) {
    console.warn(`Cannot show desktop notification with title ${title} and message ${message}`);
    return;
  }
  return NativeBinds.showDesktopNotification({
    title,
    body: message,
  });
};

export const showFromChatMessages = (messages, viewer, channels) => {
  const notificationLevel = _getChatNotificationLevel(viewer);
  if (notificationLevel === NotificationLevel.NONE) return;

  for (let ii = 0, nn = messages.length; ii < nn; ii++) {
    const m = messages[ii];
    const channel = channels[m.channelId];
    let messageHasNotification = false;
    if (m.body && m.body.message && m.fromUserId !== viewer.userId) {
      if (notificationLevel === NotificationLevel.EVERY || channel.type === 'dm') {
        messageHasNotification = true;
      } else if (notificationLevel === NotificationLevel.TAG) {
        messageHasNotification = m.body.message.some(
          (component) => component.userId && component.userId === viewer.userId
        );
      }
    }
    if (messageHasNotification) {
      showNotification({
        title: channel.name,
        message: ChatUtilities.messageBodyToPlainText(m.body),
      });
    }
  }
};
