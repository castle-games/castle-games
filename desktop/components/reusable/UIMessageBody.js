import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { ChatContext } from '~/contexts/ChatContext';
import { emojiToString } from '~/common/emojis';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import StringReplace from 'react-string-replace';

const STYLES_CHANNEL = css`
  font-weight: 600;
  color: magenta;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_MENTION = css`
  font-weight: 600;
  color: #0062ff;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

const STYLES_ANCHOR = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-weight: 600;
  text-decoration: underline;
  :hover {
    color: ${Constants.REFACTOR_COLORS.text};
  }
  :visited {
    color: ${Constants.REFACTOR_COLORS.text};
  }
`;

const matchCastleURL = (text) => {
  return StringReplace(text, /(castle:\/\/\S+)/g, (match, i) => {
    return (
      <a className={STYLES_ANCHOR} key={`castle-anchor-${match + i}`} href={match}>
        {match}
      </a>
    );
  });
};

const matchURL = (text) => {
  return StringReplace(text, /(https?:\/\/\S+)/g, (match, i) => {
    return (
      <a className={STYLES_ANCHOR} key={`url-${match + i}`} href={match}>
        {match}
      </a>
    );
  });
};

export const matchChannel = (text, getChannelByName, openChannel) => {
  return StringReplace(text, /#([a-zA-Z0-9_-]+)/g, (match, i) => {
    // TODO: get these in json and don't query
    const channel = getChannelByName(match);
    if (channel) {
      return (
        <span
          className={STYLES_CHANNEL}
          key={`channel-${match + i}`}
          onClick={() => openChannel(match)}>
          #{match}
        </span>
      );
    } else {
      return `#${match}`;
    }
  });
};

class UIMessageBody extends React.Component {
  _renderMessageBody = (body) => {
    if (!body || !body.message) return null;

    let components = body.message.map((c, ii) => {
      if (c.text) {
        let text = c.text;
        text = matchURL(text);
        text = matchCastleURL(text);
        text = matchChannel(text, this.props.getChannelByName, this.props.openChannelWithName);
        return <span key={`message-${ii}`}>{text}</span>;
      } else if (c.userId) {
        const user = this.props.userIdToUser[c.userId];
        if (user) {
          return (
            <span
              className={STYLES_MENTION}
              key={`mention-${ii}`}
              onClick={() => this.props.navigateToUserProfile(user)}>
              @{user.username}
            </span>
          );
        }
      } else if (c.emoji) {
        return <span key={`message-${ii}`}>{emojiToString(c.emoji)}</span>;
      }
      return null;
    });
    return components;
  };

  render() {
    const { body } = this.props;
    return <React.Fragment>{this._renderMessageBody(body)}</React.Fragment>;
  }
}

export default class UIMessageBodyWithContext extends React.Component {
  render() {
    return (
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <NavigatorContext.Consumer>
            {(navigator) => (
              <ChatContext.Consumer>
                {(chat) => (
                  <UIMessageBody
                    userIdToUser={userPresence.userIdToUser}
                    getChannelByName={chat.findChannel}
                    openChannelWithName={chat.openChannelWithName}
                    navigateToUserProfile={navigator.navigateToUserProfile}
                    {...this.props}
                  />
                )}
              </ChatContext.Consumer>
            )}
          </NavigatorContext.Consumer>
        )}
      </UserPresenceContext.Consumer>
    );
  }
}
