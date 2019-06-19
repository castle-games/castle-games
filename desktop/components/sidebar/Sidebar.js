import * as React from 'react';
import * as SVG from '~/common/svg';
import * as Strings from '~/common/strings';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as ChatActions from '~/common/actions-chat';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';

import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext, NavigationContext } from '~/contexts/NavigationContext';
import { SocialContext } from '~/contexts/SocialContext';
import { ChatSessionContext } from '~/contexts/ChatSessionContext';

import SidebarOptions from '~/components/sidebar/SidebarOptions';
import SidebarOptionsChannels from '~/components/sidebar/SidebarOptionsChannels';
import SidebarOptionsMessages from '~/components/sidebar/SidebarOptionsMessages';

import SidebarHeader from '~/components/sidebar/SidebarHeader';
import SidebarChannels from '~/components/sidebar/SidebarChannels';
import SidebarDirectMessages from '~/components/sidebar/SidebarDirectMessages';
import SidebarNavigation from '~/components/sidebar/SidebarNavigation';

// NOTE(jim): Legacy.
import HomeUpdateBanner from '~/components/HomeUpdateBanner';

const STYLES_CONTAINER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  width: 196px;
  min-width: 10%;
  height: 100vh;
  flex-shrink: 0;
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

class Sidebar extends React.Component {
  state = {
    value: '',
    mode: 'DEFAULT',
  };

  _handleSignIn = () => {
    return this.props.navigator.navigateToSignIn();
  };

  _handleSignOut = () => {
    this.props.social.clearCurrentSubscribedChats();
    this.props.currentUser.clearCurrentUser();
    this.setState({ mode: 'DEFAULT' });
  };

  _handleNavigateToChat = async (channel) => {
    await this.props.chat.handleConnect(channel);
    this.props.social.refreshChannelData();
    this.props.navigator.navigateToChat();
    return this.setState({ mode: 'DEFAULT' });
  };

  _handleNavigateToChatWithoutRefresh = async (channel) => {
    await this.props.chat.handleConnect(channel);
    this.props.navigator.navigateToChat();
    return this.setState({ mode: 'DEFAULT' });
  };

  _handleNavigateToMakeGame = () => {
    return this.props.navigator.navigateToCreate();
  };

  _handleNavigateToExamples = () => {
    return this.props.navigator.navigateToContentMode('examples');
  };

  _handleNavigateToGames = () => {
    return this.props.navigator.navigateToContentMode('home');
  };

  _handleNavigateToAllPosts = () => {
    return this.props.navigator.navigateToContentMode('posts');
  };

  _handleNavigateToHistory = () => {
    return this.props.navigator.navigateToContentMode('history');
  };

  _handleOpenBrowserForDocumentation = () => {
    return NativeUtil.openExternalURL(`${Constants.WEB_HOST}/documentation`);
  };

  _handleShowOptions = () => this.setState({ mode: 'OPTIONS' });

  _handleShowChannelOptions = () => this.setState({ mode: 'OPTIONS_CHANNELS' });

  _handleShowDirectMessageOptions = () => this.setState({ mode: 'OPTIONS_MESSAGES' });

  _handleHideOptions = () => this.setState({ mode: 'DEFAULT' });

  _handleCreateDirectMessage = async (user) => {
    if (this._createChannelLock) {
      return;
    }

    this._createChannelLock = true;

    const response = await ChatActions.sendUserChatMessage({
      otherUserId: user.userId,
      message: '👋',
    });

    if (!response || response.errors) {
      this._createChannelLock = false;
      alert(`We were unable to send ${user.username} a message.`);
      return;
    }

    // NOTE(jim): The channel must appear in the refresh.
    await this.props.social.refreshChannelData();

    let newChannel;
    this.props.social.subscribedChatChannels.forEach((c) => {
      if (c.otherUserId === user.userId) {
        newChannel = c;
      }
    });

    this._createChannelLock = false;
    if (!newChannel) {
      return this.setState({ mode: 'DEFAULT' });
    }

    this._handleNavigateToChatWithoutRefresh(newChannel);
  };

  _handleCreateChannel = async (name) => {
    if (this._createChannelLock) {
      return;
    }

    this._createChannelLock = true;

    if (Strings.isEmpty(name)) {
      this._createChannelLock = false;
      alert('You must provide a channel name.');
      return;
    }

    const response = await ChatActions.createChatChannel({ name });
    this._createChannelLock = false;
    if (!response || response.errors) {
      alert('We were unable to create a channel with this name.');
      return;
    }

    if (response.data && response.data.createChatChannel) {
      this._handleNavigateToChat(response.data.createChatChannel);
    }
  };

  _renderUpdateBanner = () => {
    return this.props.updateAvailable ? (
      <HomeUpdateBanner
        updateAvailable={this.props.updateAvailable}
        onNativeUpdateInstall={this.props.onNativeUpdateInstall}
      />
    ) : null;
  };

  _renderRootSidebar = () => {
    const { navigation, navigator, viewer, social, chat } = this.props;
    const isChatVisible = navigation.contentMode === 'chat';

    let directMessages = [];
    let channels = [];
    social.subscribedChatChannels.forEach((c) => {
      c.otherUserId ? directMessages.push(c) : channels.push(c);
    });

    return (
      <div className={STYLES_SIDEBAR}>
        {this._renderUpdateBanner()}
        <SidebarHeader
          viewer={viewer}
          navigator={navigator}
          onShowOptions={this._handleShowOptions}
          onSignIn={this._handleSignIn}
          onSignOut={this._handleSignOut}
          onHideSidebar={this._handleHideSidebar}
        />
        <SidebarNavigation
          viewer={viewer}
          contentMode={navigation.contentMode}
          onNavigateToMakeGame={this._handleNavigateToMakeGame}
          onNavigateToExamples={this._handleNavigateToExamples}
          onNavigateToGames={this._handleNavigateToGames}
          onNavigateToAllPosts={this._handleNavigateToAllPosts}
          onNavigateToHistory={this._handleNavigateToHistory}
          onOpenBrowserForDocumentation={this._handleOpenBrowserForDocumentation}
        />
        {viewer ? (
          <SidebarChannels
            selectedChannelId={chat.channel ? chat.channel.channelId : null}
            viewer={viewer}
            contentMode={navigation.contentMode}
            isChatVisible={isChatVisible}
            channels={channels}
            onShowOptions={this._handleShowChannelOptions}
            onSelectChannel={this._handleNavigateToChat}
          />
        ) : null}
        {viewer ? (
          <SidebarDirectMessages
            selectedChannelId={chat.channel ? chat.channel.channelId : null}
            viewer={viewer}
            social={social}
            contentMode={navigation.contentMode}
            isChatVisible={isChatVisible}
            directMessages={directMessages}
            onSelectChannel={this._handleNavigateToChat}
            onShowOptions={this._handleShowDirectMessageOptions}
          />
        ) : null}
      </div>
    );
  };

  _renderOptions = () => {
    const { navigation, viewer } = this.props;

    return (
      <div className={STYLES_SIDEBAR}>
        <SidebarOptions
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
        <SidebarOptionsMessages
          viewer={viewer}
          onDismiss={this._handleHideOptions}
          onSendMessage={this._handleCreateDirectMessage}
        />
      </div>
    );
  };

  _renderChannelOptions = () => {
    const { navigation, viewer, social } = this.props;

    return (
      <div className={STYLES_SIDEBAR}>
        <SidebarOptionsChannels
          viewer={viewer}
          channels={social.allChatChannels}
          onDismiss={this._handleHideOptions}
          onSelectChannel={this._handleNavigateToChat}
          onCreateChannel={this._handleCreateChannel}
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

export default class SidebarWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => {
          return (
            <SocialContext.Consumer>
              {(social) => {
                return (
                  <ChatSessionContext.Consumer>
                    {(chat) => {
                      return (
                        <NavigationContext.Consumer>
                          {(navigation) => {
                            return (
                              <NavigatorContext.Consumer>
                                {(navigator) => (
                                  <Sidebar
                                    viewer={currentUser.user}
                                    currentUser={currentUser}
                                    navigator={navigator}
                                    navigation={navigation}
                                    social={social}
                                    chat={chat}
                                    updateAvailable={this.props.updateAvailable}
                                    onNativeUpdateInstall={this.props.onNativeUpdateInstall}
                                  />
                                )}
                              </NavigatorContext.Consumer>
                            );
                          }}
                        </NavigationContext.Consumer>
                      );
                    }}
                  </ChatSessionContext.Consumer>
                );
              }}
            </SocialContext.Consumer>
          );
        }}
      </CurrentUserContext.Consumer>
    );
  }
}
