import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import ChatContainer from '~/components/social/ChatContainer';
import Viewer from '~/components/Viewer';

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

const STYLES_HEADER = css`
  height: 32px;
  width: 100%;
  background: #2b2828;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 8px 0 8px;
`;

class SocialContainer extends React.Component {
  render() {
    let { isLoggedIn, navigateToCurrentUserProfile } = this.props;
    let contentElement;
    if (isLoggedIn) {
      contentElement = <ChatContainer />;
    } else {
      contentElement = (
        <div className={STYLES_LOGGED_OUT}>
          <div className={STYLES_HEADER}>
            <span className={STYLES_LOGIN_ACTION} onClick={navigateToCurrentUserProfile}>
              Sign in
            </span>
            &nbsp;to chat
          </div>
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_HEADER}>
          <Viewer />
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
