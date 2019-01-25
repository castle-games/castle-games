import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import UIButtonDarkSmall from '~/core-components/reusable/UIButtonDarkSmall';
import * as SVG from '~/core-components/primitives/svg';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.white};
  height: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
`;

const STYLES_LEFT_ACTIONS = css`
  padding-left: 16px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const STYLES_NAME = css`
  color: ${Constants.colors.black};
  font-size: 14pt;
`;

export default class GameActionsBar extends React.Component {
  render() {
    let muteIcon = (this.props.isMuted) ?
        <SVG.Mute height="16px" /> :
        <SVG.Audio height="16px" />;
    let muteElement = (
      <UIButtonDarkSmall
        icon={muteIcon}
        onClick={this.props.onToggleMute}
        style={{ background: Constants.colors.black }}
        />
    );
    const name = this.props.media ? this.props.media.name : 'Untitled';
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_NAME}>
          {name}
        </div>
        <div className={STYLES_LEFT_ACTIONS}>
          {muteElement}
        </div>
      </div>
    );
  }
}
