import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 8px 8px 0px 16px;
  overflow: hidden;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 200ms ease color;
  cursor: pointer;
  padding: 8px;

  :hover {
    color: magenta;
  }
`;

const STYLES_H2 = css`
  font-size: 16px;
`;

export default class ChatHeaderActive extends React.Component {
  render() {
    return (
      <header className={STYLES_HEADER}>
        <div className={STYLES_HEADER_LEFT}>
          <h2 className={STYLES_H2}>{this.props.children}</h2>
        </div>
        <div className={STYLES_HEADER_RIGHT} onClick={this.props.onDismiss}>
          <SVG.Dismiss size="16px" />
        </div>
      </header>
    );
  }
}
