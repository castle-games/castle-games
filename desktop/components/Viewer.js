import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigatorContext';
import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  font-size: 8pt;
  width: 36px;
  height: 36px;
  margin: 0 8px 0 8px;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

export default class Viewer extends React.Component {
  _renderViewer = (navigateToCurrentUserProfile, currentUser) => {
    const name = currentUser.user ? currentUser.user.username[0].toUpperCase() : 'Log In';
    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.imgixUrl : null;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar
          src={avatarSrc}
          onClick={navigateToCurrentUserProfile}
          style={{ width: 32, height: 32, borderRadius: 4 }}
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
