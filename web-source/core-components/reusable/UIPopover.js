import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_POPOVER = css`
  background: ${Constants.colors.black};
  color: ${Constants.colors.white};
  z-index: 2;
  display: none;
  pointer-events: auto;
  position: absolute;
  text-align: left;
  width: 280px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

const STYLES_POPOVER_VISIBLE = css`
  display: block;
  pointer-events: auto;
`;

export default ({ onDismiss, style, active, children }) => {
  return (
    <div className={`${STYLES_POPOVER} ${active ? STYLES_POPOVER_VISIBLE : ''}`} style={style}>
      {children}
    </div>
  );
};
