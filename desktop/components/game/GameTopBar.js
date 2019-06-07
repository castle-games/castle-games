import * as React from 'react';

import { css } from 'react-emotion';

import UINavigationLink from '~/components/reusable/UINavigationLink';

const STYLES_TOP_BAR = css`
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
`;

export default class GameTopBar extends React.Component {
  static defaultProps = {
    onGoBack: () => {},
  };

  render() {
    return (
      <div className={STYLES_TOP_BAR}>
        <UINavigationLink
          onClick={this.props.onGoBack}
          style={{
            padding: '0 24px 0 24px',
            height: 32,
            display: 'inline-flex',
            alignItems: 'center',
          }}>
          Back
        </UINavigationLink>
      </div>
    );
  }
}
