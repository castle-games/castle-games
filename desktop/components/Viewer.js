import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const STYLES_USERNAME = css`
  cursor: pointer;
  margin-left: 8px;
`;

export default class Viewer extends React.Component {
  _renderViewer = (navigateToCurrentUserProfile, currentUser) => {
    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.url : null;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar
          src={avatarSrc}
          onClick={navigateToCurrentUserProfile}
          showIndicator={false}
          style={{
            height: `28px`,
            width: `28px`,
          }}
        />
        <div className={STYLES_USERNAME} onClick={navigateToCurrentUserProfile}>
          {currentUser.user.username}
        </div>
      </div>
    );
  };

  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <CurrentUserContext.Consumer>
            {(currentUser) =>
              this._renderViewer(navigator.navigateToCurrentUserProfile, currentUser)
            }
          </CurrentUserContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
