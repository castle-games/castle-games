import * as React from 'react';

import { css } from 'react-emotion';

const BORDER_COLOR = '#333';
const BACKGROUND_COLOR = '#000';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  border-left: 1px solid ${BORDER_COLOR};
  background: ${BACKGROUND_COLOR};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`;

const STYLES_INFO_HEADING = css`
  width: 100%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 16px;
  flex-shrink: 0;
  border-bottom: 1px solid ${BORDER_COLOR};
  color: #fff;
`;

const STYLES_SECTION = css`
  width: 100%;
  height: 24px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 16px;
  flex-shrink: 0;
  border-bottom: 1px solid ${BORDER_COLOR};
`;

const STYLES_TOP = css`
  height: 50%;
  width: 100%;
  overflow-y: scroll;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #000000 0%, #181818 74%);

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const STYLES_BOTTOM = css`
  border-top: 1px solid ${BORDER_COLOR};
  height: 50%;
  width: 100%;
  overflow-y: scroll;
  position: relative;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #000000 0%, #181818 74%);

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  min-width: 200px;
`;

const STYLES_RIGHT = css`
  flex-shrink: 0;
  min-width: 200px;
  text-align: right;
`;

export default class GameScreenDeveloperSidebar extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_INFO_HEADING}>
          <span>Project URL</span> <span>{`{PROJECT_URL_BINDING}`}</span>
        </div>

        <div className={STYLES_SECTION}>
          <div className={STYLES_LEFT}>&nbsp;</div>
          <div className={STYLES_RIGHT} style={{ minWidth: 100 }}>
            &nbsp;
          </div>
        </div>

        <div className={STYLES_TOP}>&nbsp;</div>

        <div
          className={STYLES_SECTION}
          style={{
            borderTop: `1px solid ${BORDER_COLOR}`,
            borderBottom: 0,
          }}>
          <div className={STYLES_LEFT}>&nbsp;</div>
          <div className={STYLES_RIGHT} style={{ minWidth: 100 }}>
            &nbsp;
          </div>
        </div>

        <div className={STYLES_BOTTOM}>&nbsp;</div>
      </div>
    );
  }
}
