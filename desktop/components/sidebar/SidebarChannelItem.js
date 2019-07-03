import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_CHANNEL = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  user-select: none;
  font-size: 14px;
  margin: 8px 0 8px 0;
  padding: 0 16px 0 16px;
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

const STYLES_NAME = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  min-width: 10%;
  width: 100%;
  padding: 0 8px 0 8px;
  line-height: 20px;
`;

const STYLES_SYMBOL = css`
  margin-top: 3px;
  flex-shrink: 0;
`;

export default ({ channel, data, onClick }) => {
  return (
    <div
      className={STYLES_CHANNEL}
      style={{ color: data.active ? 'magenta' : null }}
      onClick={onClick ? onClick : null}>
      <span className={STYLES_SYMBOL}>
        {channel.type === 'game' ? <SVG.SidebarGames size="14px" /> : <SVG.HashTag size="14px" />}
      </span>
      <span className={STYLES_NAME} style={{ fontWeight: data.active ? '700' : null }}>
        {channel.name}
      </span>
      {data.pending ? <span className={STYLES_NOTIFICATION}>{data.pending}</span> : null}
    </div>
  );
};
