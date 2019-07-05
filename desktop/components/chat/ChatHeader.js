import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 16px;
  overflow: hidden;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_RIGHT = css`
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

const STYLES_H2 = css`
  font-size: 16px;
  transition: 200ms ease color;
  cursor: pointer;
  display: flex;
  align-items: center;

  :hover {
    color: magenta;
  }

  height: 32px;
`;

const STYLES_GAME_TITLE = css`
  text-decoration: underline;
  cursor: pointer;
  color: magenta;
  font-weight: 600;
`;

const STYLES_P = css`
  margin: 4px 0 4px 0;
  font-size: 12px;
  line-height: 12px;
  height: 12px;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

export default class ChatHeader extends React.Component {
  state = {
    game: null,
  };

  constructor(props) {
    super(props);
    this._update(null);
  }

  componentDidUpdate(prevProps) {
    this._update(prevProps);
  }

  _update = async (prevProps) => {
    const { channel } = this.props;
    if (channel.type === 'game' && channel.gameId) {
      let prevGameId = prevProps ? prevProps.channel.gameId : null;
      if (!this.state.game || channel.gameId !== prevGameId) {
        try {
          let game = await Actions.getGameByGameId(channel.gameId);
          this.setState({ game });
        } catch (_) {}
      }
    }
  };

  _getHeading = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'game':
        if (this.state.game) {
          return (
            <React.Fragment>
              This is the public chat channel for{' '}
              <span
                className={STYLES_GAME_TITLE}
                onClick={() => this.props.onSelectGame(this.state.game)}>
                {this.state.game.title}
              </span>
            </React.Fragment>
          );
        }
        break;
      case 'dm':
        return 'This is a private message thread.';
      default:
        if (channel.name === 'lobby') {
          return 'Everyone in Castle';
        }
        break;
    }
    return 'This is a public channel.';
  };

  render() {
    const { channel, onLeaveChannel } = this.props;
    if (!channel) {
      return null;
    }

    let leaveButton;
    if (onLeaveChannel) {
      leaveButton = (
        <div className={STYLES_HEADER_RIGHT} onClick={onLeaveChannel}>
          Leave Channel
        </div>
      );
    }

    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          <h2 className={STYLES_H2} onClick={this.props.onSettingsClick}>
            {channel.type !== 'dm' ? <SVG.HashTag size="12px" /> : null}
            {channel.name}
          </h2>
          {channel.members && channel.members.length ? (
            <p className={STYLES_P} onClick={this.props.onMembersClick}>
              <strong>{channel.members.length} online</strong>
            </p>
          ) : (
            <p className={STYLES_P}>{this._getHeading()}</p>
          )}
        </div>
        {leaveButton}
      </header>
    );
  }
}
