import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { getEmojiComponent } from '~/common/emoji/emoji-utilities';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
  padding: 4px;
  font-size: 14px;
  line-height: 18px;
  font-style: normal;
  font: ${Constants.REFACTOR_FONTS.system};
  color: ${Constants.colors.black};
`;

const STYLES_REACTION_ITEM = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #efefef;
  margin: 0 4px 0 4px;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 6px;
`;

const STYLES_REACTION_ITEM_SELECTED = css`
  border: 1px solid fuchsia;
  background: #feeefe;
  color: fuchsia;
`;

const STYLES_REACTION_COUNT = css`
  font-size: 10px;
  font-weight: 600;
  margin-left: 4px;
`;

export default class UIReactionsCollection extends React.Component {
  static contextType = CurrentUserContext;
  static defaultProps = {
    reactions: {},
    onSelectReaction: (emoji) => {},
  };

  _isEmpty = (reactions) => {
    if (!reactions) {
      return true;
    }

    const pairs = Object.entries(reactions);
    if (!pairs.length) {
      return true;
    }

    // if all entries are empty, the collection is empty
    return !pairs.some(([_, userIds]) => userIds.length > 0);
  };

  render() {
    const { reactions } = this.props;
    const { user } = this.context;

    if (this._isEmpty(reactions)) return null;

    return (
      <div className={STYLES_CONTAINER}>
        {Object.entries(reactions).map(([emoji, userIds]) => {
          const itemStyles =
            user && user.userId && userIds.includes(user.userId)
              ? `${STYLES_REACTION_ITEM} ${STYLES_REACTION_ITEM_SELECTED}`
              : STYLES_REACTION_ITEM;
          return (
            <div className={itemStyles} onClick={() => this.props.onSelectReaction(emoji)}>
              {getEmojiComponent(emoji, 15)}
              <span className={STYLES_REACTION_COUNT}>{userIds.length}</span>
            </div>
          );
        })}
      </div>
    );
  }
}
