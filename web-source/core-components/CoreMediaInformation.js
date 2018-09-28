import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UICardMedia from '~/core-components/reusable/UICardMedia';

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

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  border-left: 1px solid ${Constants.colors.border};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class CoreMediaInformation extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <UICardMedia media={this.props.media} onRegisterMedia={this.props.onRegisterMedia} />
      </div>
    );
  }
}
