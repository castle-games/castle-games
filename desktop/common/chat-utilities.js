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

export const matchCastleURL = (text, social, navigator) => {
  return StringReplace(text, /(castle:\/\/\S+)/g, (match, i) => {
    const urlData = URLS.getCastleUrlInfo(match);
    if (urlData.type) {
      return (
        <ChatPost
          key={`castle-chat-embed-${match + i}`}
          social={social}
          message={{ text: match }}
          navigator={navigator}
          urlData={urlData}
        />
      );
    }

    return (
      <a className={STYLES_ANCHOR} key={`castle-anchor-${match + i}`} href={match}>
        {match}
      </a>
    );
  });
};

export const matchURL = (text, social, navigator) => {
  return StringReplace(text, /(https?:\/\/\S+)/g, (match, i) => {
    const urlData = URLS.getCastleUrlInfo(match);
    if (urlData.type) {
      return (
        <ChatPost
          key={`url-chat-embed-${match + i}`}
          social={social}
          message={{ text: match }}
          navigator={navigator}
          urlData={urlData}
        />
      );
    }

    return (
      <a className={STYLES_ANCHOR} key={`url-${match + i}`} href={match}>
        {match}
      </a>
    );
  });
};

export const matchMention = (text, onClick) => {
  return StringReplace(text, /@([a-zA-Z0-9_-]+)/g, (match, i) => (
    <span
      className={STYLES_MENTION}
      key={`mention-${match + i}`}
      onClick={() => onClick({ username: match })}>
      @{match}
    </span>
  ));
};

export const matchChannel = (text, onClick) => {
  return StringReplace(text, /#([a-zA-Z0-9_-]+)/g, (match, i) => (
    <span
      className={STYLES_CHANNEL}
      key={`channel-${match + i}`}
      onClick={() => onClick({ name: match })}>
      #{match}
    </span>
  ));
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
