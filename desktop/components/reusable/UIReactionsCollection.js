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
`;

const STYLES_REACTION_ITEM = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 4px 4px 0;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px 6px;
  box-sizing: border-box;
  border: 1px solid transparent;
`;

const STYLES_REACTION_ITEM_SELECTED = css`
  border: 1px solid fuchsia;
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
    reactions: [],
    theme: {
      reactionItemColor: Constants.colors.black,
      reactionItemBackground: '#efefef',
      reactionItemSelectedColor: 'fuchsia',
      reactionItemSelectedBackground: '#feeefe',
    },
    onSelectReaction: (emoji) => {},
  };

  _isEmpty = (reactions) => {
    if (!reactions || !reactions.length) {
      return true;
    }

    // if all entries are empty, the collection is empty
    return !reactions.some(({ userIds }) => userIds.length > 0);
  };

  _getTooltip = (emoji, userIds) => {
    const { viewer, userIdToUser } = this.props;
    let usernames = userIds.map((userId, ii) => {
      let username;
      if (viewer && userId == viewer.userId) {
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
    const theme = {
      ...UIReactionsCollection.defaultProps.theme,
      ...this.props.theme,
    };

    if (this._isEmpty(reactions)) return null;

    return (
      <div className={STYLES_CONTAINER}>
        {reactions.map(({ emoji, userIds }, ii) => {
          const count = userIds.length;
          if (!count) {
            return null;
          }
          const isViewerIncluded = viewer && viewer.userId && userIds.includes(viewer.userId);
          const itemClass = isViewerIncluded
            ? `${STYLES_REACTION_ITEM} ${STYLES_REACTION_ITEM_SELECTED}`
            : STYLES_REACTION_ITEM;
          let itemStyles = {
            color: isViewerIncluded ? theme.reactionItemSelectedColor : theme.reactionItemColor,
            background: isViewerIncluded
              ? theme.reactionItemSelectedBackground
              : theme.reactionItemBackground,
          };
          let onClick;
          if (viewer.isAnonymous) {
            itemStyles.cursor = 'default';
          } else {
            onClick = () => this.props.onSelectReaction(emoji);
          }
          return (
            <Tooltip
              key={`reaction-${ii}`}
              title={this._getTooltip(emoji, userIds)}
              {...TOOLTIP_PROPS}>
              <div className={itemClass} style={itemStyles} onClick={onClick}>
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
