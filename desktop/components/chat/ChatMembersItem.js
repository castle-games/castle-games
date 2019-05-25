import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_USER = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: 200ms ease color;

  :hover {
    color: magenta;
  }
`;

const STYLES_NOTIFICATION = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  font-weight: 600;
  background: rgb(255, 0, 235);
  color: white;
  height: 14px;
  margin-top: 2px;
  padding: 0 6px 0 6px;
  border-radius: 14px;
  font-size: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0px;
`;

const STYLES_INFO = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  min-width: 10%;
  width: 100%;
  padding-left: 16px;
`;

const STYLES_NAME = css`
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
`;

const STYLES_DESCRIPTION = css`
  margin-top: 4px;
  font-size: 14px;
`;

const STYLES_INDICATOR = css`
  height: 20px;
  width: 20px;
  border-radius: 20px;
  flex-shrink: 0;
  position: absolute;
  right: -4px;
  bottom: -4px;
  border: 2px solid ${Constants.REFACTOR_COLORS.elements.body};
`;

const STYLES_AVATAR = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 48px;
  width: 48px;
  position: relative;
  border-radius: 4px;
  background: magenta;
`;

export default ({ data }) => {
  return (
    <div className={STYLES_USER}>
      {data.online ? (
        <figure className={STYLES_AVATAR}>
          <span
            className={STYLES_INDICATOR}
            style={{ background: Constants.REFACTOR_COLORS.online }}
          />
        </figure>
      ) : (
        <figure className={STYLES_AVATAR}>
          <span
            className={STYLES_INDICATOR}
            style={{ background: Constants.REFACTOR_COLORS.elements.servers }}
          />
        </figure>
      )}
      <div className={STYLES_INFO}>
        <h2
          className={STYLES_NAME}
          style={{ color: data.online ? null : Constants.REFACTOR_COLORS.subdued }}>
          {data.name}
        </h2>
        <p className={STYLES_DESCRIPTION}>{data.status}</p>
      </div>
    </div>
  );
};
