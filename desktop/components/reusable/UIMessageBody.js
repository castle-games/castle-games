import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { ChatContext } from '~/contexts/ChatContext';
import { emojiToString } from '~/common/emoji/emoji-utilities';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatPost from '~/components/chat/ChatPost';
import StringReplace from 'react-string-replace';
import UIReactionsCollection from '~/components/reusable/UIReactionsCollection';

const STYLES_MENTION = css`
  font-weight: 400;
  color: #0062ff;
  cursor: pointer;
  overflow-wrap: break-word;

  :hover {
    text-decoration: underline;
  }
`;

const STYLES_ANCHOR = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-weight: 400;
  overflow-wrap: break-word;

  :hover {
    color: ${Constants.REFACTOR_COLORS.text};
    text-decoration: underline;
  }
  :visited {
    color: ${Constants.REFACTOR_COLORS.text};
  }
`;

const STYLES_EDITED = css`
  color: ${Constants.REFACTOR_COLORS.subdued};
  padding-left: 8px;
  font-size: 12px;
  line-height: 10px;
  user-select: none;
  cursor: default;
  font-weight: 100;
  font-style: normal;
`;

const matchCastleURL = (text, theme, onMatchAttachment) => {
  return StringReplace(text, /(castle:\/\/\S+)/g, (match, i) => {
    if (onMatchAttachment) {
      const urlData = Urls.getCastleUrlInfo(match);
      if (urlData.type) {
        onMatchAttachment({ url: match, ...urlData });
      }
    }
    const styles = theme && theme.anchorColor ? { color: theme.anchorColor } : null;
    return (
      <a className={STYLES_ANCHOR} key={`castle-anchor-${match + i}`} href={match} style={styles}>
        {match}
      </a>
    );
  });
};

const matchURL = (text, theme, onMatchAttachment) => {
  return StringReplace(text, /(https?:\/\/\S+)/g, (match, i) => {
    if (onMatchAttachment) {
      const urlData = Urls.getCastleUrlInfo(match);
      if (urlData.type) {
        onMatchAttachment({ url: match, ...urlData });
      }
    }
    const styles = theme && theme.anchorColor ? { color: theme.anchorColor } : null;
    return (
      <a className={STYLES_ANCHOR} key={`url-${match + i}`} href={match} style={styles}>
        {match}
      </a>
    );
  });
};

class UIMessageBody extends React.Component {
  static defaultProps = {
    body: null,
    reactions: null,
    expandAttachments: true,
    isEdited: false,
    onSelectReaction: (emoji) => {},
  };

  _renderMessageBody = (body, theme, onMatchAttachment, isEdited) => {
    if (!body) return null;

    if (typeof body === 'string') {
      body = { message: [{ text: body }] };
    }

    if (!body.message) return null;

    let components = body.message.map((c, ii) => {
      // TODO: json case for channel
      if (c.text) {
        let text = c.text;
        if (ii == 0 && ChatUtilities.getSlashCommand(body).isCommand) {
          text = text
            .split(' ')
            .slice(1)
            .join(' ');
        }
        text = matchURL(text, theme, onMatchAttachment);
        text = matchCastleURL(text, theme, onMatchAttachment);
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

    if (isEdited) {
      components.push(
        <span key={`message-edited`} className={STYLES_EDITED}>
          (edited)
        </span>
      );
    }

    return components;
  };

  render() {
    const { body, theme, expandAttachments, isEdited } = this.props;
    let attachmentsMatched, onMatchAttachment, attachments;

    if (expandAttachments) {
      attachmentsMatched = [];
      onMatchAttachment = (urlData) => {
        attachmentsMatched.push(urlData);
      };
    }

    const renderedBody = this._renderMessageBody(body, theme, onMatchAttachment, isEdited);

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

    let reactions;
    if (this.props.reactions) {
      reactions = (
        <UIReactionsCollection
          reactions={this.props.reactions}
          onSelectReaction={this.props.onSelectReaction}
        />
      );
    }

    return (
      <React.Fragment>
        <section>{renderedBody}</section>
        <section>{attachments}</section>
        <section>{reactions}</section>
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
