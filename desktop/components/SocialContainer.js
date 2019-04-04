import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext, NavigatorContext } from '~/contexts/NavigationContext';
import { getLevel, getExp } from '~/components/reusable/UICharacterCard';

import ChatContainer from '~/components/social/ChatContainer';
import Viewer from '~/components/Viewer';
import UINavigationLink from '~/components/reusable/UINavigationLink';
import UIHeaderBlock from '~/components/reusable/UIHeaderBlock';
import HomeUpdateBanner from '~/components/home/HomeUpdateBanner';
import LoginSignupControl from '~/components/LoginSignupControl';

const ENABLE_NOTIFICATIONS = false;

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  position: relative;
  background: #141414;
  color: ${Constants.colors.white};
  display: flex;
  flex-direction: column;
  width: 288px;
  flex-shrink: 0;
`;

const STYLES_CONTAINER_HEADER = css`
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  background: ${Constants.colors.backgroundNavigation};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_LOGGED_OUT = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
`;

const STYLES_LOGIN_ACTION = css`
  color: ${Constants.colors.brand2};
  text-decoration: underline;
  font-weight: 600;
  cursor: pointer;
`;

const STYLES_ACTION_BUTTON = css`
  height: 32px;
  width: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  color: ${Constants.colors.white};
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

const STYLES_CONTAINER_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

const STYLES_CONTAINER_HEADER_RIGHT = css`
  flex-shrink: 0;
`;

const STYLES_STAT = css`
  font-family: ${Constants.font.monobold};
  margin-right: 16px;
  font-size: 10px;
  line-height: 9px;
`;

const STYLES_EXP_LABEL = css`
  margin-right: 8px;
  color: ${Constants.colors.darkcyan};
`;

const STYLES_LVL_LABEL = css`
  margin-right: 8px;
  color: ${Constants.colors.brand2};
`;

class SocialContainer extends React.Component {
  state = {
    showNotifications: false,
  };

  _handleToggleNotifications = () => {
    this.setState({ showNotifications: !this.state.showNotifications });
  };

  render() {
    let { isLoggedIn, navigateToCurrentUserProfile, viewer } = this.props;
    let contentElement;
    let signInElement;

    if (isLoggedIn) {
      contentElement = (
        <ChatContainer
          showNotifications={this.state.showNotifications}
          onToggleNotifications={this._handleToggleNotifications}
        />
      );

      const exp = getExp({ playCount: viewer.gamesSumPlayCount, gameCount: viewer.gamesCount });
      const level = getLevel(exp);

      signInElement = (
        <React.Fragment>
          <span className={STYLES_STAT} style={{ marginLeft: 8 }}>
            <span className={STYLES_LVL_LABEL}>LVL</span>
            {level}
          </span>

          <span className={STYLES_STAT}>
            <span className={STYLES_EXP_LABEL}>EXP</span>
            {exp}
          </span>
        </React.Fragment>
      );
    } else {
      contentElement = <LoginSignupControl />;
      signInElement = null;
    }

    const updateElement = this.props.updateAvailable ? (
      <HomeUpdateBanner
        updateAvailable={this.props.updateAvailable}
        onNativeUpdateInstall={this.props.onNativeUpdateInstall}
      />
    ) : null;

    return (
      <div
        className={STYLES_CONTAINER}
        style={
          !this.props.isVisible
            ? {
                opacity: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                height: 1,
                width: 1,
                pointerEvents: 'none',
              }
            : null
        }>
        <div className={STYLES_CONTAINER_HEADER}>
          <div className={STYLES_CONTAINER_HEADER_LEFT}>
            {isLoggedIn ? <Viewer /> : null} {signInElement}
          </div>

          <div className={STYLES_CONTAINER_HEADER_RIGHT}>
            {ENABLE_NOTIFICATIONS ? (
              <UINavigationLink
                style={{ marginRight: 16 }}
                onClick={this._handleToggleNotifications}>
                Notifications
              </UINavigationLink>
            ) : null}
            <span
              className={STYLES_ACTION_BUTTON}
              style={{ color: this.props.mode === 'home' ? 'magenta' : null }}
              onClick={this.props.navigator.navigateToHome}>
              <SVG.Home height="16px" />
            </span>
          </div>
        </div>
        {updateElement}
        {contentElement}
      </div>
    );
  }
}

export default class SocialContainerWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => (
          <NavigationContext.Consumer>
            {(navigation) => {
              return (
                <NavigatorContext.Consumer>
                  {(navigator) => (
                    <SocialContainer
                      viewer={currentUser ? currentUser.user : null}
                      isLoggedIn={!!currentUser.user}
                      navigateToCurrentUserProfile={navigator.navigateToCurrentUserProfile}
                      navigateToSignIn={navigator.navigateToSignIn}
                      navigator={navigator}
                      isVisible={this.props.isVisible}
                      updateAvailable={this.props.updateAvailable}
                      onNativeUpdateInstall={this.props.onNativeUpdateInstall}
                      mode={navigation.contentMode}
                    />
                  )}
                </NavigatorContext.Consumer>
              );
            }}
          </NavigationContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
