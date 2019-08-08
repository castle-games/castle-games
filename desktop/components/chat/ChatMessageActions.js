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
  color: #333;
  background: ${Constants.colors.white};
`;

export default class ChatMessageActions extends React.Component {
  static defaultProps = {
    isEditable: false,
    isReactable: false,
    onSelectEdit: () => {},
    onSelectReaction: () => {},
  };

  render() {
    const { isEditable, isReactable } = this.props;
    let editElement;
    if (isEditable) {
      editElement = (
        <div className={STYLES_ACTION} onClick={this.props.onSelectEdit}>
          <SVG.Edit size="16" />
        </div>
      );
    }
    let reactionElement;
    if (isReactable) {
      reactionElement = (
        <div className={STYLES_ACTION} onClick={this.props.onSelectReaction}>
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
}
