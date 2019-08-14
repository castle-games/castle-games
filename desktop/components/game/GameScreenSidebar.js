import * as React from 'react';
import * as Window from '~/common/window';
import * as NativeUtil from '~/native/nativeutil';

import { css } from 'react-emotion';

import Tools from '~/components/game/Tools';
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
  height: 100%;
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

export default class GameScreenSidebar extends React.Component {
  static defaultProps = {
    setToolsRef: (ref) => {},
  };

  state = {
    chat: Window.getViewportSize().height * 0.5 - 88,
    tools: null,
  };

  componentDidMount() {
    window.addEventListener('mouseup', this._handleMouseUp);
    window.addEventListener('mousemove', this._handleMouseMove);
    window.addEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
    NativeUtil.sendLuaEvent('CASTLE_TOOLS_NEEDS_SYNC', {});
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this._handleMouseUp);
    window.removeEventListener('mousemove', this._handleMouseMove);
    window.removeEventListener('CASTLE_TOOLS_UPDATE', this._handleUpdate);
  }

  _handleUpdate = (e) => {
    // NOTE(jim): Tools is rendering, so we don't need to re-evaluate this for
    // the current game.
    if (this.state.tools) {
      return;
    }

    const state = JSON.parse(e.params);

    let tools = false;
    if (state.panes) {
      tools = !!Object.values(state.panes).find(
        (element) => element.children && element.children.count > 0
      );
    }

    this.setState({ tools });
  };

  _handleMouseDown = (e, resizing) => {
    e.preventDefault();
    this.setState({ resizing, mouseY: e.pageY, start: this.state[resizing] });
  };

  _handleMouseMove = (e) => {
    const MIN_SIZE = 164;
    const START_HEIGHT = Window.getViewportSize().height * 0.5;
    const MAX_SIZE = Window.getViewportSize().height * 0.8;

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

    if (nextHeight > MAX_SIZE) {
      nextHeight = MAX_SIZE;
    }

    this.setState({ [this.state.resizing]: nextHeight });
  };

  _handleMouseUp = (e) => {
    if (this.state.resizing) {
      this.setState({ resizing: null, mouseY: null, start: null });
    }
  };

  render() {
    let isToolsVisible = this.state.tools;

    return (
      <div className={STYLES_CONTAINER}>
        {isToolsVisible ? (
          <div className={STYLES_TOP}>
            <Tools
              isVersionTwo
              onLayoutChange={this.props.onWindowSizeUpdate}
              setToolsRef={this.props.onSetToolsRef}
              game={this.props.game}
            />
          </div>
        ) : null}
        <div className={STYLES_BOTTOM} style={!isToolsVisible ? null : { height: this.state.chat }}>
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
