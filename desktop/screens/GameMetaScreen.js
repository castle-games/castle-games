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

const STYLES_CONTAINER = css`
  width: 100%;
  min-width: 10
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
`;

const STYLES_CONTENT_CONTAINER = css`
  width: 100%;
  padding: 16px 0;
`;

const STYLES_SETTING = css`
  span {
    color: magenta;
    text-decoration: underline;
    cursor: pointer;
  }
`;

class GameMetaScreen extends React.Component {
  state = {
    mode: 'members',
  };

  _getNavigationItems = () => {
    const { chat, game, channel } = this.props;
    let items = [];
    if (channel) {
      const numChannelMembers = chat.channelOnlineCounts[channel.channelId];
      items.push({ label: `People Online (${numChannelMembers})`, key: 'members' });
    }

    return items;
  };

  _handleNavigationChange = (selectedKey) => {
    this.setState({ mode: selectedKey });
  };

  _handleOpenDirectMessage = (user) => {
    this.props.chat.openChannelForUser(user);
  };

  _renderContent = (channel, mode) => {
    switch (mode) {
      case 'members':
      default:
        if (channel) {
          const onlineUserIds = this.props.chat.channelOnlineUserIds[channel.channelId];
          return (
            <ChatMembers userIds={onlineUserIds} onSendMessage={this._handleOpenDirectMessage} />
          );
        } else {
          return null;
        }
    }
  };

  render() {
    const { mode } = this.state;
    const { channel, game } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div
          className={css`
            width: 768px;
            max-width: 768px;
            margin-top: 24px;
          `}>
          <GameMetaHeader
            game={game}
            onSelectGame={this.props.navigator.navigateToGame}
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
            {this._renderContent(channel, mode)}
          </div>
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
                      const channel = navigation.gameMetaShown
                        ? chat.channels[navigation.gameMetaShown.chatChannelId]
                        : null;
                      return (
                        <GameMetaScreen
                          navigator={navigator}
                          game={navigation.gameMetaShown}
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
