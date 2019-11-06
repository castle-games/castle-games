import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CARD = css`
  width: ${Constants.card.width};
  height: 124px;
  background: #f3f3f3;
  border-radius: ${Constants.card.radius};
  margin: 0 16px 64px 0;
`;

export default (props) => <div className={STYLES_CARD} />;
