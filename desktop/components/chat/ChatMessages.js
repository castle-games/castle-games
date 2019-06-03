import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatMessageElement from '~/components/chat/ChatMessageElement';
import ChatPost from '~/components/chat/ChatPost';

const STYLES_CONTAINER = css`
  height: 100%;
  min-height: 25%;
  width: 100%;
  overflow-y: scroll;
  overflow-wrap: break-word;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default class ChatMessages extends React.Component {
  render() {
    const { social, navigator } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        {this.props.messages.map((m) => {
          const user = this.props.social.userIdToUser[m.fromUserId];
          return (
            <ChatMessageElement
              key={m.chatMessageId}
              message={m}
              user={user}
              social={this.props.social}
              onNavigateToUserProfile={this.props.navigator.navigateToUserProfile}
            />
          );
        })}
      </div>
    );
  }
}
