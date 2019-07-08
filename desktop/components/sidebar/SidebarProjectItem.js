import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  padding: 0 16px 0 16px;
  user-select: none;
`;

const STYLES_PROJECT = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: 8px 0 8px 0;
  font-size: 14px;
  transition: 200ms ease color;
  cursor: pointer;

  :hover {
    color: magenta;
  }
`;

const STYLES_PATH = css`
  cursor: default;
  font-size: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued};
  padding-left: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
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

const truncatePath = (path, chars) => {
  if (path && path.length <= chars) {
    return path;
  } else {
    return `...${path.slice(-(chars - 3))}`;
  }
};

export default (props) => {
  const { project, isSelected, onClick } = props;
  let fontWeight, unreadCount;
  if (project.hasUnreadMessages && !isSelected) {
    fontWeight = '700';
    unreadCount = project.unreadNotificationCount;
  }
  let name = project.name ? project.name : 'Untitled';

  return (
    <div className={STYLES_CONTAINER}>
      <div
        className={STYLES_PROJECT}
        style={{ color: isSelected ? 'magenta' : null }}
        onClick={onClick ? onClick : null}>
        <span className={STYLES_SYMBOL}>
          <SVG.Castle size="14px" />
        </span>
        <span className={STYLES_NAME} style={{ fontWeight }}>
          {name}
        </span>
        {unreadCount ? <span className={STYLES_NOTIFICATION}>{unreadCount}</span> : null}
      </div>
      <div className={STYLES_PATH}>{truncatePath(project.url, 26)}</div>
    </div>
  );
};
