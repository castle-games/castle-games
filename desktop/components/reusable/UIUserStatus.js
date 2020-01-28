import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UserStatus from '~/common/userstatus';

const STYLES_STATUS_LINK = css`
  color: magenta;
  text-decoration: underline;
  cursor: pointer;
`;

const STYLES_STATUS_UNREGISTERED_TITLE = css`
  word-spacing: -0.1rem;
  color: ${Constants.colors.text2};
`;

const UIUserStatus = ({
  user = null,
  navigateToGame,
}) => {
  let statusElement = null;
  if (user.lastUserStatus && user.lastUserStatus.game) {
    // show last status if it exists and is relevant
    let status = UserStatus.renderStatusText(user.lastUserStatus);
    if (status.status) {
      if (user.lastUserStatus.game.gameId && navigateToGame) {
        // link to game if it's registered
        statusElement = (
          <React.Fragment>
            {status.verb}{' '}
            <span
              className={STYLES_STATUS_LINK}
              onClick={() =>
                navigateToGame(user.lastUserStatus.game, {
                  launchSource: 'user-status',
                })
              }>
              {status.title}
            </span>
          </React.Fragment>
        );
      } else {
        statusElement = (
          <React.Fragment>
            {status.verb} <span className={STYLES_STATUS_UNREGISTERED_TITLE}>{status.title}</span>
          </React.Fragment>
        );
      }
    }
  }
  if (!statusElement && user.isAnonymous) {
    statusElement = 'Browsing as a guest';
  }
  if (!statusElement && user.createdTime) {
    // if no relevant or recent status, just show signed up date
    statusElement = `Joined on ${Strings.toDate(user.createdTime)}`;
  }
  return <React.Fragment>{statusElement}</React.Fragment>;
}

export default UIUserStatus;
