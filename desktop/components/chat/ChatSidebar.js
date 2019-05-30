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
  width: 228px;
  min-width: 10%;
  height: 100vh;
  transition: 200ms ease width;
`;

const STYLES_SIDEBAR = css`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  background: ${Constants.REFACTOR_COLORS.elements.channels};
  overflow-y: scroll;
  overflow-wrap: break-word;

  ::-webkit-scrollbar {
    display: none;
  }
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

  _handleLeaveChannel = () => {
    alert('_handleLeaveChannel');
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
      <div className={STYLES_SIDEBAR}>
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
      <div className={STYLES_SIDEBAR}>
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
      <div className={STYLES_SIDEBAR}>
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
      <div className={STYLES_SIDEBAR}>
        <ChatSidebarOptionsChannels
          viewer={viewer}
          onDismiss={this._handleHideOptions}
          onAddChannel={this._handleAddChannel}
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

    if (navigation.contentMode === 'game') {
      return null;
    }

    return <div className={STYLES_CONTAINER}>{sidebarElement}</div>;
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
