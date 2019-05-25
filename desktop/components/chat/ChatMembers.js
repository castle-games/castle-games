import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ChatMembersItem from '~/components/chat/ChatMembersItem';

const STYLES_CONTAINER = css`
  height: 100%;
  padding: 16px;
  min-height: 25%;
  width: 100%;
  overflow-y: scroll;
  overflow-wrap: break-word;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export default class ChatMembers extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <ChatMembersItem
          data={{ online: true, name: 'Person #1', status: 'Is playing Blast Flocks' }}
        />
        <ChatMembersItem
          data={{ online: false, name: 'Person #2', status: 'Is playing Blast Flocks' }}
        />
        <ChatMembersItem
          data={{ online: false, name: 'Person #3', status: 'Is playing Blast Flocks' }}
        />
      </div>
    );
  }
}
