import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';

const STYLES_MESSAGES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CHAT_ITEM = css`
  padding-left: 8px;
  font-size: 10pt;
  cursor: default;

  :hover {
    background: ${Constants.colors.backgroundTint};
  }
`;

const STYLES_MESSAGE_USERNAME = css`
  padding-top: 8px;
  font-weight: 700;
`;

const STYLES_MESSAGE = css`
  padding: 4px 0 4px 16px;
`;

const STYLES_BOTTOM = css`
  height: 16px;
`;

export default class ChatMessagesList extends React.Component {
  _container;
  _containerBottom;

  componentWillReceiveProps(nextProps) {
    const isBottom =
      this._container.scrollHeight - this._container.scrollTop === this._container.clientHeight;
    const hasMoreMessages = nextProps.messages.length > this.props.messages.length;

    if (isBottom && hasMoreMessages) {
      this.scroll();
    }
  }

  componentDidMount() {
    this.scroll();
  }

  scroll = () => {
    window.setTimeout(() => {
      this._containerBottom.scrollIntoView(false);
    });
  };

  render() {
    let listItems = [];
    let prevUserId = null;
    for (let ii = 0, nn = this.props.messages.length; ii < nn; ii++) {
      // TODO: show UIAvatar on the left along with author name.
      const chatMessage = this.props.messages[ii];
      const userId = chatMessage.user.userId;
      let maybeUsername;
      if (!prevUserId || prevUserId !== userId) {
        maybeUsername = <div class={STYLES_MESSAGE_USERNAME}>{chatMessage.user.username}</div>;
      }
      listItems.push(
        <div key={chatMessage.key} className={STYLES_CHAT_ITEM}>
          {maybeUsername}
          <div class={STYLES_MESSAGE}>{chatMessage.message}</div>
        </div>
      );
      prevUserId = userId;
    }
    return (
      <div
        className={STYLES_MESSAGES_CONTAINER}
        ref={(c) => {
          this._container = c;
        }}>
        {listItems}
        <div
          className={STYLES_BOTTOM}
          ref={(c) => {
            this._containerBottom = c;
            this.scroll();
          }}
        />
      </div>
    );
  }
}
