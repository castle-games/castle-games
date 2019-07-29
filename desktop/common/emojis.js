import * as React from 'react';

import EmojisJSON from 'emoji-datasource';
import SpriteSheet from 'emoji-datasource/img/twitter/sheets/32.png';

export const SHORT_NAME_TO_OBJECT = {};
const NUM_BLOCKS = 52;
const SHORT_NAMES = [];

const MAX_AUTOCOMPLETE_RESULTS = 10;

const ALIAS = {};
ALIAS['+1'] = ['thumbsup'];
ALIAS['-1'] = ['thumbsdown'];

for (let i = 0; i < EmojisJSON.length; i++) {
  let emoji = EmojisJSON[i];
  SHORT_NAME_TO_OBJECT[emoji.short_name] = emoji;
  SHORT_NAMES.push(emoji.short_name);

  if (ALIAS[emoji.short_name]) {
    for (let j = 0, n = ALIAS[emoji.short_name].length; j < n; j++) {
      const a = ALIAS[emoji.short_name][j];
      SHORT_NAME_TO_OBJECT[a] = emoji;
      SHORT_NAMES.push(a);
    }
  }
}

export function autocompleteShortNames(prefix) {
  if (!prefix) return [];
  const prefixQuery = prefix.toLowerCase().trim();
  if (!prefixQuery.length) return [];
  let result = SHORT_NAMES.filter((name) => name.startsWith(prefix));
  if (result.length > MAX_AUTOCOMPLETE_RESULTS) {
    result.splice(MAX_AUTOCOMPLETE_RESULTS);
  }
  return result;
}

export function isEmoji(text) {
  return !!SHORT_NAME_TO_OBJECT[text];
}

export function getEmojiComponent(text, size = 20) {
  let emoji = SHORT_NAME_TO_OBJECT[text];
  let px = emoji.sheet_x;
  let py = emoji.sheet_y;

  var style = {
    display: 'inline-block',
    backgroundImage: `url(${SpriteSheet})`,
    backgroundPosition: `left -${px * size}px top -${py * size}px`,
    backgroundSize: `${size * NUM_BLOCKS}px ${size * NUM_BLOCKS}px`,
    width: `${size}px`,
    height: `${size}px`,
    verticalAlign: 'middle',
  };

  return <span style={style} />;
}

export function emojiToString(text) {
  let emoji = SHORT_NAME_TO_OBJECT[text];
  if (!emoji || !emoji.unified) {
    return '';
  }

  try {
    return String.fromCodePoint.apply(
      this,
      emoji.unified.split('-').map((codePoint) => parseInt(codePoint, 16))
    );
  } catch (e) {
    return '';
  }
}
