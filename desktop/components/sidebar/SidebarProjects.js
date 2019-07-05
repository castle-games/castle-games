import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarChannelItem from '~/components/sidebar/SidebarChannelItem';

const STYLES_CONTAINER = css`
  margin-bottom: 24px;
`;

export default class SidebarProjects extends React.Component {
  static defaultProps = {
    items: [],
  };

  render() {
    const { userStatusHistory } = this.props;

    let filteredItems;
    if (userStatusHistory) {
      let seenUrls = {};
      filteredItems = userStatusHistory
        .filter((status) => {
          const { game } = status;
          let isPrivate = Urls.isPrivateUrl(game.url);
          let isLocalFile = isPrivate || !game.owner || !game.owner.name;
          let isAlreadySeen = seenUrls[game.url] === true;
          seenUrls[game.url] = true;
          return isLocalFile && !isAlreadySeen;
        })
        .map((status) => {
          return {
            type: 'create',
            name: status.game.title,
            url: status.game.url,
          };
        });
    }
    if (!filteredItems.length) {
      return null;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <SidebarGroupHeader>{this.props.title}</SidebarGroupHeader>
        {filteredItems.map((c, ii) => {
          return (
            <SidebarChannelItem
              key={`channel-${ii}-${c.url}`}
              channel={c}
              isSelected={false}
              onClick={() => this.props.onSelectGameUrl(c.url)}
            />
          );
        })}
      </div>
    );
  }
}
