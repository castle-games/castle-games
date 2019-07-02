import * as React from 'react';
import * as Actions from '~/common/actions';

import { isEmoji, emojiToString } from '~/common/emojis';

export const isEmojiBody = (body) => {
  if (body && typeof body === 'string') {
    return isEmoji(body);
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
  let autocompleteResults = await Actions.getAutocompleteAsync(text);
  let users = autocompleteResults.users;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === text) {
      return users[i];
    }
  }

  return null;
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
    if (message.charAt(i) === '@') {
      // Try converting all @... words into {userId: 1} items
      if (i > 0 && !/\s/.test(message.charAt(i - 1))) {
        i++;
        continue;
      }

      let j;
      for (j = i + 1; j < message.length; j++) {
        let c = message.charAt(j);

        let isUserTagValue =
          (c >= '0' && c <= '9') ||
          (c >= 'a' && c <= 'z') ||
          (c >= 'A' && c <= 'Z') ||
          c === '-' ||
          c === '_' ||
          c === '/';

        if (/\s/.test(c)) {
          break;
        }

        if (!isUserTagValue) {
          i = j + 1;
          continue;
        }
      }

      if (j >= message.length || /\s/.test(message.charAt(j))) {
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
