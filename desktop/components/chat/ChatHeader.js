import * as React from 'react';
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
  padding: 16px 16px 8px 16px;
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

  :hover {
    color: magenta;
  }
`;

const STYLES_P = css`
  margin-top: 4px;
  font-size: 12px;

  strong {
    cursor: pointer;
    transition: 200ms ease color;

    :hover {
      color: magenta;
    }
  }
`;

export default class ChatHeader extends React.Component {
  render() {
    if (!this.props.channel) {
      return null;
    }

    let name = this.props.channel.name;
    if (this.props.channel.otherUserId) {
      const { userIdToUser } = this.props.social;
      const otherUser = userIdToUser[this.props.channel.otherUserId];

      name = otherUser ? `${Strings.getName(otherUser)}` : `Direct Message`;
    }

    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          <h2 className={STYLES_H2} onClick={this.props.onSettingsClick}>
            <SVG.HashTag size="12px" style={{ marginRight: 4 }} />
            {name}
          </h2>
          {this.props.channel.members && this.props.channel.members.length ? (
            <p className={STYLES_P} onClick={this.props.onMembersClick}>
              <strong>{this.props.channel.members.length} online</strong>
            </p>
          ) : (
            <p className={STYLES_P}>
              {this.props.channel.otherUserId
                ? `This is a private message channel.`
                : `This is a public channel.`}
            </p>
          )}
        </div>
        <div className={STYLES_HEADER_RIGHT} onClick={this.props.onSettingsClick}>
          <SVG.Settings size="24px" />
        </div>
      </header>
    );
  }
}
