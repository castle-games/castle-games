import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 48px;
  background: ${Constants.colors.black30};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid ${Constants.colors.white10};
`;

const STYLES_ICON = css`
  height: 32px;
  width: 32px;
  color: ${Constants.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default class UIHeaderDismiss extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <span className={STYLES_ICON} onClick={this.props.onDismiss}>
          <UISVG.Dismiss height="16px" />
        </span>
      </div>
    );
  }
}
