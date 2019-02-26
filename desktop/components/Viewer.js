import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export default class Viewer extends React.Component {
  _renderViewer = (navigateToCurrentUserProfile, currentUser) => {
    // NOTE(jim): Not used, so I took it out
    // const name = currentUser.user ? currentUser.user.username[0].toUpperCase() : 'Log In';

    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.imgixUrl : null;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar
          src={avatarSrc}
          onClick={navigateToCurrentUserProfile}
          style={{ borderRadius: 0, boxShadow: 'none', backgroundColor: 'magenta' }}
        />
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
