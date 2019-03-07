import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import ChatContainer from '~/components/social/ChatContainer';
import Viewer from '~/components/Viewer';
import UINavigationLink from '~/components/reusable/UINavigationLink';
import UIHeaderBlock from '~/components/reusable/UIHeaderBlock';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  position: relative;
  background: ${Constants.colors.backgroundLeftContext};
  color: ${Constants.colors.white};
  display: flex;
  flex-direction: column;
  width: 288px;
  flex-shrink: 0;

  @media (max-width: 960px) {
    width: 228px;
  }
`;

const STYLES_CONTAINER_HEADER = css`
  flex-shrink: 0;
  width: 100%;
  height: 32px;
  background: ${Constants.colors.backgroundNavigation};
  display: flex;
  align-items: center;
  justify-content: flex-start;
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

class SocialContainer extends React.Component {
  state = {
    showNotifications: false,
  };

  _handleToggleNotifications = () => {
    this.setState({ showNotifications: !this.state.showNotifications });
  };

  render() {
    let { isLoggedIn, navigateToCurrentUserProfile } = this.props;
    let contentElement;
    if (isLoggedIn) {
      contentElement = <ChatContainer showNotifications={this.state.showNotifications} />;
    } else {
      contentElement = (
        <div className={STYLES_LOGGED_OUT}>
          <UIHeaderBlock>
            <span className={STYLES_LOGIN_ACTION} onClick={navigateToCurrentUserProfile}>
              Sign in
            </span>
            &nbsp;to chat
          </UIHeaderBlock>
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_HEADER}>
          <Viewer />{' '}
          <UINavigationLink style={{ marginLeft: 24 }} onClick={this._handleToggleNotifications}>
            Notifications
          </UINavigationLink>
        </div>
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
          <NavigatorContext.Consumer>
            {(navigator) => (
              <SocialContainer
                isLoggedIn={!!currentUser.user}
                navigateToCurrentUserProfile={navigator.navigateToCurrentUserProfile}
              />
            )}
          </NavigatorContext.Consumer>
        )}
      </CurrentUserContext.Consumer>
    );
  }
}
