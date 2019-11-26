import * as React from 'react';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

const STYLES_EDITOR_TAB = css`
  display: inline-flex;
  border-right: 1px solid #555;
  width: 100%;
  max-width: 150px;
  color: #fff;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_EDITOR_TAB_TEXT = css`
  width: 100%;
  display: inline-block;
  padding-left: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
`;

const STYLES_EDITOR_TAB_CLOSE_BUTTON = css`
  flex-shrink: 0;
  padding: 8px;
`;

export default class GameEditorTab extends React.Component {
  render() {
    let {
      componentRef,
      title,
      isFocused,
      isHover,
      isHoverCloseButton,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
      onMouseEnterCloseButton,
      onMouseLeaveCloseButton,
      closeTab,
      style,
    } = this.props;

    return (
      <div
        ref={componentRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={STYLES_EDITOR_TAB}
        style={style}>
        <div className={STYLES_EDITOR_TAB_TEXT}>{title}</div>
        <div
          onMouseDown={(e) => {
            // don't want parent's onMouseDown to get triggered
            e.stopPropagation();
          }}
          onClick={(e) => {
            closeTab();

            // don't want parent's onClick to get triggered
            e.stopPropagation();
          }}
          onMouseEnter={onMouseEnterCloseButton}
          onMouseLeave={onMouseLeaveCloseButton}
          className={STYLES_EDITOR_TAB_CLOSE_BUTTON}
          style={{
            color: isHoverCloseButton ? '#fff' : '#888',
            visibility: isFocused || isHover ? 'visible' : 'hidden',
          }}>
          <SVG.Dismiss size={10} />
        </div>
      </div>
    );
  }
}
