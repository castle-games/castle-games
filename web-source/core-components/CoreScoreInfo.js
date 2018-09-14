import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UILink from '~/core-components/reusable/UILink';
import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';

const STYLES_CONTAINER = css`
  @keyframes score-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: score-animation 280ms ease;

  width: 220px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.black30};
  border-left: 1px solid ${Constants.colors.white10};

  ::-webkit-scrollbar {
    width: 1px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${Constants.colors.black30};
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

export default class CoreScoreInfo extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />

        <UIEmptyState title="No scores yet">
          In the future you will be able to add webhooks to your games and let players submit scores
          to their games.
        </UIEmptyState>

        <UIEmptyState title="Integration">
          Interested in having a high scores chart when people play with your media? Check out{' '}
          <UILink href="https://game.builders" target="blank">
            our documentation
          </UILink>{' '}
          for some details about how you can integrate scores into your game.
        </UIEmptyState>
      </div>
    );
  }
}
