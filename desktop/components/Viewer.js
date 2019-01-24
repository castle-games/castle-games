import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigationContext } from '~/contexts/NavigationContext';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.black};
  font-size: 8pt;
  color: ${Constants.colors.white};
  width: 36px;
  height: 36px;
  margin: 6px 8px 0 8px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default class Viewer extends React.Component {
  _renderViewer = (navigation, currentUser) => {
    const name = (currentUser.user) ? currentUser.user.username : 'Sign In';
    return (
      <div
        className={STYLES_CONTAINER}
        onClick={navigation.navigateToCurrentUserProfile}>
        {name}
      </div>
    )
  };

  render() {
    return (
      <NavigationContext.Consumer>
        {navigation => (
          <CurrentUserContext.Consumer>
            {currentUser => this._renderViewer(navigation, currentUser)}
          </CurrentUserContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}
