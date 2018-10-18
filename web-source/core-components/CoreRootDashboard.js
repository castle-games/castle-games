import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIListMediaInPlaylist from '~/core-components/reusable/UIListMediaInPlaylist';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIControl from '~/core-components/reusable/UIControl';
import UILink from '~/core-components/reusable/UILink';

const STYLES_ACTIONS = css`
  color: ${Constants.colors.white};
  padding: 16px;
  border-top: 1px solid ${Constants.colors.border};
`;

export default class CoreRootDashboard extends React.Component {
  render() {
    const data = this.props.storage.getItem('history');

    if (!data) {
      return (
        <div>
          <UIEmptyState title="History">
            As you play different Media using Castle, the last 10 links you visited will appear
            here. Try <UILink onClick={this.props.onToggleBrowse}>Browsing</UILink>.
          </UIEmptyState>
        </div>
      );
    }

    const { history } = JSON.parse(data);
    if (!history || !history.length) {
      return (
        <div>
          <UIEmptyState title="History">
            As you play different Media using Castle, the last 10 links you visited will appear
            here. Try <UILink onClick={this.props.onToggleBrowse}>Browsing</UILink>.
          </UIEmptyState>
        </div>
      );
    }

    return (
      <div>
        <UIListMediaInPlaylist
          media={this.props.media}
          onMediaSelect={this.props.onMediaSelect}
          onUserSelect={this.props.onUserSelect}
          mediaItems={history}
        />
        <div className={STYLES_ACTIONS}>
          <UIControl onClick={this.props.onClearHistory}>Clear History</UIControl>
        </div>
      </div>
    );
  }
}
