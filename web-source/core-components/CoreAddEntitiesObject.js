import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UIInputSecondary from '~/core-components/reusable/UIInputSecondary';

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

const STYLES_SECTION = css`
  padding: 16px;
`;

export default class CoreAddEntitiesObject extends React.Component {
  state = {
    media: {
      name: '',
    },
    playlist: {
      name: '',
    },
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          <UIEmptyState
            style={{ padding: `0 0 24px 0`, color: Constants.colors.white }}
            title="Add your media">
            Add something you've created to your profile! When people view your profile they can
            find the games you've made.
          </UIEmptyState>
          <UIInputSecondary
            value={this.state.media.name}
            name="name"
            label="Media Name"
            onChange={this._handleChangeMedia}
            style={{ marginBottom: 8 }}
          />
          <UIInputSecondary
            value={this.state.media.name}
            name="name"
            label="Media URL"
            onChange={this._handleChangeMedia}
          />
        </div>
      </div>
    );
  }
}
