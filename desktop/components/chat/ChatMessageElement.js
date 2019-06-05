import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css, styled } from 'react-emotion';

import StringReplace from 'react-string-replace';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 8px 48px 8px 16px;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 40px;
  width: 40px;
  background-color: #f3f3f3;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_RIGHT = css`
  padding-left: 6px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_NAME = css`
  cursor: pointer;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_MENTION = css`
  font-weight: 600;
  color: #0062ff;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_CHANNEL = css`
  font-weight: 600;
  color: magenta;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export default class ChatMessageElement extends React.Component {
  static defaultProps = {
    user: {
      name: 'Anonymous',
      photo: {
        url: null,
      },
    },
  };

  _handleNavigateToUser = async ({ username }) => {
    let user = this.props.social.usernameToUser[username];

    if (!user) {
      let response = await Actions.getUserByUsername({ username });

      if (!response) {
        return;
      }

      user = response;
    }

    this.props.onNavigateToUserProfile(user);
  };

  _handleNavigateToChannel = async ({ name }) => {
    const channel = this.props.social.findChannel({ name });

    if (channel) {
      await this.props.chat.handleConnect(channel);
      this.props.navigator.navigateToChat();
    }
  };

  render() {
    let text = '';

    // TODO(jim): Figure out what to do with this.
    if (this.props.message.body === 2) {
      console.log('type 2', this.props.message);
      return null;
    }

    // TODO(jim): Figure out what to do with this.
    if (this.props.message.body === 1) {
      console.log('type 1', this.props.message);
      return null;
    }

    if (!Strings.isEmpty(this.props.message.body.message[0].text)) {
      text = this.props.message.body.message[0].text;

      // NOTE(jim): Capture all mention groups.
      text = StringReplace(text, /@([a-zA-Z0-9_-]+)/g, (match, i) => (
        <span
          className={STYLES_MENTION}
          key={match + i}
          onClick={() => this._handleNavigateToUser({ username: match })}>
          @{match}
        </span>
      ));

      // NOTE(jim): Capture all channel groups.
      text = StringReplace(text, /#([a-zA-Z0-9_-]+)/g, (match, i) => (
        <span
          className={STYLES_CHANNEL}
          key={match + i}
          onClick={() => this._handleNavigateToChannel({ name: match })}>
          #{match}
        </span>
      ));
    }

    return (
      <div className={STYLES_CONTAINER}>
        <span
          className={STYLES_LEFT}
          onClick={
            this.props.user.username
              ? () => this.props.onNavigateToUserProfile(this.props.user)
              : () => {}
          }
          style={{ backgroundImage: this.props.user ? `url(${this.props.user.photo.url})` : `` }}
        />
        <span className={STYLES_RIGHT}>
          <div
            className={STYLES_AUTHOR_NAME}
            onClick={
              this.props.user.username
                ? () => this.props.onNavigateToUserProfile(this.props.user)
                : () => {}
            }>
            {Strings.isEmpty(this.props.user.name)
              ? this.props.user.username
              : this.props.user.name}
            <span className={STYLES_TIMESTAMP}>
              {Strings.toChatDate(this.props.message.timestamp)}
            </span>
          </div>
          <div className={STYLES_AUTHOR_MESSAGE}>{text}</div>
        </span>
      </div>
    );
  }
}
