import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { getEmojiComponent } from '~/common/emoji/emoji-utilities';
import { Tooltip } from 'react-tippy';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

const STYLES_CONTAINER = css`
  display: flex;
  flex-wrap: wrap;
  padding: 4px 0;
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
  margin: 0 4px 4px 0;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 6px;
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

const TOOLTIP_PROPS = {
  arrow: true,
  duration: 170,
  animation: 'fade',
  hideOnClick: false,
};

class UIReactionsCollection extends React.Component {
  static defaultProps = {
    viewer: null,
    userIdToUser: {},
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

  _getTooltip = (emoji, userIds) => {
    const { viewer, userIdToUser } = this.props;
    let usernames = userIds.map((userId, ii) => {
      let username;
      if (userId == viewer.userId) {
        username = 'you';
      } else {
        const user = userIdToUser[userId];
        username = user && user.username ? user.username : 'anonymous';
      }
      if (userIds.length > 1 && ii == userIds.length - 1) {
        username = `and ${username}`;
      }
      return username;
    });
    const usernamesList = usernames.length == 2 ? usernames.join(' ') : usernames.join(', ');
    return `${usernamesList} reacted with :${emoji}:`;
  };

  render() {
    const { reactions, viewer } = this.props;

    if (this._isEmpty(reactions)) return null;

    return (
      <div className={STYLES_CONTAINER}>
        {Object.entries(reactions).map(([emoji, userIds], ii) => {
          const count = userIds.length;
          if (!count) {
            return null;
          }
          const itemStyles =
            viewer && viewer.userId && userIds.includes(viewer.userId)
              ? `${STYLES_REACTION_ITEM} ${STYLES_REACTION_ITEM_SELECTED}`
              : STYLES_REACTION_ITEM;
          return (
            <Tooltip title={this._getTooltip(emoji, userIds)} {...TOOLTIP_PROPS}>
              <div
                key={`reaction-${ii}`}
                className={itemStyles}
                onClick={() => this.props.onSelectReaction(emoji)}>
                {getEmojiComponent(emoji, 15)}
                <span className={STYLES_REACTION_COUNT}>{count}</span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    );
  }
}

export default class UIReactionsCollectionWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <UserPresenceContext.Consumer>
            {(userPresence) => (
              <UIReactionsCollection
                viewer={currentUser.user}
                userIdToUser={userPresence.userIdToUser}
                {...this.props}
              />
            )}
          </UserPresenceContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
