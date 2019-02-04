import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext } from '~/contexts/NavigationContext';
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
  _renderViewer = (navigation, currentUser) => {
    const name = currentUser.user ? currentUser.user.username[0].toUpperCase() : 'Log In';
    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.imgixUrl : null;
    return (
      <div className={STYLES_CONTAINER}>
        <UIAvatar
          src={avatarSrc}
          onClick={navigation.navigateToCurrentUserProfile}
          style={{ width: 36, height: 36, borderRadius: 18 }}
        />
      </div>
    );
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {(navigation) => (
          <CurrentUserContext.Consumer>
            {(currentUser) => this._renderViewer(navigation, currentUser)}
          </CurrentUserContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}
