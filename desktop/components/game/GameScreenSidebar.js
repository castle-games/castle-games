import * as React from 'react';

import { css } from 'react-emotion';
import { ToolsWithoutSplitter } from '~/components/game/Tools';

import ChatSidebar from '~/components/chat/ChatSidebar';

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

const STYLES_BOTTOM = css`
  border-top: 1px solid ${BORDER_COLOR};
  width: 100%;
  flex-shrink: 0;
  overflow-y: scroll;
  position: relative;
  display: block;
  background-color: #000000;
  background-image: linear-gradient(90deg, #181818 0%, #272727 74%);

  ::-webkit-scrollbar {
    width: 0px;
  }
`;

const STYLES_DRAGGABLE_SECTION_HORIZONTAL = css`
  width: 100%;
  height: 12px;
  position: absolute;
  right: 0;
  top: -6px;
  left: 0;
  cursor: grab;
  z-index: 1;
  user-select; none;
`;

const MIN_SIZE = 88;

export default class GameScreenSidebar extends React.Component {
  state = {
    chat: 432,
  };

  componentDidMount() {
    window.addEventListener('mouseup', this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
  }

  _handleMouseDown = (e, resizing) => {
    e.preventDefault();
    this.setState({ resizing, mouseY: e.pageY, start: this.state[resizing] });
  };

  _handleMouseMove = (e) => {
    if (!this.state.resizing) {
      return;
    }

    let nextHeight;

    if (this.state.resizing === 'chat') {
      nextHeight = this.state.start - (e.pageY - this.state.mouseY);
    }

    if (nextHeight < MIN_SIZE) {
      nextHeight = MIN_SIZE;
    }

    this.setState({ [this.state.resizing]: nextHeight });
  };

  _handleMouseUp = (e) => {
    if (this.state.resizing) {
      this.setState({ resizing: null, mouseY: null, start: null });
    }
  };

  _handeLayoutChange = () => {
    const game = this.props.getGameFunctions();
    if (game) {
      game.update();
    }
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_TOP}>
          <ToolsWithoutSplitter
            onLayoutChange={this._handleLayoutChange}
            ref={this.props.setToolsRef}
            game={this.props.game}
          />
        </div>
        <div className={STYLES_BOTTOM} style={{ height: this.state.chat }}>
          <div
            className={STYLES_DRAGGABLE_SECTION_HORIZONTAL}
            onMouseDown={(e) => this._handleMouseDown(e, 'chat')}
          />
          <ChatSidebar game={this.props.game} />
        </div>
      </div>
    );
  }
}
