import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIControl from '~/core-components/reusable/UIControl';
import UICardProfileHeader from '~/core-components/reusable/UICardProfileHeader';
import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';

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
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
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
          profileMode={this.props.profileMode}
          onPlayCreatorMedia={this.props.onPlayCreatorMedia}
          onSubscribeToCreator={this.props.onSubscribeToCreator}
          onClickCreatorAvatar={this.props.onClickCreatorAvatar}
          onClickCreatorCreations={this.props.onClickCreatorCreations}
          onClickCreatorPlaylists={this.props.onClickCreatorPlaylists}
          onShowMediaList={this.props.onShowProfileMediaList}
          onShowPlaylistList={this.props.onShowProfilePlaylistList}
        />
        {this.props.profileMode === 'media' || !this.props.profileMode ? (
          <UIListMedia media={this.props.creator.mediaItems} />
        ) : null}
        {this.props.profileMode === 'playlist' ? (
          <UIEmptyState title="Not Implemented">Harass Jim.</UIEmptyState>
        ) : null}
      </div>
    );
  }
}
