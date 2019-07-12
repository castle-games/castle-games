import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';

import SidebarGroupHeader from '~/components/sidebar/SidebarGroupHeader';
import SidebarProjectItem from '~/components/sidebar/SidebarProjectItem';

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
          let isLocalFile = isPrivate || !game.owner;
          let isAlreadySeen = seenUrls[game.url] === true;
          seenUrls[game.url] = true;
          return isLocalFile && !isAlreadySeen;
        })
        .map((status) => {
          return {
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
        {filteredItems.map((p, ii) => {
          return (
            <SidebarProjectItem
              key={`project-${ii}-${p.url}`}
              project={p}
              isSelected={false}
              onClick={() => this.props.onSelectGameUrl(p.url)}
            />
          );
        })}
      </div>
    );
  }
}
