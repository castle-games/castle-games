import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatMessageHeader from '~/components/chat/ChatMessageHeader';
import UIAvatar from '~/components/reusable/UIAvatar';
import UIMessageBody from '~/components/reusable/UIMessageBody';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 0 24px 4px 16px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  height: 1px;
`;

const STYLES_RIGHT = css`
  padding-left: 8px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 16px;
  font-size: 12px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const ChatMessageElement = ({
  showAuthor = true,
  theme = {},
  message,
  isEmojiMessage,
  size = 40,
  onNavigateToUserProfile,
  user,
  style,
  expandAttachments,
  onSelectReaction,
}) => {
  const styles = {
    paddingTop: showAuthor ? '8px' : null,
  };
  let leftElement;
  if (showAuthor) {
    leftElement = (
      <UIAvatar
        onClick={() => onNavigateToUserProfile(user)}
        style={{ width: size, height: size }}
        showIndicator={false}
        src={user.photo ? user.photo.url : null}
      />
    );
  } else {
    leftElement = <span className={STYLES_LEFT} style={{ width: size }} />;
  }

  return (
    <div className={STYLES_CONTAINER} style={{ ...styles, ...style }}>
      {leftElement}
      <span className={STYLES_RIGHT}>
        {showAuthor ? (
          <ChatMessageHeader
            author={user.username}
            timestamp={message.timestamp}
            theme={theme}
            onClick={() => onNavigateToUserProfile(user)}
          />
        ) : null}
        <div
          className={STYLES_AUTHOR_MESSAGE}
          style={{
            color: theme.textColor,
            fontSize: isEmojiMessage ? '40px' : theme.bodySize,
            lineHeight: isEmojiMessage ? '48px' : theme.bodyLineHeight,
            marginTop: showAuthor ? '2px' : null,
          }}>
          <UIMessageBody
            body={message.body}
            reactions={message.reactions}
            theme={theme}
            expandAttachments={expandAttachments}
            isEdited={message.isEdited}
            onSelectReaction={onSelectReaction}
          />
        </div>
      </span>
    </div>
  );
}

export default ChatMessageElement;
