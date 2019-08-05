import * as React from 'react';
import * as ChatActions from '~/common/actions-chat';

import { isEmoji, emojiToString } from '~/common/emoji/emoji-utilities';

export const EVERYONE_CHANNEL_NAME = 'lobby';
export const ADMIN_USER_ID = -1;

const CHANNEL_TYPE_SORT = {
  public: 1,
  game: 2,
  dm: 3,
};

const _channelNameInvariant = (name) => {
  return name.toLowerCase().replace(/[\W_]+/g, '');
};

const _channelTypeSortValue = (type) => {
  const result = CHANNEL_TYPE_SORT[type];
  if (result) return result;
  return 0;
};

export const sortChannels = (channels) => {
  if (!channels || !channels.length) return channels;
  return channels.sort((a, b) => {
    // type of channel
    const typeCompare = _channelTypeSortValue(a.type) - _channelTypeSortValue(b.type);
    if (typeCompare != 0) return typeCompare;

    // for DMs, online users first
    const onlineCompare = !!b.otherUserIsOnline - !!a.otherUserIsOnline;
    if (onlineCompare != 0) return onlineCompare;

    // alpha
    return _channelNameInvariant(a.name) > _channelNameInvariant(b.name) ? 1 : -1;
  });
};

/**
 *  @return whether the message should be treated as readable activity of some kind,
 *          for example when deciding whether to mark a channel as unread.
 */
export const messageHasActivity = (m) => {
  if (m.isEdit) {
    return false;
  }
  if (m.tempChatMessageId && m.chatMessageId === m.tempChatMessageId) {
    return false;
  }
  if (m.body) {
    if (
      m.body.notificationType === 'joined-channel' ||
      m.body.notificationType === 'left-channel'
    ) {
      return false;
    }
  }
  return true;
};

export const messageBodyToPlainText = (body, userIdToUser, { useEmojiShortName = false } = {}) => {
  if (!body) return null;

  if (typeof body === 'string') {
    body = { message: [{ text: body }] };
  }

  if (!body.message) return null;

  let components = body.message.map((c, ii) => {
    if (c.text) {
      return c.text;
    } else if (c.userId) {
      const user = userIdToUser[c.userId];
      if (user) {
        return `@${user.username}`;
      }
    } else if (c.emoji) {
      if (useEmojiShortName) {
        return `:${c.emoji}:`;
      } else {
        return emojiToString(c.emoji);
      }
    }
    return '';
  });
  return components.join('');
};

export const isEmojiBody = (body) => {
  if (body && typeof body === 'string') {
    if (body.charAt(0) === ':' && body.charAt(body.length - 1) === ':') {
      return isEmoji(body.substring(1, body.length - 2));
    } else {
      return false;
    }
  } else if (body && body.message && body.message.length === 1) {
    return !!body.message[0].emoji;
  }
  return false;
};

export const getSlashCommand = (body) => {
  let result = {
    isCommand: false,
    command: null,
  };
  let text;
  if (body && typeof body === 'string') {
    text = body;
  } else if (body && body.message && body.message.length) {
    const firstComponent = body.message[0];
    text = firstComponent.text;
  }
  if (text && text.startsWith('/')) {
    result.isCommand = true;
    result.command = text
      .split(' ')[0]
      .substring(1)
      .toLowerCase();
  }
  return result;
};

export const _getAutoCompleteUserAsync = async (text) => {
  let autocompleteResults = await ChatActions.getAutocompleteAsync(text, ['users']);
  let users = autocompleteResults.users;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === text) {
      return users[i];
    }
  }

  return null;
};

const isValidMentionCharacter = (c) => {
  return /[\w\-]/.test(c);
};

const isTerminalMentionCharacter = (c) => {
  return /[\s.,?!:;~()\*]/.test(c);
};

const isInitialMentionIndex = (message, index) => {
  return (
    // must start with @
    message.charAt(index) === '@' &&
    // must be preceded by a mention terminal
    (index == 0 || isTerminalMentionCharacter(message.charAt(index - 1)))
  );
};

// NOTE(jesse): Formats message into an array
// NOTE(jim): The adjustment to this method is:
// emojis no longer need to be handled serverside.
//
// Example: [
//   { text: 'hello' },
//   { userId: '70' },
//   { text: 'world' }
// ]
export const formatMessageAsync = async (message, cache) => {
  let items = [];
  let start = 0;
  let i = 0;

  while (i < message.length) {
    if (isInitialMentionIndex(message, i)) {
      // Try converting all @... words into {userId: 1} items

      // find the end index of the mention
      let j;
      for (j = i + 1; j < message.length; j++) {
        let c = message.charAt(j);
        if (isTerminalMentionCharacter(c)) {
          break;
        }
        if (!isValidMentionCharacter(c)) {
          i = j + 1;
          break;
        }
      }

      if (i < j && (j >= message.length || isTerminalMentionCharacter(message.charAt(j)))) {
        let tag = message.substr(i + 1, j - i - 1);
        let user = cache[tag];

        // NOTE(jim): This is a copy and paste of how
        // this function use to work before. If the user
        // does not exist in the cache (which rarely happens)
        // we try to fetch for that user. Jesse had left
        // this note before.
        if (!user) {
          user = await _getAutoCompleteUserAsync(tag);
        }

        // NOTE(jim): This is new logic June 21, 2019, if both
        // the cache and HTTP lookup fails. We add a tag.
        if (i > start) {
          items.push({
            text: message.substr(start, i - start),
          });
        }

        if (!user) {
          items.push({
            text: tag,
          });
        } else {
          items.push({
            userId: user.userId,
          });
        }

        i = j;
        start = i;
        continue;
      }

      i = j + 1;
    } else if (message.charAt(i) === ':') {
      let j = i + 1;
      while (message.charAt(j) !== ':' && j < message.length) {
        j++;
      }

      let emojiBody = message.substr(i + 1, j - i - 1);
      if (isEmoji(emojiBody)) {
        if (i > start) {
          items.push({
            text: message.substr(start, i - start),
          });
        }

        items.push({
          emoji: emojiBody,
        });

        // +1 for the last :
        i = j + 1;
        start = i;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }

  if (i > start) {
    items.push({ text: message.substr(start, i - start) });
  }

  if (items.length === 0) {
    return '';
  } else if (items.length === 1 && items[0].text) {
    return items[0].text;
  } else {
    return JSON.stringify({
      message: items,
    });
  }
};
