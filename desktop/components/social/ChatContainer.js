import * as React from 'react';

import { css } from 'react-emotion';

import * as Analytics from '~/common/analytics';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';

import ChatInput from '~/components/social/ChatInput';
import ChatMessagesList from '~/components/social/ChatMessagesList';
import UIButton from '~/components/reusable/UIButton';
import UIHeaderBlock from '~/components/reusable/UIHeaderBlock';

const STYLES_CONTAINER = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
`;

const STYLES_CONNECTING = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  width: 100%;
`;

const STYLES_NOTIFICATIONS = css`
  height: 360px;
  width: 100%;
  background: #141414;
`;

const ROOM_NAME = 'general';
const NOTIFICATIONS_USER_ID = -1;
const TEST_MESSAGE = null;
const NotificationLevel = {
  NONE: 0,
  TAG: 1,
  EVERY: 2,
};

class ChatContainer extends React.Component {
  static defaultProps = {
    chat: {},
  };

  _onSubmit = ({ formattedMessage, rawMessage }) => {
    Analytics.trackChatMessage({ message: rawMessage });
    this.props.chat.send(formattedMessage);
  };

  _onClickConnect = () => {
    this.props.chat.connect();
  };

  _renderContent() {
    const { messages, users, status } = this.props.chat;

    // TODO jim chat postIds
    let postId = null;
    let filteredMessages = messages.filter((message) => {
      if (postId) {
        return message.richMessage && message.richMessage.postId === postId;
      } else {
        return !message.richMessage || !message.richMessage.postId;
      }
    });

    switch (status) {
      case ConnectionStatus.CONNECTED:
        if (filteredMessages && filteredMessages.length == 0) {
          // TODO: this is a little buggy in that when the server is restarted there won't be any messages sent back
          // Fix this by actually requesting history every time chat opens
          return (
            <div className={STYLES_CONNECTING}>
              <UIHeaderBlock>Loading messages...</UIHeaderBlock>
            </div>
          );
        } else {
          return (
            <React.Fragment>
              <UIHeaderBlock>
                <strong>Chat ({users.length})</strong>
              </UIHeaderBlock>
              <ChatMessagesList
                messages={filteredMessages}
                navigateToUserProfile={this.props.navigateToUserProfile}
              />
            </React.Fragment>
          );
        }
      case ConnectionStatus.CONNECTING:
        return (
          <div className={STYLES_CONNECTING}>
            <UIHeaderBlock>Global chat is connecting...</UIHeaderBlock>
          </div>
        );
      case ConnectionStatus.DISCONNECTED:
        return (
          <div className={STYLES_CONNECTING}>
            <UIHeaderBlock>Global chat disconnected...</UIHeaderBlock>
            <UIButton style={{ marginTop: 48 }} onClick={this._onClickConnect}>
              Reconnect
            </UIButton>
          </div>
        );
    }
  }

  render() {
    const { status } = this.props.chat;
    const readOnly = status !== ConnectionStatus.CONNECTED;

    const placeholder = readOnly ? '' : 'Type here to chat...';

    return (
      <React.Fragment>
        {this.props.showNotifications ? (
          <div className={STYLES_NOTIFICATIONS}>
            <UIHeaderBlock onDismiss={this.props.onToggleNotifications}>
              <strong>Notifications</strong>
            </UIHeaderBlock>
          </div>
        ) : null}
        <div className={STYLES_CONTAINER}>{this._renderContent()}</div>
        <ChatInput onSubmit={this._onSubmit} readOnly={readOnly} placeholder={placeholder} />
      </React.Fragment>
    );
  }
}

export default class ChatContainerWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => {
          return (
            <SocialContext.Consumer>
              {(social) => {
                return (
                  <ChatContext.Consumer>
                    {(chat) => {
                      return (
                        <NavigatorContext.Consumer>
                          {(navigator) => (
                            <ChatContainer
                              navigateToUserProfile={navigator.navigateToUserProfile}
                              showNotifications={this.props.showNotifications}
                              onToggleNotifications={this.props.onToggleNotifications}
                              chat={chat}
                            />
                          )}
                        </NavigatorContext.Consumer>
                      );
                    }}
                  </ChatContext.Consumer>
                );
              }}
            </SocialContext.Consumer>
          );
        }}
      </CurrentUserContext.Consumer>
    );
  }
}
