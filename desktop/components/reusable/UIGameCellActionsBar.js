import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';
import { Tooltip } from 'react-tippy';

const STYLES_OPTIONS_BAR = css`
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(0, 0, 0, 0.95);
  color: #7f7f7f;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #333;
  height: 32px;
  top: 8px;
  right: 8px;
  position: absolute;
  cursor: pointer;
  animation: fade-in 200ms ease;
`;

const STYLES_OPTIONS_BAR_ICON = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  :hover {
    color: magenta;
  }
`;

const STYLES_COPY_LINK_CONTENTS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  height: 36px;
`;

const TOOLTIP_PROPS = {
  arrow: true,
  duration: 170,
  animation: 'fade',
  hideOnClick: false,
};

const UIGameCellActionsBar = ({
  isLocalFile = false,
  didCopyToClipboard = false,
  onCopyUrl = () => {},
  onGameUpdate = () => {},
  onHover = (action, isHovering) => {},
}) => {
  return (
    <div
      className={STYLES_OPTIONS_BAR}
      onMouseEnter={() => onHover('update', true)}
      onMouseLeave={() => onHover('update', false)}>
      {onGameUpdate ? (
        <Tooltip title={'Update'} {...TOOLTIP_PROPS}>
          <div className={STYLES_OPTIONS_BAR_ICON} onClick={onGameUpdate}>
            U
          </div>
        </Tooltip>
      ) : null}
      <Tooltip title={didCopyToClipboard ? 'Link copied!' : 'Copy Link'} {...TOOLTIP_PROPS}>
        <div
          className={STYLES_OPTIONS_BAR_ICON}
          style={{ borderLeft: isLocalFile ? null : '1px solid #333' }}
          onClick={onCopyUrl}>
          {didCopyToClipboard ? (
            <div className={STYLES_COPY_LINK_CONTENTS}>
              <SVG.Check size="18px" />
            </div>
          ) : (
            <div className={STYLES_COPY_LINK_CONTENTS}>
              <SVG.Link size="18px" />
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
}

export default UIGameCellActionsBar;
