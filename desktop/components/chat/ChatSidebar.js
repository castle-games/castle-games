import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Constants from '~/common/constants';
import * as LayoutUtilities from '~/common/layout-utilities';
import * as NativeUtil from '~/native/nativeutil';

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
    return this.props.navigator.navigateToSignIn();
  };

  _handleSignOut = () => {
    this.props.currentUser.clearCurrentUser();
    this.setState({ mode: 'DEFAULT', chatMode: 'MESSAGES' });
  };

  _handleNavigateToMakeGame = () => {
    return this.props.navigator.navigateToCreate();
  };

  _handleNavigateToFeaturedGames = () => {
    return this.props.navigator.navigateToHome();
  };

  _handleNavigateToAllPosts = () => {
    return this.props.navigator.navigateToHome();
  };

  _handleNavigateToHistory = () => {
    return this.props.navigator.navigateToNotifications();
  };

  _handleOpenBrowserForDocumentation = () => {
    return NativeUtil.openExternalURL(`${Constants.WEB_HOST}/documentation`);
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
          viewer={this.props.viewer}
          navigator={this.props.navigator}
          onShowOptions={this._handleShowOptions}
          onSignIn={this._handleSignIn}
          onSignOut={this._handleSignOut}
        />
        <ChatSidebarNavigation
          viewer={this.props.viewer}
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
          viewer={this.props.viewer}
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
        <ChatSidebarOptions onDismiss={this._handleHideOptions} onSignOut={this._handleSignOut} />
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
    const { chatMode } = this.state;
    const { navigation } = this.props;
    const layoutMode = LayoutUtilities.getLayoutMode(navigation.contentMode);
    const className = layoutMode === 'FLUID_CHAT' ? STYLES_CHAT : STYLES_FIXED_CHAT;

    if (chatMode === 'OPTIONS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Settings
          </ChatHeaderActive>
          <ChatOptions />
        </div>
      );
    }

    if (chatMode === 'MEMBERS') {
      return (
        <div className={className}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Members
          </ChatHeaderActive>
          <ChatMembers />
        </div>
      );
    }

    if (chatMode === 'MESSAGES') {
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
    const { mode } = this.state;
    const chatElement = this._renderChat();

    let sidebarElement = this._renderRootSidebar();
    if (mode === 'OPTIONS') {
      sidebarElement = this._renderOptions();
    }

    if (mode === 'OPTIONS_CHANNELS') {
      sidebarElement = this._renderChannelOptions();
    }

    if (mode === 'OPTIONS_MESSAGES') {
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
                                    viewer={currentUser.user}
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
