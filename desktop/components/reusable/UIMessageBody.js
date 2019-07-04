import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { ChatContext } from '~/contexts/ChatContext';
import { emojiToString } from '~/common/emojis';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatPost from '~/components/chat/ChatPost';
import StringReplace from 'react-string-replace';

const STYLES_CHANNEL = css`
  font-weight: 600;
  color: magenta;
  cursor: pointer;
  overflow-wrap: break-word;

  :hover {
    text-decoration: underline;
  }
`;

const STYLES_MENTION = css`
  font-weight: 600;
  color: #0062ff;
  cursor: pointer;
  overflow-wrap: break-word;

  :hover {
    text-decoration: underline;
  }
`;

const STYLES_ANCHOR = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-weight: 600;
  text-decoration: underline;
  overflow-wrap: break-word;

  :hover {
    color: ${Constants.REFACTOR_COLORS.text};
  }
  :visited {
    color: ${Constants.REFACTOR_COLORS.text};
  }
`;

const matchCastleURL = (text, onMatchAttachment) => {
  return StringReplace(text, /(castle:\/\/\S+)/g, (match, i) => {
    if (onMatchAttachment) {
      const urlData = Urls.getCastleUrlInfo(match);
      if (urlData.type) {
        onMatchAttachment({ url: match, ...urlData });
      }
    }
    return (
      <a className={STYLES_ANCHOR} key={`castle-anchor-${match + i}`} href={match}>
        {match}
      </a>
    );
  });
};

const matchURL = (text, onMatchAttachment) => {
  return StringReplace(text, /(https?:\/\/\S+)/g, (match, i) => {
    if (onMatchAttachment) {
      const urlData = Urls.getCastleUrlInfo(match);
      if (urlData.type) {
        onMatchAttachment({ url: match, ...urlData });
      }
    }
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
  static defaultProps = {
    body: null,
    expandAttachments: true,
  };

  _renderMessageBody = (body, onMatchAttachment) => {
    if (!body) return null;

    if (typeof body === 'string') {
      body = { message: [{ text: body }] };
    }

    if (!body.message) return null;

    let components = body.message.map((c, ii) => {
      if (c.text) {
        let text = c.text;
        if (ii == 0 && ChatUtilities.getSlashCommand(body).isCommand) {
          text = text
            .split(' ')
            .slice(1)
            .join(' ');
        }
        text = matchURL(text, onMatchAttachment);
        text = matchCastleURL(text, onMatchAttachment);
        text = matchChannel(text, this.props.getChannelByName, this.props.openChannelWithName);
        return <span key={`message-${ii}`}>{text}</span>;
      } else if (c.userId) {
        const user = this.props.userIdToUser[c.userId];
        if (user) {
          return (
            <span
              className={STYLES_MENTION}
              key={`mention-${ii}`}
              onClick={() => this.props.navigator.navigateToUserProfile(user)}>
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
    const { body, expandAttachments } = this.props;
    let attachmentsMatched, onMatchAttachment, attachments;

    if (expandAttachments) {
      attachmentsMatched = [];
      onMatchAttachment = (urlData) => {
        attachmentsMatched.push(urlData);
      };
    }

    const renderedBody = this._renderMessageBody(body, onMatchAttachment);

    if (attachmentsMatched && attachmentsMatched.length) {
      attachments = attachmentsMatched.map((urlData, ii) => (
        <ChatPost
          key={`attachment-${ii}`}
          urlData={urlData}
          navigator={this.props.navigator}
          theme={this.props.theme}
        />
      ));
    }
    return (
      <React.Fragment>
        <section>{renderedBody}</section>
        <section>{attachments}</section>
      </React.Fragment>
    );
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
                    navigator={navigator}
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
