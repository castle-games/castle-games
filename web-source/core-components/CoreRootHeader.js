import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  @keyframes header-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: header-animation 280ms ease;

  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  width: 100%;
  padding: 0 16px 0 16px;
  border-bottom: 1px solid ${Constants.colors.border};
`;

const STYLES_CONTAINER_LEFT = css`
  min-width: 25%;
  width: 100%;
  padding-right: 16px;
  display: flex;
  align-items: center;
`;

const STYLES_CONTAINER_RIGHT = css`
  flex-shrink: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
`;

export default class CoreRootHeader extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_LEFT} />
        {!this.props.isOffline ? (
          <div
            className={STYLES_CONTAINER_RIGHT}
            style={{ color: this.props.isContextSidebarActive ? Constants.colors.green : null }}>
            <UIControl style={{ marginLeft: 24 }} onClick={this.props.onToggleSidebar}>
              {this.props.isContextSidebarActive ? (
                <SVG.ChevronRight height="20px" />
              ) : (
                <SVG.ChevronLeft height="20px" />
              )}
            </UIControl>
          </div>
        ) : null}
      </div>
    );
  }
}
