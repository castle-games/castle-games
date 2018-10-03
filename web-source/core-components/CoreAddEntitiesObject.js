import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';

const STYLES_CONTAINER = css`
  @keyframes add-entities-scene-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: add-entities-scene-animation 280ms ease;

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};
  border-left: 1px solid ${Constants.colors.border};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class CoreAddEntitiesObject extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIEmptyState title="Not Implemented">Harass Jim.</UIEmptyState>
      </div>
    );
  }
}
