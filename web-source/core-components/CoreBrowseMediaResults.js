import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

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
  background ${Constants.colors.black};
  border-left: 1px solid ${Constants.colors.white10};
  color: ${Constants.colors.white};

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

export default class CoreBrowseMediaResults extends React.Component {
  render() {
    if (!this.props.media || !this.props.media.length) {
      return (
        <div className={STYLES_CONTAINER}>
          <UIEmptyState title="Game results">
            As you search, game results will appear here.
          </UIEmptyState>
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIListMedia media={this.props.media} />
      </div>
    );
  }
}
