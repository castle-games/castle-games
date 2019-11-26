import * as React from 'react';

import { css } from 'react-emotion';

export default (props) => (
  <div
    className={css`
      padding: 6px 12px;
      cursor: pointer;
      user-select: none;
    `}
    {...props}>
    {props.children}
  </div>
);
