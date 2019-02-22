import * as React from 'react';
import { css } from 'react-emotion';

import ChatContainer from '~/components/social/ChatContainer';
import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  width: 30vh;
  min-width: 280px;
  background: ${Constants.colors.backgroundLeftContext};
`;

const STYLES_LOGGED_OUT = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  padding-top: 64px;
  flex-direction: column;
  margin: 0 16px 0 16px;
`;

const STYLES_LOGIN_ACTION = css`
  color: ${Constants.colors.action};
  text-decoration: underline;
  cursor: pointer;
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
          <p>
            Welcome to Castle!{' '}
            <span className={STYLES_LOGIN_ACTION} onClick={navigateToCurrentUserProfile}>
              Sign in
            </span>{' '}
            to chat with other Castlers.
          </p>
        </div>
      );
    }
    return <div className={STYLES_CONTAINER}>{contentElement}</div>;
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
