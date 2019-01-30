import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIHorizontalNavigation from '~/core-components/reusable/UIHorizontalNavigation';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

import EditProfile from '~/components/profile/EditProfile';
import EditGame from '~/components/profile/EditGame';
import CoreSignOut from '~/core-components/CoreSignOut';
import GameList from '~/components/reusable/GameList';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_HEADER_TEXT = css`
  font-size: 16px;
`;

const STYLES_CONTAINER = css`
  width: 100%;
  min-width: 25%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

class ProfileScreen extends React.Component {
  state = {
    mode: 'games',
    isAddingGame: false,
  };

  componentWillReceiveProps(nextProps) {
    const existingUserId = (this.props.creator && this.props.creator.userId) ?
          this.props.creator.userId :
          null;
    const nextUserId = (nextProps.creator && nextProps.creator.userId) ?
          nextProps.creator.userId :
          null
    if (nextUserId != existingUserId) {
      // we're rendering a new profile, reset state.
      this._onShowGames();
    }
  };
  
  _onShowGames = () => this.setState({ mode: 'games', isAddingGame: false });

  _onShowEditProfile = () => this.setState({ mode: 'edit-profile' });

  _onShowSignOut = () => this.setState({ mode: 'sign-out' });

  _onSelectAddGame = () => this.setState({
    mode: 'games',
    isAddingGame: true,
  });
  
  _onAfterAddGame = () => {
    // after adding a game, back out to the full list of games
    this._onShowGames();
    if (this.props.onAfterSave) {
      this.props.onAfterSave();
    }
  };

  _getNavigationItems = (isOwnProfile) => {
    let navigationItems = [
      { label: 'Games', key: 'games' },
    ];

    if (isOwnProfile) {
      navigationItems.push({ label: 'Edit Profile', key: 'edit-profile' });
      navigationItems.push({ label: 'Sign Out', key: 'sign-out' });
    }

    return navigationItems;
  }

  _onNavigationChange = (selectedKey) => {
    const callbacks = {
      'games': this._onShowGames,
      'edit-profile': this._onShowEditProfile,
      'sign-out': this._onShowSignOut,
    }
    if (callbacks.hasOwnProperty(selectedKey)) {
      callbacks[selectedKey]();
    }
  }

  _updateGame = async (game) => {
    let updatedGame;
    try {
      updatedGame = await Actions.updateGameAtUrl(game.url);
    } catch (e) {
      updatedGame = {};
    }
    if (updatedGame && updatedGame.gameId) {
      this.props.onAfterSave();
    }
  };

  _renderGameContent = (isOwnProfile, viewer, creator) => {
    const { isAddingGame } = this.state;
    if (isAddingGame) {
      return (
        <EditGame
          onAfterSave={this._onAfterAddGame}
        />
      );
    } else {
      const gameListElement =
        creator.gameItems && creator.gameItems.length ? (
          <GameList
            noTitleRow
            viewer={viewer}
            creator={creator}
            gameItems={creator.gameItems}
            onGameSelect={this.props.navigation.navigateToGame}
            onUserSelect={this.props.navigation.navigateToUserProfile}
            onGameUpdate={this._updateGame}
          />
        ) : (
          <UIEmptyState
            title="No games yet"
            style={{ borderTop: `16px solid ${Constants.colors.border}` }}>
            {isOwnProfile
              ? 'You have not added any games to your profile yet.'
              : 'This user has not added any games to their profile yet.'}
          </UIEmptyState>
        );
      const addGameIcon = (<SVG.Add height="16px" />);
      const maybeAddGameElement =
        isOwnProfile ? (
          <UIButtonIconHorizontal
            style={{ margin: 16 }}
            onClick={() => this._onSelectAddGame()}
            icon={addGameIcon}>
            Add Your Games
          </UIButtonIconHorizontal>
        ) : null;
      return (
        <div>
          {gameListElement}
          {maybeAddGameElement}
        </div>
      );
    }
  }

  _renderEditProfileContent = (isOwnProfile, user) => {
    if (!isOwnProfile) return null;
    
    return (
      <EditProfile
        user={user}
        onAfterSave={this.props.onAfterSave}
      />
    );
  };

  _renderSignOutContent = (isOwnProfile) => {
    if (!isOwnProfile) return null;
    return (
      <CoreSignOut onSignOut={this.props.onSignOut} />
    );
  };

  render() {
    const { viewer, creator } = this.props;
    const isOwnProfile = (
      viewer && viewer.userId == creator.userId
    );

    let profileContentElement;
    const { mode } = this.state;
    if (mode === 'edit-profile') {
      profileContentElement = this._renderEditProfileContent(isOwnProfile, viewer);
    } else if (mode === 'sign-out') {
      profileContentElement = this._renderSignOutContent(isOwnProfile);
    } else {
      profileContentElement = this._renderGameContent(isOwnProfile, viewer, creator);
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UICardProfileHeader
          creator={creator}
          isOwnProfile={isOwnProfile}
          onGameSelect={this.props.navigation.navigateToGame}
        />
        <UIHorizontalNavigation
          items={this._getNavigationItems(isOwnProfile)}
          selectedKey={this.state.mode}
          onChange={this._onNavigationChange}
        />
        {profileContentElement}
      </div>
    );
  };
}

export default class ProfileScreenWithContext extends React.Component {
  _renderProfile = (navigation, currentUser) => {
    const viewer = currentUser.user;
    const creator = navigation.userProfileShown;
    return (
      <ProfileScreen
        navigation={navigation}
        viewer={viewer}
        creator={creator}
        onSignOut={currentUser.clearCurrentUser}
        onAfterSave={currentUser.refreshCurrentUser}
      />
    );
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {navigation => (
          <CurrentUserContext.Consumer>
            {currentUser => this._renderProfile(navigation, currentUser)}
          </CurrentUserContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}
