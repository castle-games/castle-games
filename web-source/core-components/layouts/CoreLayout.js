import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.background};
  height: 100vh;
  width: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
`;

const STYLES_MIDDLE = css`
  width: 100%;
  height: 100%;
  min-width: 25%;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const STYLES_MIDDLE_TOP = css`
  flex-shrink: 0;
  width: 100%;
`;

const STYLES_CHILDREN = css`
  min-height: 25%;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const STYLES_MIDDLE_TOOLBAR = css`
  width: 100%;
  position: absolute;
  bottom: 48px;
  left: 0;
  right: 0;
`;

const STYLES_MIDDLE_BOTTOM = css`
  flex-shrink: 0;
  width: 100%;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  max-width: 420px;
  width: 100%;
  border-left: 1px solid ${Constants.colors.border};
`;

// ---- horizontal section adjustments

const STYLES_HORIZONTAL_SECTION = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100%;
  width: 100%;
`;

const STYLES_RIGHT_FULL = css`
  flex-shrink: 0;
  display: inline-flex;
  width: 100%;
  height: 50%;
`;

const STYLES_MIDDLE_BOTTOM_WITH_BORDER = css`
  flex-shrink: 0;
  width: 100%;
  border-bottom: 1px solid ${Constants.colors.border};
`;

export default class CoreLayout extends React.Component {
  _media;

  getMediaContainerRef = () => {
    return this._media;
  };

  _renderVerticalChildren = () => {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_LEFT}>{this.props.leftSidebarNode}</div>
        <div className={STYLES_MIDDLE}>
          <div className={STYLES_MIDDLE_TOP}>{this.props.topNode}</div>
          <div
            className={STYLES_CHILDREN}
            ref={reference => {
              this._media = reference;
            }}>
            {this.props.children}
          </div>
          <div className={STYLES_MIDDLE_BOTTOM}>{this.props.bottomNode}</div>
        </div>
        {this.props.rightNode ? <div className={STYLES_RIGHT}>{this.props.rightNode}</div> : null}
      </div>
    );
  };

  _renderHorizontalChildren = () => {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_LEFT}>{this.props.leftSidebarNode}</div>
        <div className={STYLES_HORIZONTAL_SECTION}>
          <div className={STYLES_MIDDLE}>
            <div className={STYLES_MIDDLE_TOP}>{this.props.topNode}</div>
            <div
              className={STYLES_CHILDREN}
              ref={reference => {
                this._media = reference;
              }}>
              {this.props.children}
            </div>
            <div className={STYLES_MIDDLE_BOTTOM_WITH_BORDER}>{this.props.bottomNode}</div>
          </div>
          {this.props.rightNode ? (
            <div className={STYLES_RIGHT_FULL}>{this.props.rightNode}</div>
          ) : null}
        </div>
      </div>
    );
  };

  render() {
    return this.props.isHorizontalOrientation
      ? this._renderHorizontalChildren()
      : this._renderVerticalChildren();
  }
}
