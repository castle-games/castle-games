import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIListMedia from '~/core-components/reusable/UIListMedia';

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

  width: 100%;
  min-width: 25%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.black};
  color: ${Constants.colors.white};

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

export default class CoreProfile extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss}>
          <UIControl onClick={this.props.onSignOut}>Sign out</UIControl>
        </UIHeaderDismiss>
        <UICardProfileHeader
          creator={this.props.creator}
          onPlayCreatorMedia={this.props.onPlayCreatorMedia}
          onSubscribeToCreator={this.props.onSubscribeToCreator}
          onClickCreatorAvatar={this.props.onClickCreatorAvatar}
          onClickCreatorCreations={this.props.onClickCreatorCreations}
          onClickCreatorPlaylists={this.props.onClickCreatorPlaylists}
        />
        <UIListMedia media={this.props.creator.media} />
      </div>
    );
  }
}
