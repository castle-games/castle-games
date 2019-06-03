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
    console.log('render all of the messages', this.props.messages);

    return (
      <div className={STYLES_CONTAINER}>
        {this.props.messages.map((m) => (
          <ChatMessageElement message={m} />
        ))}
      </div>
    );
  }
}
