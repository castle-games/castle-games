import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';

import { css } from 'react-emotion';

import UINotice from '~/core-components/reusable/UINotice';

const STYLES_CONTAINER = css`
  @keyframes toolbar-animation {
    from {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 56px;
  padding: 0 16px 0 16px;
  background: transparent;
  animation: toolbar-animation 200ms ease;
`;

export default class CoreRootToolbar extends React.Component {
  static defaultProps = {
    expanded: true,
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UINotice onClick={this.props.onHideOverlay}>
          <strong style={{ marginRight: 8 }}>⌘ + E</strong> to return to the game.
        </UINotice>
      </div>
    );
  }
}
