import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import UIButtonDarkSmall from '~/core-components/reusable/UIButtonDarkSmall';
import * as SVG from '~/core-components/primitives/svg';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.white};
  height: 72px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const STYLES_LEFT_ACTIONS = css`
  padding-left: 16px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const STYLES_NAME_ROW = css`
  color: ${Constants.colors.black};
  font-size: 14pt;
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
`;

const STYLES_CREATOR_ROW = css`
  display: flex;
  width: 100%;
  font-size: 10pt;
`;

export default class GameActionsBar extends React.Component {
  render() {
    let muteIcon = (this.props.isMuted) ?
        <SVG.Mute height="14px" /> :
        <SVG.Audio height="14px" />;
    let muteElement = (
      <UIButtonDarkSmall
        icon={muteIcon}
        onClick={this.props.onToggleMute}
        style={{ background: Constants.colors.black }}
        />
    );
    let name = 'Untitled';
    let username = 'Anonymous';
    let isRegistered = false;
    let { media } = this.props;
    if (media) {
      name = (media.name) ? media.name : name;
      isRegistered = (media.slug && media.user);
      if (isRegistered) {
        username = media.user.username;
      } else {
        username = media.username ? media.username : username;
        if (media.user && media.user.username) {
          // TODO: deprecated: unregistered media shouldn't have a `user`,
          // so we can just delete this case once that's true.
          username = media.user.username;
        }
      }
    }
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_NAME_ROW}>
          {name}
          <div className={STYLES_LEFT_ACTIONS}>
            {muteElement}
          </div>
        </div>
        <div className={STYLES_CREATOR_ROW}>
          Made by {username}
        </div>
      </div>
    );
  }
}
