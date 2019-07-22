import * as React from 'react';
import * as Constants from '~/common/constants';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Strings from '~/common/strings';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_HEADER = css`
  color: ${Constants.colors.white};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_RIGHT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_LEFT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 200ms ease color;

  :hover {
    color: magenta;
  }
`;

export default class ChatSidebarHeader extends React.Component {
  static defaultProps = {
    gameChannel: {},
    isLobbySelected: true,
    onSelectLobby: () => {},
    onSelectGameChannel: () => {},
  };

  _renderGameChatControl = () => {
    const { gameChannel, isLobbySelected } = this.props;
    if (!gameChannel || !gameChannel.channelId) return null;

    let selectedStyles = isLobbySelected
      ? null
      : {
          background: '#000000',
        };

    return (
      <UINavigationLink
        style={{
          padding: '0 24px 0 24px',
          height: 32,
          display: 'inline-flex',
          alignItems: 'center',
          maxWidth: 128,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          ...selectedStyles,
        }}
        onClick={this.props.onSelectGameChannel}>
        #{gameChannel.name}
      </UINavigationLink>
    );
  };

  _renderLobbyControl = () => {
    const { gameChannel, isLobbySelected } = this.props;
    const isGameAvailable = gameChannel !== null;

    let onClick = isGameAvailable ? this.props.onSelectLobby : null;
    let selectedStyles = isLobbySelected
      ? {
          background: '#000000',
        }
      : null;

    return (
      <UINavigationLink
        style={{
          padding: '0 24px 0 24px',
          height: 32,
          display: 'inline-flex',
          alignItems: 'center',
          ...selectedStyles,
        }}
        onClick={onClick}>
        #{ChatUtilities.EVERYONE_CHANNEL_NAME}
      </UINavigationLink>
    );
  };

  render() {
    return (
      <header className={STYLES_HEADER} style={{ background: `#171717` }}>
        <div className={STYLES_HEADER_LEFT}>
          {this._renderGameChatControl()}
          {this._renderLobbyControl()}
        </div>
      </header>
    );
  }
}
