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
  ALL: 2,
};

const _getChatNotificationLevel = (settings) => {
  if (
    !settings ||
    !settings.notifications ||
    !settings.notifications.desktop ||
    !settings.notifications.desktop.chat
  ) {
    return NotificationLevel.NONE;
  }

  let notificationsLevel = settings.notifications.desktop.chat;
  switch (notificationsLevel) {
    case 'tag':
      return NotificationLevel.TAG;
    case 'all':
      return NotificationLevel.ALL;
    default:
      return NotificationLevel.NONE;
  }
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

export const chatMessageHasNotification = (
  m,
  viewer,
  settings,
  channel,
  type = NotificationType.DESKTOP
) => {
  const notificationLevel = _getChatNotificationLevel(settings);
  if (type === NotificationType.DESKTOP && notificationLevel === NotificationLevel.NONE)
    return false;

  if (m.isEdit || m.isReactionUpdate) {
    return false;
  }

  let messageHasNotification = false;
  // String() coercion needed at time of writing because these user ids are a number
  // and string respectively.
  if (m.body && m.body.message && String(m.fromUserId) !== String(viewer.userId)) {
    if (type === NotificationType.DESKTOP && notificationLevel === NotificationLevel.ALL) {
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

export const showFromChatMessages = (messages, viewer, settings, channels, userIdToUser) => {
  for (let ii = 0, nn = messages.length; ii < nn; ii++) {
    const m = messages[ii];
    const channel = channels[m.channelId];
    if (chatMessageHasNotification(m, viewer, settings, channel)) {
      showNotification({
        title: channel.name,
        message: ChatUtilities.messageBodyToPlainText(m.body, userIdToUser),
      });
    }
  }
};
