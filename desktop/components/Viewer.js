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

export default class Viewer extends React.Component {
  _renderViewer = (navigateToCurrentUserProfile, currentUser) => {
    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.url : null;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar
          src={avatarSrc}
          onClick={navigateToCurrentUserProfile}
          style={{
            height: `32px`,
            width: `32px`,
            borderRadius: 0,
            boxShadow: 'none',
            backgroundColor: !avatarSrc ? 'magenta' : 'transparent',
          }}
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
