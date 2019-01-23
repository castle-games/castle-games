import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIListMedia from '~/core-components/reusable/UIListMedia';
import UIButtonIconHorizontal from '~/core-components/reusable/UIButtonIconHorizontal';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  @keyframes profile-sidebar-scene-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: profile-sidebar-scene-animation 280ms ease;

  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_HEADING = css`
  color: ${Constants.colors.white};
  font-size: 48px;
  line-height: 52px;
  font-weight: 400;
  margin: 16px;
`;

const STYLES_PARAGRAPH = css`
  font-size: 14px;
  font-weight: 200;
  color: ${Constants.colors.white};
  margin: 0 0 0 16px;
`;

const STYLES_ACTIONS = css`
  color: ${Constants.colors.white};
  padding: 16px;
  border-top: 1px solid ${Constants.colors.border};
`;

export default class CoreRootDashboard extends React.Component {
  _renderEmpty = () => {
    return (
      <div>
        <div className={STYLES_PARAGRAPH}>
          After you play some games in Castle, return here to find your recent plays.
        </div>
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
    const history = this.props.history.getItems();
    let contentElement;
 
    if (!history || !history.length) {
      contentElement = this._renderEmpty();
    } else {
      contentElement = (
        <div>
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
        <div className={STYLES_HEADING}>
          History
        </div>
        {contentElement}
      </div>
    );
  }
}
