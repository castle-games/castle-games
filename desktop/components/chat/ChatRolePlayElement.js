import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';
import * as ChatUtilities from '~/common/chat-utilities';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 16px 48px 0 16px;
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

const STYLES_AUTHOR_MESSAGE = css`
  font-weight: 400;
  line-height: 40px;
  font-size: 28px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-family: ${Constants.font.castle};
  color: ${Constants.REFACTOR_COLORS.text};
`;

export default class ChatMessageElement extends React.Component {
  static defaultProps = {
    user: {
      name: 'Anonymous',
      photo: {
        url: null,
      },
    },
    theme: {
      textColor: null,
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

    if (!Strings.isEmpty(this.props.message.text)) {
      text = this.props.message.text.replace('/me ', '');
      text = ChatUtilities.matchURL(text, this.props.social, this.props.navigator);
      text = ChatUtilities.matchMention(text, this._handleNavigateToUser);
      text = ChatUtilities.matchChannel(text, this._handleNavigateToChannel);
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
          <div className={STYLES_AUTHOR_MESSAGE} style={{ color: this.props.theme.textColor }}>
            {text}
          </div>
        </span>
      </div>
    );
  }
}
