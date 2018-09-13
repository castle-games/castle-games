import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  height: 48px;
  background: ${Constants.colors.black40};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid ${Constants.colors.white10};
`;

export default class CoreHeaderShare extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIControl style={{ marginLeft: 24 }} onClick={this.props.onPreviousMedia}>
          Previous
        </UIControl>
        <UIControl style={{ marginLeft: 24 }} onClick={this.props.onRandomMedia}>
          Random
        </UIControl>
        <UIControl style={{ marginLeft: 24 }} onClick={this.props.onNextMedia}>
          Next
        </UIControl>
      </div>
    );
  }
}
