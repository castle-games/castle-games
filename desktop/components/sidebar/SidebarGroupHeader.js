import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const TITLE_STYLES = `
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 16px 0 16px;
  font-size: 16px;
`;

const STYLES_CONTAINER = css`
  ${TITLE_STYLES}
`;

const STYLES_CTA_CONTAINER = css`
  ${TITLE_STYLES}

  cursor: pointer;
  :hover {
    color: magenta;
  }
`;

const STYLES_CONTAINER_LEFT = css`
  min-width: 10%;
  width: 100%;
  padding-right: 16px;
  font-size: 14px;
  user-select: none;
  font-weight: 600;
`;

const STYLES_CONTAINER_RIGHT = css`
  flex-shrink: 0;
  padding-top: 1px;
  cursor: pointer;
`;

export default (props) => {
  return (
    <div className={props.onShowOptions ? STYLES_CTA_CONTAINER : STYLES_CONTAINER}>
      <div className={STYLES_CONTAINER_LEFT} onClick={props.onShowOptions}>
        {props.children}
      </div>
      {props.onShowOptions ? (
        <div className={STYLES_CONTAINER_RIGHT} onClick={props.onShowOptions}>
          <SVG.Add size="16px" />
        </div>
      ) : null}
    </div>
  );
};
