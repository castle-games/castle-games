import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

const STYLES_AUTHOR_TIMESTAMP = css`
  margin-top: 2px;
  font-size: 12px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_AUTHOR = css`
  cursor: pointer;
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
  line-height: 12px;
  display: inline-block;
  cursor: default;
`;

const ChatMessageHeader = ({
  author = null,
  timestamp = null,
  theme = {},
  onClick = null,
}) => {
  return (
    <div
      className={STYLES_AUTHOR_TIMESTAMP}
      style={{ color: theme.textColor, fontSize: theme.bylineSize }}>
      <span className={STYLES_AUTHOR} onClick={onClick}>
        {author}
      </span>
      <span className={STYLES_TIMESTAMP}>{Strings.toChatTime(timestamp)}</span>
    </div>
  );
}

export default ChatMessageHeader;
