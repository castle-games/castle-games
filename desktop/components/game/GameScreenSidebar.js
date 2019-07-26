import * as React from 'react';

import { css } from 'react-emotion';

const BORDER_COLOR = '#333';
const BACKGROUND_COLOR = '#000';

const STYLES_CONTAINER = css`
  font-size: 64px;
  width: 100%;
  height: 100%;
  background: ${BACKGROUND_COLOR};
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  border-right: 1px solid ${BORDER_COLOR};
`;

const STYLES_TOP = css`
  height: 50%;
  width: 100%;
  overflow-y: scroll;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #000000 0%, #131313 74%);

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
  background-image: linear-gradient(90deg, #181818 0%, #272727 74%);

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

export default class GameScreenSidebar extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_TOP}>&nbsp;</div>
        <div className={STYLES_BOTTOM}>&nbsp;</div>
      </div>
    );
  }
}
