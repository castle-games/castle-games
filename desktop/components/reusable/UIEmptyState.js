import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  color: ${Constants.colors.black};
  padding: 24px;
`;

const STYLES_HEADER = css`
  color: ${Constants.colors.text};
  font-family: ${Constants.font.heading};
  font-size: ${Constants.typescale.lvl5};
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin-top: 16px;
`;

const UIEmptyState = ({ style, onClick, title, children }) => (
  <div className={STYLES_CONTAINER} style={style} onClick={onClick}>
    <div className={STYLES_HEADER}>{title}</div>
    {children ? <div className={STYLES_PARAGRAPH}>{children}</div> : null}
  </div>
);

export default UIEmptyState;
