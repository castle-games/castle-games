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

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  min-width: 10%;
  height: 100vh;
  transition: 200ms ease width;
`;

const STYLES_TOP = css`
  min-height: 10%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_BOTTOM = css`
  flex-shrink: 0;
  height: 32px;
  width: 100%;
  background: ${Constants.REFACTOR_COLORS.elements.bottomBar};
  display: flex;
  align-items: center;
  padding: 0 16px 0 16px;
`;

const STYLES_SIDEBAR = css`
  width: 188px;
  height: 100%;
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
  height: 100%;
  background: ${Constants.REFACTOR_COLORS.elements.body};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const getContainerWidth = ({ chat, sidebar }) => {
  if (sidebar && !chat) {
    return `224px`;
  }

  return `480px`;
};

const getSidebarStyles = ({ chat, sidebar }) => {
  return { width: sidebar && !chat ? '100%' : null };
};

class ChatSidebar extends React.Component {
  state = {
    value: '',
    mode: 'DEFAULT',
    chatMode: 'MESSAGES',
    chat: true,
    sidebar: true,
  };

  _handleToggleChat = () => {
    const next = !this.state.chat;
    this.setState({ chat: next, sidebar: next ? this.state.sidebar : true });
  };

  _handleToggleSidebar = () => {
    const next = !this.state.sidebar;
    this.setState({
      sidebar: next,
      chat: next ? this.state.chat : true,
    });
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

  _handleStartDirectMessage = () => {
    alert('_handleStartDirectMessage');
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
    const { navigation, navigator, viewer } = this.props;

    return (
      <div
        className={STYLES_SIDEBAR}
        style={navigation.contentMode === 'game' ? getSidebarStyles(this.state) : null}>
        <ChatSidebarHeader
          viewer={viewer}
          navigator={navigator}
          onShowOptions={this._handleShowOptions}
          onSignIn={this._handleSignIn}
          onSignOut={this._handleSignOut}
          onHideSidebar={this._handleHideSidebar}
        />
        <ChatSidebarNavigation
          viewer={viewer}
          onNavigateToMakeGame={this._handleNavigateToMakeGame}
          onNavigateToFeaturedGames={this._handleNavigateToFeaturedGames}
          onNavigateToAllPosts={this._handleNavigateToAllPosts}
          onNavigateToHistory={this._handleNavigateToHistory}
          onOpenBrowserForDocumentation={this._handleOpenBrowserForDocumentation}
        />
        <ChatSidebarChannels viewer={viewer} onShowOptions={this._handleShowChannelOptions} />
        <ChatSidebarDirectMessages
          viewer={viewer}
          onShowOptions={this._handleShowDirectMessageOptions}
        />
      </div>
    );
  };

  _renderOptions = () => {
    const { navigation, viewer } = this.props;

    return (
      <div
        className={STYLES_SIDEBAR}
        style={navigation.contentMode === 'game' ? getSidebarStyles(this.state) : null}>
        <ChatSidebarOptions
          viewer={viewer}
          onDismiss={this._handleHideOptions}
          onSignOut={this._handleSignOut}
        />
      </div>
    );
  };

  _renderMessageOptions = () => {
    const { navigation, viewer } = this.props;

    return (
      <div
        className={STYLES_SIDEBAR}
        style={navigation.contentMode === 'game' ? getSidebarStyles(this.state) : null}>
        <ChatSidebarOptionsMessages
          viewer={viewer}
          onDismiss={this._handleHideOptions}
          onStartDirectMessage={this._handleStartDirectMessage}
        />
      </div>
    );
  };

  _renderChannelOptions = () => {
    const { navigation, viewer } = this.props;

    return (
      <div
        className={STYLES_SIDEBAR}
        style={navigation.contentMode === 'game' ? getSidebarStyles(this.state) : null}>
        <ChatSidebarOptionsChannels
          viewer={viewer}
          onDismiss={this._handleHideOptions}
          onAddChannel={this._handleAddChannel}
        />
      </div>
    );
  };

  _renderChat = () => {
    const { chatMode } = this.state;

    if (chatMode === 'OPTIONS') {
      return (
        <div className={STYLES_CHAT}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Settings
          </ChatHeaderActive>
          <ChatOptions />
        </div>
      );
    }

    if (chatMode === 'MEMBERS') {
      return (
        <div className={STYLES_CHAT}>
          <ChatHeaderActive onDismiss={this._handleResetChatWindow}>
            Channel Members
          </ChatHeaderActive>
          <ChatMembers />
        </div>
      );
    }

    return (
      <div className={STYLES_CHAT}>
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
  };

  render() {
    const { mode } = this.state;
    const { navigation } = this.props;

    if (navigation.isFullScreen) {
      return null;
    }

    const chatElement = this._renderChat();
    const layoutMode = LayoutUtilities.getLayoutMode(navigation.contentMode);
    const dynamicStyles = {
      maxWidth: layoutMode !== 'FLUID_CHAT' ? getContainerWidth(this.state) : null,
    };

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

    let shouldRenderSidebar = true;
    if (navigation.contentMode === 'game') {
      shouldRenderSidebar = this.state.sidebar;
    }

    let shouldRenderChat = true;
    if (navigation.contentMode === 'game') {
      shouldRenderChat = this.state.chat;
    }

    const shouldRenderBottomBar = navigation.contentMode === 'game';

    return (
      <div className={STYLES_CONTAINER} style={dynamicStyles}>
        <div className={STYLES_TOP}>
          {shouldRenderSidebar ? sidebarElement : null}
          {shouldRenderChat ? chatElement : null}
        </div>
        {shouldRenderBottomBar ? (
          <div className={STYLES_BOTTOM}>
            {this.state.sidebar ? (
              <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleToggleSidebar}>
                Hide Sidebar
              </UINavigationLink>
            ) : (
              <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleToggleSidebar}>
                Show Sidebar
              </UINavigationLink>
            )}
            {this.state.chat ? (
              <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleToggleChat}>
                Hide Chat
              </UINavigationLink>
            ) : (
              <UINavigationLink style={{ marginRight: 24 }} onClick={this._handleToggleChat}>
                Show Chat
              </UINavigationLink>
            )}
          </div>
        ) : null}
      </div>
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
