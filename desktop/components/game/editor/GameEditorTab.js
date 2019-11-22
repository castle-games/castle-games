import * as React from 'react';

import { css } from 'react-emotion';

const STYLES_EDITOR_TAB = css`
  display: inline-block;
  border-right: 1px solid #555;
  width: 150px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
`;

const STYLES_EDITOR_TAB_TEXT = css`
  width: 120px;
  display: inline-block;
  padding-left: 20px;
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
        <span className={STYLES_EDITOR_TAB_TEXT}>{title}</span>
        <span
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
          style={{
            padding: 10,
            color: isHoverCloseButton ? '#fff' : '#888',
            visibility: isFocused || isHover ? 'visible' : 'hidden',
          }}>
          x
        </span>
      </div>
    );
  }
}
