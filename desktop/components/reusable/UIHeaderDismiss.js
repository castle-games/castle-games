import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  height: 48px;
  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid ${Constants.colors.border};
`;

const STYLES_ICON = css`
  height: 32px;
  width: 32px;
  color: ${Constants.colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

const STYLES_LEFT = css`
  min-width: 25%;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
`;

export default class UIHeaderDismiss extends React.Component {
  render() {
    return (
      <div>
        <div className={STYLES_CONTAINER}>
          <div className={STYLES_LEFT}>{this.props.children}</div>
          {this.props.onDismiss ? (
            <span className={STYLES_ICON} onClick={this.props.onDismiss}>
              <SVG.Dismiss height="14px" />
            </span>
          ) : null}
        </div>
        {this.props.subsection}
      </div>
    );
  }
}
