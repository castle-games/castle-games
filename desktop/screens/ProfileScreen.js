import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { ChatContext } from '~/contexts/ChatContext';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';

import UIHorizontalNavigation from '~/components/reusable/UIHorizontalNavigation';
import UIEmptyState from '~/components/reusable/UIEmptyState';

import EditProfile from '~/components/profile/EditProfile';
import AddGame from '~/components/profile/AddGame';
import ProfileHeader from '~/components/profile/ProfileHeader';
import ProfileSettings from '~/components/profile/ProfileSettings';
import SignOut from '~/components/profile/SignOut';
import UIGameSet from '~/components/reusable/UIGameSet';
import UIPostList from '~/components/reusable/UIPostList';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.text};
  background: ${Constants.colors.background};
  width: 100%;
  min-width: 25%;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_GAME_GRID = css`
  marigin-left: 24px;
`;

class ProfileScreen extends React.Component {
  static defaultProps = {
    creator: null,
    viewer: null,
    onAfterSave: () => {},
    navigateToGameMeta: async (game) => {},
    navigateToGameUrl: async (url) => {},
    navigateToUserProfile: (user) => {},
  };

  state = {
    mode: 'games',
    posts: [],
    gameToUpdate: null, // if mode === 'update-game'
  };

  componentDidUpdate(prevProps, prevState) {
    this._update(prevProps, prevState);
  }

  componentDidMount() {
    this._update(null, null);
  }

  _update = async (prevProps) => {
    const existingUserId = prevProps && prevProps.creator ? prevProps.creator.userId : null;
    const nextUserId = this.props.creator ? this.props.creator.userId : null;

    if (nextUserId != existingUserId) {
      // we're rendering a new profile, reset state.
      this._onShowGames();
      const posts = await Actions.postsForUserId(nextUserId);
      this.setState({ posts });
    } else {
      // if updating a game, pass down any new updates to that game.
      if (this.state.gameToUpdate) {
        if (
          this.props.creator &&
          this.props.creator !== prevProps.creator &&
          this.props.creator.gameItems
        ) {
          for (let ii = 0, nn = this.props.creator.gameItems.length; ii < nn; ii++) {
            const game = this.props.creator.gameItems[ii];
            if (game.gameId === this.state.gameToUpdate.gameId) {
              this.setState({ gameToUpdate: game });
              break;
            }
          }
        }
      }
    }
  };

  _onShowGames = () => this.setState({ mode: 'games', gameToUpdate: null });
  _onShowPosts = () => this.setState({ mode: 'posts' });
  _onShowAddGame = () => this.setState({ mode: 'add-game' });
  _onShowEditProfile = () => this.setState({ mode: 'edit-profile' });
  _onShowSignOut = () => this.setState({ mode: 'sign-out' });
  _onShowSettings = () => this.setState({ mode: 'settings' });
  _onShowUpdateGame = (game) => this.setState({ mode: 'update-game', gameToUpdate: game });

  _onAfterAddGame = () => {
    // after adding a game, back out to the full list of games
    this._onShowGames();
    this.props.onAfterSave();
  };

  _getNavigationItems = (isOwnProfile) => {
    let navigationItems = [{ label: 'Games', key: 'games' }, { label: 'Activity', key: 'posts' }];

    if (isOwnProfile) {
      navigationItems.push({ label: 'Add game', key: 'add-game' });
      navigationItems.push({ label: 'Edit Profile', key: 'edit-profile' });
      navigationItems.push({ label: 'Settings', key: 'settings' });
      navigationItems.push({ label: 'Sign Out', key: 'sign-out' });
    }

    return navigationItems;
  };

  _onNavigationChange = (selectedKey) => {
    const callbacks = {
      games: this._onShowGames,
      posts: this._onShowPosts,
      'add-game': this._onShowAddGame,
      'edit-profile': this._onShowEditProfile,
      'sign-out': this._onShowSignOut,
      settings: this._onShowSettings,
    };

    if (callbacks.hasOwnProperty(selectedKey)) {
      callbacks[selectedKey]();
    }
  };

  _navigateToGameMeta = async (game, options) => {
    await this.props.navigateToGameMeta(game, { ...options, launchSource: 'profile' });
  };

  _renderGameContent = (isOwnProfile, viewer, creator) => {
    return creator.gameItems && creator.gameItems.length ? (
      <div className={STYLES_GAME_GRID}>
        <UIGameSet
          viewer={this.props.viewer}
          gameItems={creator.gameItems}
          onUserSelect={this.props.navigateToUserProfile}
          onGameSelect={this._navigateToGameMeta}
          onGameUpdate={isOwnProfile ? this._onShowUpdateGame : null}
          onSignInSelect={this.props.navigateToSignIn}
        />
      </div>
    ) : (
      <UIEmptyState title="No games yet">
        {isOwnProfile
          ? 'You have not added any games to your profile yet.'
          : 'This user has not added any games to their profile yet.'}
      </UIEmptyState>
    );
  };

  _renderPosts = (posts, isOwnProfile) => {
    if (posts && posts.length) {
      return (
        <UIPostList
          posts={this.state.posts}
          onUserSelect={this.props.navigateToUserProfile}
          onGameSelect={this._navigateToGameMeta}
        />
      );
    } else {
      return (
        <UIEmptyState title="No activity yet">
          {isOwnProfile
            ? 'You have no recent activity shown on your profile. You can share screenshots from games you play on Castle and they will show up here.'
            : 'This user has no recent activity.'}
        </UIEmptyState>
      );
    }
  };

  _renderAddGame = (isOwnProfile) => {
    if (!isOwnProfile) return null;

    return <AddGame onAfterSave={this._onAfterAddGame} />;
  };

  _renderUpdateGame = (game) => {
    return <AddGame game={this.state.gameToUpdate} onAfterSave={this._onAfterAddGame} />;
  };

  _renderEditProfileContent = (isOwnProfile, user) => {
    if (!isOwnProfile) return null;

    return <EditProfile user={user} onAfterSave={this.props.onAfterSave} />;
  };

  _renderSettings = (isOwnProfile, user) => {
    if (!isOwnProfile) return null;

    return <ProfileSettings user={user} onShowSettings={this._onShowSettings} />;
  };

  _renderSignOutContent = (isOwnProfile) => {
    if (!isOwnProfile) return null;
    return <SignOut onSignOut={this.props.onSignOut} />;
  };

  render() {
    const { viewer, creator } = this.props;
    const isOwnProfile = viewer && viewer.userId == creator.userId;

    let profileContentElement;
    const { mode } = this.state;

    if (mode === 'edit-profile') {
      profileContentElement = this._renderEditProfileContent(isOwnProfile, viewer);
    } else if (mode === 'add-game') {
      profileContentElement = this._renderAddGame(isOwnProfile);
    } else if (mode === 'update-game') {
      profileContentElement = this._renderUpdateGame(this.state.gameToUpdate);
    } else if (mode === 'sign-out') {
      profileContentElement = this._renderSignOutContent(isOwnProfile);
    } else if (mode === 'settings') {
      profileContentElement = this._renderSettings(isOwnProfile, viewer);
    } else if (mode === 'posts') {
      profileContentElement = this._renderPosts(this.state.posts, isOwnProfile);
    } else {
      profileContentElement = this._renderGameContent(isOwnProfile, viewer, creator);
    }

    return (
      <div className={STYLES_CONTAINER}>
        <ProfileHeader
          creator={creator}
          isOwnProfile={isOwnProfile}
          navigateToGameUrl={this.props.navigateToGameUrl}
          onSendMessage={this.props.onSendMessage}
        />
        <UIHorizontalNavigation
          items={this._getNavigationItems(isOwnProfile)}
          selectedKey={this.state.mode}
          onChange={this._onNavigationChange}
          style={{ borderBottom: `1px solid #ececec`, marginBottom: `16px` }}
        />
        {profileContentElement}
      </div>
    );
  }
}

export default class ProfileScreenWithContext extends React.Component {
  _renderProfile = (navigator, navigation, currentUser, chat) => {
    return (
      <ProfileScreen
        navigateToGameMeta={navigator.navigateToGameMeta}
        navigateToGameUrl={navigator.navigateToGameUrl}
        navigateToUserProfile={navigator.navigateToUserProfile}
        navigateToSignIn={navigator.navigateToSignIn}
        viewer={currentUser.user}
        creator={navigation.content.userProfileShown}
        onSignOut={currentUser.clearCurrentUser}
        onAfterSave={currentUser.refreshCurrentUser}
        onSendMessage={chat.openChannelForUser}
      />
    );
  };

  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <NavigationContext.Consumer>
            {(navigation) => (
              <ChatContext.Consumer>
                {(chat) => (
                  <CurrentUserContext.Consumer>
                    {(currentUser) => this._renderProfile(navigator, navigation, currentUser, chat)}
                  </CurrentUserContext.Consumer>
                )}
              </ChatContext.Consumer>
            )}
          </NavigationContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
