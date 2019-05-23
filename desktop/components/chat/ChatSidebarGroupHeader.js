import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 0 16px;
  cursor: pointer;
  font-size: 16px;

  :hover {
    color: magenta;
  }
`;

const STYLES_CONTAINER_LEFT = css`
  min-width: 10%;
  width: 100%;
  padding-right: 16px;
  font-size: 14px;
  font-weight: 600;
`;

const STYLES_CONTAINER_RIGHT = css`
  flex-shrink: 0;
  margin-top: 4px;
  cursor: pointer;
`;

export default (props) => {
  return (
    <div className={STYLES_CONTAINER}>
      <div className={STYLES_CONTAINER_LEFT}>{props.children}</div>
      <div className={STYLES_CONTAINER_RIGHT}>
        <SVG.Add size="16px" />
      </div>
    </div>
  );
};
