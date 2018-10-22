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
`;

const STYLES_RIGHT_SIDEBAR = css`
  flex-shrink: 0;
`;

const STYLES_RIGHT_CONTENT = css`
  flex-shrink: 0;
`;

export default class CoreLayout extends React.Component {
  _media;

  getMediaContainerRef = () => {
    return this._media;
  };

  render() {
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
          <div className={STYLES_MIDDLE_TOOLBAR}>{this.props.toolbarNode}</div>
          <div className={STYLES_MIDDLE_BOTTOM}>{this.props.bottomNode}</div>
        </div>
        <div className={STYLES_RIGHT}>
          <div className={STYLES_RIGHT_SIDEBAR}>{this.props.rightSidebarNode}</div>
          <div className={STYLES_RIGHT_CONTENT}>{this.props.rightNode}</div>
        </div>
      </div>
    );
  }
}
