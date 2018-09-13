import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';

import { css } from 'react-emotion';

import UIIconButton from '~/core-components/reusable/UIIconButton';

const STYLES_NAVIGATION = css`
  @keyframes navigation-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: navigation-animation 280ms ease;

  background: ${Constants.colors.black60};
  height: 100%;
  width: 80px;
  padding: 8px;
  border-right: 1px solid ${Constants.colors.white10};
`;

export default class CoreNavigationSidebar extends React.Component {
  render() {
    return (
      <div className={STYLES_NAVIGATION}>
        <UIIconButton
          icon={false}
          src={this.props.viewer.avatarUrl}
          onClick={this.props.onToggleProfile}>
          {this.props.viewer.username}
        </UIIconButton>
        <UIIconButton icon={<UISVG.Search height="24px" />} onClick={this.props.onToggleSearch}>
          Search
        </UIIconButton>
      </div>
    );
  }
}
