import * as React from 'react';
import * as Actions from '~/common/actions';
import * as URLS from '~/common/urls';
import * as Constants from '~/common/constants';

import { isEmoji, emojiToString } from '~/common/emojis';
import { css } from 'react-emotion';

import StringReplace from 'react-string-replace';
import ChatPost from '~/components/chat/ChatPost';

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const STYLES_MENTION = css`
  font-weight: 600;
  color: #0062ff;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_CHANNEL = css`
  font-weight: 600;
  color: magenta;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_ANCHOR = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-weight: 600;
  text-decoration: underline;
  :hover {
    color: ${Constants.REFACTOR_COLORS.text};
  }
  :visited {
    color: ${Constants.REFACTOR_COLORS.text};
  }
`;

export const matchEmoji = (text) => {
  return StringReplace(text, /(:(?![\n])[()#$@-\w]+:)/g, (match, i) => {
    const emojiString = replaceAll(match, ':' , '');

    let emoji;
    if (isEmoji(emojiString)) {
      emoji = emojiToString(emojiString);
    }

    return <span key={`chat-emoji-${match + i}`}>{emoji}</span>;
  });
}

export const matchURL = (text, social, navigator) => {
  return StringReplace(text, /(https?:\/\/\S+)/g, (match, i) => {
    const urlData = URLS.getCastleUrlInfo(match);
    if (urlData.type) {
      return (
        <ChatPost
          key={`chat-embed-${match + i}`}
          social={social}
          message={{ text: match }}
          navigator={navigator}
          urlData={urlData}
        />
      );
    }

    return (
      <a className={STYLES_ANCHOR} key={match + i} href={match}>
        {match}
      </a>
    );
  });
};

export const matchMention = (text, onClick) => {
  return StringReplace(text, /@([a-zA-Z0-9_-]+)/g, (match, i) => (
    <span className={STYLES_MENTION} key={match + i} onClick={() => onClick({ username: match })}>
      @{match}
    </span>
  ));
};

export const matchChannel = (text, onClick) => {
  return StringReplace(text, /#([a-zA-Z0-9_-]+)/g, (match, i) => (
    <span className={STYLES_CHANNEL} key={match + i} onClick={() => onClick({ name: match })}>
      #{match}
    </span>
  ));
};

async function _getAutocompleteUserAsync(text) {
  let autocompleteResults = await Actions.getAutocompleteAsync(text);
  let users = autocompleteResults.users;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === text) {
      return users[i];
    }
  }

  return null;
}

/*
Formats messages into an object that looks like:
{
  message: [
    {
      text: 'this is some text',
    },
    {
      emoji: 'smile',
    },
    {
      userId: 1,
    },
  ]
}

If the message has no users or emojis, it is sent as plain text.
*/
export async function formatMessageAsync(message, autocompleteCache) {
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
        let user = autocompleteCache.users[tag];

        // This should not be needed most of the time
        if (!user) {
          user = await _getAutocompleteUserAsync(tag);
        }

        if (user) {
          if (i > start) {
            items.push({
              text: message.substr(start, i - start),
            });
          }

          items.push({
            userId: user.userId,
          });

          i = j;
          start = i;
          continue;
        }
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
}

export function convertToRichMessage(message) {
  let plainTextMessage = {
    message: [
      {
        text: message,
      },
    ],
  };

  if (message.charAt(0) !== '{') {
    return plainTextMessage;
  } else {
    try {
      return JSON.parse(message);
    } catch (e) {
      return plainTextMessage;
    }
  }
}

export function messageToString(message, social) {
  let txt = '';

  for (let i = 0; i < message.richMessage.message.length; i++) {
    let messagePart = message.richMessage.message[i];

    if (messagePart.text) {
      txt += messagePart.text;
    } else if (messagePart.userId) {
      if (social.userIdToUser[messagePart.userId]) {
        txt += `@${social.userIdToUser[messagePart.userId].username}`;
      }
    } else if (messagePart.emoji) {
      txt += emojiToString(messagePart.emoji);
    }
  }

  return txt;
}
