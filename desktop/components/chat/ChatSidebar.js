import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';

import ChatHeader from '~/components/chat/ChatHeader';
import ChatMessages from '~/components/chat/ChatMessages';
import ChatInput from '~/components/chat/ChatInput';

import ChatSidebarHeader from '~/components/chat/ChatSidebarHeader';
import ChatSidebarChannels from '~/components/chat/ChatSidebarChannels';
import ChatSidebarDirectMessages from '~/components/chat/ChatSidebarDirectMessages';
import ChatSidebarNavigation from '~/components/chat/ChatSidebarNavigation';

const STYLES_SIDEBAR = css`
  width: 188px;
  height: 100vh;
  flex-shrink: 0;
  background: ${Constants.REFACTOR_COLORS.elements.channels};
  overflow-y: scroll;
  overflow-wrap: break-word;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_CHAT = css`
  min-width: 25%;
  width: 100%;
  height: 100vh;
  background: ${Constants.REFACTOR_COLORS.elements.body};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const STYLES_FIXED_CHAT = css`
  width: 320px;
  height: 100vh;
  background: ${Constants.REFACTOR_COLORS.elements.body};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

class ChatSidebar extends React.Component {
  state = {
    value: '',
  };

  _handleSignIn = () => {
    alert('Should switch the pane to sign in.');
  };

  _handleSignOut = () => {
    alert('Should sign the user out');
  };

  _handleNavigateToMakeGame = () => {
    alert('Should navigate to making a game');
  };

  _handleNavigateToFeaturedGames = () => {
    alert('Should navigate to featured games');
  };

  _handleNavigateToAllPosts = () => {
    alert('Should navigate to all posts');
  };

  _handleNavigateToHistory = () => {
    alert('Should navigate to history');
  };

  _handleOpenBrowserForDocumentation = () => {
    alert('Should open a browser window to view documentation');
  };

  _handleHideOptions = () => {
    alert('Should hide options');
  };

  _handleShowChannelOptions = () => {
    alert('Should show options available to the user when they click channel options');
  };

  _handleShowDirectMessageOptions = () => {
    alert('Should show direct message options to the user when they click direct message options');
  };

  _handleAddChannel = () => {
    alert('Should add a new channel if you have the privileges');
  };

  _handleHideChannel = () => {
    alert('Should hide the channel from the list on the left');
  };

  // NOTE(jim): Castle admin only for now.
  _handleDeleteChannel = () => {
    alert('Should delete channels');
  };

  // NOTE(jim): Castle admin only for now.
  _handleUpdateChannel = () => {
    alert('Should update the settings on a channel');
  };

  _handleAddDirectMessage = () => {
    alert('Should start new direct messages with a user');
  };

  _handleHideDirectMessages = () => {
    alert('Should hide direct messages from the sidebar');
  };

  // NOTE(jim): Any member of a direct message should be able to permanently delete
  // a DM.
  _handleDeleteDirectMessage = () => {
    alert('Should permanently delete direct message');
  };

  // NOTE(jim): Any member of a direct message should be able to update the settings of a DM.
  _handleUpdateDirectMessage = () => {
    alert('Should update the settings on a direct message');
  };

  _handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleKeyDown = (e) => {
    if (e.which === 13) {
      alert(`Should submit ${this.state.value}`);
      this.setState({ value: '' });
    }
  };

  render() {
    const { currentUser, navigator, navigation, social, chat } = this.props;

    console.log({ currentUser, navigator, navigation, social, chat });

    return (
      <React.Fragment>
        <div className={STYLES_SIDEBAR}>
          <ChatSidebarHeader onLogIn={this._handleSignIn} onSignOut={this._handleSignOut} />
          <ChatSidebarNavigation
            onNavigateToMakeGame={this._handleNavigateToMakeGame}
            onNavigateToFeaturedGames={this._handleNavigateToFeaturedGames}
            onNavigateToAllPosts={this._handleNavigateToAllPosts}
            onNavigateToHistory={this._handleNavigateToHistory}
            onOpenBrowserForDocumentation={this._handleOpenBrowserForDocumentation}
          />
          <ChatSidebarChannels
            onHideOptions={this._handleHideOptions}
            onShowOptions={this._handleShowChannelOptions}
            onAddChannel={this._handleAddChannel}
            onHideChannel={this._handleHideChannel}
            onDeleteChannel={this._handleDeleteChannel}
            onUpdateChannel={this._handleUpdateChannel}
          />
          <ChatSidebarDirectMessages
            onHideOptions={this._handleHideOptions}
            onShowOptions={this._handleShowDirectMessageOptions}
            onAddDirectMessage={this._handleAddDirectMessage}
            onHideDirectMessage={this._handleHideDirectMessages}
            onDeleteDirectMessage={this._handleDeleteDirectMessage}
            onUpdateDirectMessage={this._handleUpdateDirectMessage}
          />
        </div>
        <div className={navigation.contentMode !== 'game' ? STYLES_CHAT : STYLES_FIXED_CHAT}>
          <ChatHeader />
          <ChatMessages />
          <ChatInput
            value={this.state.value}
            name="value"
            placeholder="Type a message"
            onChange={this._handleChange}
            onKeyDown={this._handleKeyDown}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default class ChatSidebarWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => {
          return (
            <SocialContext.Consumer>
              {(social) => {
                return (
                  <ChatContext.Consumer>
                    {(chat) => {
                      return (
                        <NavigationContext.Consumer>
                          {(navigation) => {
                            return (
                              <NavigatorContext.Consumer>
                                {(navigator) => (
                                  <ChatSidebar
                                    currentUser={currentUser}
                                    navigator={navigator}
                                    navigation={navigation}
                                    social={social}
                                    chat={chat}
                                  />
                                )}
                              </NavigatorContext.Consumer>
                            );
                          }}
                        </NavigationContext.Consumer>
                      );
                    }}
                  </ChatContext.Consumer>
                );
              }}
            </SocialContext.Consumer>
          );
        }}
      </CurrentUserContext.Consumer>
    );
  }
}
