import ReactDOM from 'react-dom';

import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarDirectMessageItem from '~/components/sidebar/SidebarDirectMessageItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarDirectMessages extends React.Component {
  render() {
    if (!this.props.viewer) {
      return null;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader onClick={this.props.onChat} onShowOptions={this.props.onShowOptions}>
          Direct Messages
        </SidebarGroupHeader>
        {this.props.directMessages.map((c) => {
          return (
            <SidebarDirectMessageItem
              key={`direct-message-${c.otherUserId}`}
              data={{ name: c.name }}
            />
          );
        })}
      </div>
    );
  }
}
