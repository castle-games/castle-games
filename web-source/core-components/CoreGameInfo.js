import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIMediaCard from '~/core-components/reusable/UIMediaCard';

const STYLES_CONTAINER = css`
  @keyframes info-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: info-animation 280ms ease;

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.black20};
  border-left: 1px solid ${Constants.colors.white10};

  ::-webkit-scrollbar {
    width: 1px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${Constants.colors.black20};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${Constants.colors.black};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${Constants.colors.black};
  }
`;

export default class CoreGameInfo extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />

        <UIMediaCard onRegisterMedia={this.props.onRegisterMedia} />

        <UIEmptyState title="Recommended media">
          Once this game has been added to our servers we will be able to recommend other games
          people play that are similar. The author of the game can also recommend other games for
          you to play.
        </UIEmptyState>

        <UIEmptyState title="Recommended playlists">
          There are no recommended playlists.
        </UIEmptyState>
      </div>
    );
  }
}
