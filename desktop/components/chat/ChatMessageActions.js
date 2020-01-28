import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_ACTION = css`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  margin-left: 4px;
  border-radius: 2px;
  border: 1px solid #d6d6d6;
`;

const DEFAULT_THEME = {
  actionItemColor: '#333',
  actionItemBackground: Constants.colors.white,
};

const ChatMessageActions = ({
  isEditable = false,
  isReactable = false,
  theme = DEFAULT_THEME,
  onSelectEdit = () => {},
  onSelectReaction = () => {},
}) => {
  theme = { ...DEFAULT_THEME, ...theme };
  const styles = { background: theme.actionItemBackground, color: theme.actionItemColor };
  let editElement;
  if (isEditable) {
    editElement = (
      <div className={STYLES_ACTION} style={styles} onClick={onSelectEdit}>
        <SVG.Edit size="16" />
      </div>
    );
  }
  let reactionElement;
  if (isReactable) {
    reactionElement = (
      <div className={STYLES_ACTION} style={styles} onClick={onSelectReaction}>
        <SVG.ChatEmojiPicker size="16" />
      </div>
    );
  }
  return (
    <React.Fragment>
      {reactionElement}
      {editElement}
    </React.Fragment>
  );
}

export default ChatMessageActions;
