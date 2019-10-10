import * as React from 'react';
import * as Actions from '~/common/actions';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { ChatContext } from '~/contexts/ChatContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatMembers from '~/components/chat/ChatMembers';
import GameMetaHeader from '~/components/gamemeta/GameMetaHeader';
import UIHorizontalNavigation from '~/components/reusable/UIHorizontalNavigation';
import UIPostList from '~/components/reusable/UIPostList';

const STYLES_CONTAINER = css`
  width: 100%;
  min-width: 40%;
  background: ${Constants.colors.white};
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 24px;
`;

const STYLES_CONTENT_CONTAINER = css`
  width: 100%;
  padding: 16px 0;
`;

const STYLES_EMPTY_CONTENT = css`
  color: ${Constants.REFACTOR_COLORS.subdued};
  padding: 0 16px;
`;

const STYLES_MEMBERS = css`
  padding: 0 16px;
`;

class GameMetaScreen extends React.Component {
  state = {
    mode: 'posts',
    posts: [],
  };

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  componentDidMount() {
    this._update(null, null);
  }

  _update = async (prevProps) => {
    const prevGameId = prevProps && prevProps.game ? prevProps.game.gameId : null;
    const gameId = this.props.game ? this.props.game.gameId : null;
    if (gameId && gameId !== prevGameId) {
      const posts = await Actions.postsForGameId(gameId);
      this.setState({ posts });
    }
  };

  _getNavigationItems = () => {
    const { chat, game, channel } = this.props;
    let items = [];
    if (this.state.posts) {
      items.push({ label: 'Activity', key: 'posts' });
    }
    if (channel) {
      const numChannelMembers = chat.channelOnlineCounts[channel.channelId];
      if (numChannelMembers) {
        items.push({ label: `People Online (${numChannelMembers})`, key: 'members' });
      }
    }

    return items;
  };

  _handleNavigationChange = (selectedKey) => {
    this.setState({ mode: selectedKey });
  };

  _handleOpenDirectMessage = (user) => {
    this.props.chat.openChannelForUser(user);
  };

  _navigateToGame = async (game, options) => {
    await this.props.navigator.navigateToGame(game, { ...options, launchSource: 'game-meta' });
  };

  _renderContent = (channel, mode) => {
    switch (mode) {
      case 'members':
        if (channel) {
          const onlineUserIds = this.props.chat.channelOnlineUserIds[channel.channelId];
          return (
            <div className={STYLES_MEMBERS}>
              <ChatMembers userIds={onlineUserIds} onSendMessage={this._handleOpenDirectMessage} />
            </div>
          );
        } else {
          return null;
        }
      case 'posts':
      default:
        if (this.state.posts && this.state.posts.length) {
          return (
            <UIPostList
              posts={this.state.posts}
              navigator={this.props.navigator}
              onUserSelect={this.props.navigator.navigateToUserProfile}
              onGameSelect={this._navigateToGame}
            />
          );
        } else {
          return (
            <span className={STYLES_EMPTY_CONTENT}>
              This game has no recent activity. Play it and let the creator know what you think!
            </span>
          );
        }
    }
  };

  render() {
    const { mode } = this.state;
    const { channel, game } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <GameMetaHeader
          game={game}
          onSelectGame={this._navigateToGame}
          onSelectUser={this.props.navigator.navigateToUserProfile}
        />
        <div
          className={css`
            display: block;
            width: 100%;
          `}>
          <UIHorizontalNavigation
            items={this._getNavigationItems()}
            onChange={this._handleNavigationChange}
            selectedKey={mode}
            style={{ borderBottom: `2px solid #ececec`, width: '100%' }}
          />
          <div className={STYLES_CONTENT_CONTAINER}>{this._renderContent(channel, mode)}</div>
        </div>
      </div>
    );
  }
}

export default class GameMetaScreenWithContext extends React.Component {
  render() {
    return (
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <ChatContext.Consumer>
            {(chat) => (
              <NavigationContext.Consumer>
                {(navigation) => (
                  <NavigatorContext.Consumer>
                    {(navigator) => {
                      const channel = navigation.content.gameMetaShown
                        ? chat.channels[navigation.content.gameMetaShown.chatChannelId]
                        : null;
                      return (
                        <GameMetaScreen
                          navigator={navigator}
                          game={navigation.content.gameMetaShown}
                          userIdToUser={userPresence.userIdToUser}
                          chat={chat}
                          channel={channel}
                        />
                      );
                    }}
                  </NavigatorContext.Consumer>
                )}
              </NavigationContext.Consumer>
            )}
          </ChatContext.Consumer>
        )}
      </UserPresenceContext.Consumer>
    );
  }
}
