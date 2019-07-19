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
  display: flex;
  align-items: center;
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

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

const STYLES_ONLINE = css`
  padding-left: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued}:
  cursor: pointer;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }

  span {
    padding: 0 8px 0 8px;
  }
`;

const STYLES_LINK = css`
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
`;

const STYLES_CHANNEL_NAME = css`
  margin-left: 6px;
  cursor: pointer;

  :hover {
    color: magenta;
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

  _renderTitle = () => {
    const { channel, mode, onChannelClick } = this.props;
    let content;
    let hashtag = <SVG.HashTag size="12px" />;
    switch (mode) {
      case 'MEMBERS':
        content = (
          <React.Fragment>
            Online members of{' '}
            <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
              {hashtag}
              {channel.name}
            </span>
          </React.Fragment>
        );
        break;
      default:
        if (channel.type === 'dm') {
          content = (
            <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
              {channel.name}
            </span>
          );
        } else {
          content = (
            <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
              {hashtag}
              {channel.name}
            </span>
          );
        }
        break;
    }
    return <h2 className={STYLES_H2}>{content}</h2>;
  };

  _getHeading = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'game':
        if (this.state.game) {
          return (
            <React.Fragment>
              You are chatting with everyone playing{` `}
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
        return `You are having a private conversation with ${channel.name}.`;
      default:
        if (channel.name === 'lobby') {
          return 'You are chatting with everyone on Castle';
        }
        break;
    }
    return 'This is a public channel.';
  };

  _getLeaveMessage = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'game':
        return 'Leave game chat';
        break;
      case 'dm':
        return 'Leave conversation';
        break;
      default:
        return 'Leave channel';
        break;
    }
  };

  _renderActions = () => {
    const { mode, numChannelMembers } = this.props;
    switch (mode) {
      case 'MEMBERS':
        return (
          <span className={STYLES_ONLINE} onClick={this.props.onChannelClick}>
            <strong>Return to chat</strong>
            <span>&middot;</span>
          </span>
        );
      case 'MESSAGES':
      default:
        if (numChannelMembers) {
          return (
            <span className={STYLES_ONLINE} onClick={this.props.onMembersClick}>
              <strong>{numChannelMembers} online</strong>
              <span>&middot;</span>
            </span>
          );
        } else {
          return null;
        }
    }
  };

  render() {
    const { mode, channel, onLeaveChannel } = this.props;
    if (!channel) {
      return null;
    }

    let leaveButton;
    if (onLeaveChannel) {
      leaveButton = (
        <div className={STYLES_HEADER_RIGHT} onClick={onLeaveChannel}>
          <span className={STYLES_LINK}>{this._getLeaveMessage()}</span>
        </div>
      );
    }

    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          {this._renderTitle()}
          <p className={STYLES_P}>
            {this._renderActions()}
            <span>{this._getHeading()}</span>
          </p>
        </div>
        {leaveButton}
      </header>
    );
  }
}
