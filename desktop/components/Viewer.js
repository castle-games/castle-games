import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { Tooltip } from 'react-tippy';

import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const TOOLTIP_PROPS = {
  arrow: true,
  duration: 170,
  animation: 'fade',
  hideOnClick: false,
  position: 'left',
};

export default class Viewer extends React.Component {
  _renderViewer = (navigateToCurrentUserProfile, currentUser) => {
    const avatarSrc =
      currentUser.user && currentUser.user.photo ? currentUser.user.photo.url : null;
    return (
      <Tooltip title={`Signed in as ${currentUser.user.username}`} {...TOOLTIP_PROPS}>
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
        </div>
      </Tooltip>
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
