import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';

const STYLES_HEADER_TEXT = css`
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.2px;
  border-bottom: 1px solid ${Constants.colors.border};
`;

// TODO(jim): z-index will want to compete.
const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  background: ${Constants.colors.black};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
`;

const STYLES_SMALL = css`
  padding: 16px;
  font-size: 11px;
  color: #666;
`;

const STYLES_FRAME = css`
  min-height: 20%;
  height: 100%;
  width: 100%;
`;

const STYLES_TOP = css`
  flex-shrink: 0;
  width: 100%;
  height: 48px;
`;

export default class CoreBrowserScreen extends React.Component {
  render() {
    let style;
    if (!this.props.isVisible) {
      style = { width: '1px', height: '1px', position: 'absolute', top: 0, left: 0 };
    }

    return (
      <div className={STYLES_CONTAINER} style={style}>
        <div className={STYLES_TOP}>
          <UIHeaderDismiss
            onDismiss={this.props.onDismiss}
            subsection={
              <div className={STYLES_SMALL}>
                Some pages won't load so you will have to visit them in the browser of your choice.
              </div>
            }>
            {this.props.browserUrl}
          </UIHeaderDismiss>
        </div>
        <iframe
          className={STYLES_FRAME}
          allow="autoplay; camera; midi"
          frameBorder="0"
          src={this.props.browserUrl}
          scrolling="yes"
        />
      </div>
    );
  }
}
