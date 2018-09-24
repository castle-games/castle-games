import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIListMediaInPlaylist from '~/core-components/reusable/UIListMediaInPlaylist';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UILink from '~/core-components/reusable/UILink';

const STYLES_CONTAINER = css`
  @keyframes dashboard-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: dashboard-animation 280ms ease;

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

export default class CoreRootDashboard extends React.Component {
  render() {
    const data = this.props.storage.getItem('history');

    if (!data) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIHeaderDismiss onDismiss={this.props.onDismiss} />
          <UIEmptyState title="History">
            As you play different Media using Castle, the last 10 links you visited will appear
            here.
          </UIEmptyState>
        </div>
      );
    }

    const { history } = JSON.parse(data);
    if (!history) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIHeaderDismiss onDismiss={this.props.onDismiss} />
          <UIEmptyState title="History">We had an issue retrieving your history.</UIEmptyState>
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <UIEmptyState title="History">Here is a history of the media you have played.</UIEmptyState>
        <UIListMediaInPlaylist
          media={this.props.media}
          onMediaSelect={this.props.onMediaSelect}
          style={{ borderTop: `1px solid ${Constants.colors.white10}` }}
          mediaItems={history}
        />
      </div>
    );
  }
}
