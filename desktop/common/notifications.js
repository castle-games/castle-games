import * as ChatUtilities from '~/common/chat-utilities';

import { NativeBinds } from '~/native/nativebinds';

export const NotificationType = {
  NONE: 0,
  BADGE: 1,
  DESKTOP: 2,
};

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

export const chatMessageHasNotification = (m, viewer, channel, type = NotificationType.DESKTOP) => {
  const notificationLevel = _getChatNotificationLevel(viewer);
  if (type === NotificationType.DESKTOP && notificationLevel === NotificationLevel.NONE)
    return false;

  if (m.isEdit) {
    return false;
  }

  let messageHasNotification = false;
  // String() coercion needed at time of writing because these user ids are a number
  // and string respectively.
  if (m.body && m.body.message && String(m.fromUserId) !== String(viewer.userId)) {
    if (type === NotificationType.DESKTOP && notificationLevel === NotificationLevel.EVERY) {
      messageHasNotification = true;
    } else {
      messageHasNotification =
        m.body.notifications &&
        m.body.notifications.userIds &&
        m.body.notifications.userIds.some((id) => String(id) === viewer.userId);
    }
  }
  return messageHasNotification;
};

export const showFromChatMessages = (messages, viewer, channels, userIdToUser) => {
  for (let ii = 0, nn = messages.length; ii < nn; ii++) {
    const m = messages[ii];
    const channel = channels[m.channelId];
    if (chatMessageHasNotification(m, viewer, channel)) {
      showNotification({
        title: channel.name,
        message: ChatUtilities.messageBodyToPlainText(m.body, userIdToUser),
      });
    }
  }
};
