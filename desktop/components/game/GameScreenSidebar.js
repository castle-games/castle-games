import * as React from 'react';
import * as Window from '~/common/window';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import Tools from '~/components/game/Tools';

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
  min-height: 10%;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #000000 0%, #131313 74%);

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

export default class GameScreenSidebar extends React.Component {
  static defaultProps = {
    setToolsRef: (ref) => {},
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_TOP}>
          <Tools
            isVersionTwo
            onLayoutChange={this.props.onWindowSizeUpdate}
            setToolsRef={this.props.onSetToolsRef}
            game={this.props.game}
          />
        </div>
      </div>
    );
  }
}
