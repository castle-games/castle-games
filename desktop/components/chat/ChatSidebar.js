import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Constants from '~/common/constants';
import * as LayoutUtilities from '~/common/layout-utilities';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';

import ChatHeader from '~/components/chat/ChatHeader';
import ChatHeaderActive from '~/components/chat/ChatHeaderActive';
import ChatMessages from '~/components/chat/ChatMessages';
import ChatMembers from '~/components/chat/ChatMembers';
import ChatInput from '~/components/chat/ChatInput';
import ChatOptions from '~/components/chat/ChatOptions';

import ChatSidebarOptions from '~/components/chat/ChatSidebarOptions';
import ChatSidebarOptionsChannels from '~/components/chat/ChatSidebarOptionsChannels';
import ChatSidebarOptionsMessages from '~/components/chat/ChatSidebarOptionsMessages';

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
  width: 420px;
  height: 100vh;
  flex-shrink: 0;
  background: ${Constants.REFACTOR_COLORS.elements.body};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

class ChatSidebar extends React.Component {
  state = {
    value: '',
    mode: 'DEFAULT',
    chatMode: 'MESSAGES',
  };

  _handleSignIn = () => {
    alert('_handleSignIn');
  };

  _handleSignOut = () => {
    alert('_handleSignOut');
  };

  _handleNavigateToMakeGame = () => {
    alert('_handleNavigateToMakeGame');
  };

  _handleNavigateToFeaturedGames = () => {
    alert('_handleNavigateToFeaturedGames');
  };

  _handleNavigateToAllPosts = () => {
    alert('_handleNavigateToAllPosts');
  };

  _handleNavigateToHistory = () => {
    alert('_handleNavigateToHistory');
  };

  _handleOpenBrowserForDocumentation = () => {
    alert('_handleOpenBrowserForDocumentation');
  };

  _handleShowSingleChannelMembers = () => this.setState({ chatMode: 'MEMBERS' });

  _handleShowSingleChannelOptions = () => this.setState({ chatMode: 'OPTIONS' });

  _handleShowOptions = () => this.setState({ mode: 'OPTIONS' });

  _handleShowChannelOptions = () => this.setState({ mode: 'OPTIONS_CHANNELS' });

  _handleShowDirectMessageOptions = () => this.setState({ mode: 'OPTIONS_MESSAGES' });

  _handleHideOptions = () => this.setState({ mode: 'DEFAULT' });

  _handleResetChatWindow = () => this.setState({ chatMode: 'MESSAGES' });

  _handleAddChannel = () => {
    alert('_handleAddChannel');
  };

  _handleHideChannel = () => {
    alert('_handleHideChannel');
  };

  // NOTE(jim): Castle admin only for now.
  _handleDeleteChannel = () => {
    alert('_handleDeleteChannel');
  };

  // NOTE(jim): Castle admin only for now.
  _handleUpdateChannel = () => {
    alert('_handleUpdateChannel');
  };

  _handleAddDirectMessage = () => {
    alert('_handleAddDirectMessage');
  };

  _handleHideDirectMessages = () => {
    alert('_handleHideDirectMessage');
  };

  // NOTE(jim): Any member of a direct message should be able to permanently delete
  // a DM.
  _handleDeleteDirectMessage = () => {
    alert('_handleDeleteDirectMessage');
  };

  // NOTE(jim): Any member of a direct message should be able to update the settings of a DM.
  _handleUpdateDirectMessage = () => {
    alert('_handleUpdateDirectMessage');
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

  _renderRootSidebar = () => {
    return (
      <div className={STYLES_SIDEBAR}>
        <ChatSidebarHeader
          onShowOptions={this._handleShowOptions}
          onLogIn={this._handleSignIn}
          onSignOut={this._handleSignOut}
        />
        <ChatSidebarNavigation
          onNavigateToMakeGame={this._handleNavigateToMakeGame}
          onNavigateToFeaturedGames={this._handleNavigateToFeaturedGames}
          onNavigateToAllPosts={this._handleNavigateToAllPosts}
          onNavigateToHistory={this._handleNavigateToHistory}
          onOpenBrowserForDocumentation={this._handleOpenBrowserForDocumentation}
        />
        <ChatSidebarChannels
          onShowOptions={this._handleShowChannelOptions}
          onAddChannel={this._handleAddChannel}
          onHideChannel={this._handleHideChannel}
          onDeleteChannel={this._handleDeleteChannel}
          onUpdateChannel={this._handleUpdateChannel}
        />
        <ChatSidebarDirectMessages
          onShowOptions={this._handleShowDirectMessageOptions}
          onAddDirectMessage={this._handleAddDirectMessage}
          onHideDirectMessage={this._handleHideDirectMessages}
          onDeleteDirectMessage={this._handleDeleteDirectMessage}
          onUpdateDirectMessage={this._handleUpdateDirectMessage}
        />
      </div>
    );
  };

  _renderOptions = () => {
    return (
      <div className={STYLES_SIDEBAR}>
        <ChatSidebarOptions onDismiss={this._handleHideOptions} />
      </div>
    );
  };

  _renderMessageOptions = () => {
    return (
      <div className={STYLES_SIDEBAR}>
        <ChatSidebarOptionsMessages onDismiss={this._handleHideOptions} />
      </div>
    );
  };

  _renderChannelOptions = () => {
    return (
      <div className={STYLES_SIDEBAR}>
        <ChatSidebarOptionsChannels onDismiss={this._handleHideOptions} />
      </div>
    );
  };

  _renderChat = () => {
    const { navigation } = this.props;
    const layoutMode = LayoutUtilities.getLayoutMode(navigation.contentMode);
    const className = layoutMode === 'FLUID_CHAT' ? STYLES_CHAT : STYLES_FIXED_CHAT;

    if (this.state.chatMode === 'OPTIONS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Settings
          </ChatHeaderActive>
          <ChatOptions />
        </div>
      );
    }

    if (this.state.chatMode === 'MEMBERS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Members
          </ChatHeaderActive>
          <ChatMembers />
        </div>
      );
    }

    if (this.state.chatMode === 'MESSAGES') {
      return (
        <div className={className}>
          <ChatHeader
            onSettingsClick={this._handleShowSingleChannelOptions}
            onMembersClick={this._handleShowSingleChannelMembers}
          />
          <ChatMessages />
          <ChatInput
            value={this.state.value}
            name="value"
            placeholder="Type a message"
            onChange={this._handleChange}
            onKeyDown={this._handleKeyDown}
          />
        </div>
      );
    }
  };

  render() {
    const { currentUser, navigator, navigation, social, chat } = this.props;

    const chatElement = this._renderChat();
    const layoutMode = LayoutUtilities.getLayoutMode(navigation.contentMode);

    let sidebarElement = this._renderRootSidebar();
    if (this.state.mode === 'OPTIONS') {
      sidebarElement = this._renderOptions();
    }

    if (this.state.mode === 'OPTIONS_CHANNELS') {
      sidebarElement = this._renderChannelOptions();
    }

    if (this.state.mode === 'OPTIONS_MESSAGES') {
      sidebarElement = this._renderMessageOptions();
    }

    return (
      <React.Fragment>
        {sidebarElement}
        {chatElement}
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
