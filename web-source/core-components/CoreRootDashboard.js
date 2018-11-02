import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
`;

const STYLES_ACTIONS = css`
  color: ${Constants.colors.white};
  padding: 16px;
  border-top: 1px solid ${Constants.colors.border};
`;

export default class CoreRootDashboard extends React.Component {
  _getHistory = () => {
    let data, history;
    if (this.props.storage) {
      try {
        data = this.props.storage.getItem('history');
      } catch (e) {
        console.log(e);
      }
    }
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        history = parsedData.history;
      } catch (e) {
        console.log(e);
      }
    }
    return history;
  };

  _renderEmpty = () => {
    return (
      <div>
        <UIEmptyState title="History">
          After you play some games in Castle, return here to find your recent plays.
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
  };

  render() {
    const history = this._getHistory();
    let contentElement;
 
    if (!history || !history.length) {
      contentElement = this._renderEmpty();
    } else {
      contentElement = (
        <div>
          <UIEmptyState title="History" />
          <UIListMedia
            isHistory
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

    return (
      <div className={STYLES_CONTAINER}>
        {contentElement}
      </div>
    );
  }
}
