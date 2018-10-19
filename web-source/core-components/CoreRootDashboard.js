import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
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
            here.
          </UIEmptyState>
          <div className={STYLES_ACTIONS}>
            <UIButtonIconHorizontal
              onClick={this.props.onToggleBrowse}
              icon={<SVG.Search height="16px" />}>
              Browse media
            </UIButtonIconHorizontal>
          </div>
        </div>
      );
    }

    const { history } = JSON.parse(data);
    if (!history || !history.length) {
      return (
        <div>
          <UIEmptyState title="History">
            As you play different Media using Castle, the last 10 links you visited will appear
            here.
          </UIEmptyState>
          <div className={STYLES_ACTIONS}>
            <UIButtonIconHorizontal
              onClick={this.props.onToggleBrowse}
              icon={<SVG.Search height="16px" />}>
              Browse media
            </UIButtonIconHorizontal>
          </div>
        </div>
      );
    }

    return (
      <div>
        <UIEmptyState title="History" />
        <UIListMedia
          media={this.props.media}
          onMediaSelect={this.props.onMediaSelect}
          onUserSelect={this.props.onUserSelect}
          mediaItems={history}
        />
        <div className={STYLES_ACTIONS}>
          <UIButtonIconHorizontal
            onClick={this.props.onClearHistory}
            icon={<SVG.Dismiss height="12px" />}>
            Clear history
          </UIButtonIconHorizontal>
        </div>
      </div>
    );
  }
}
