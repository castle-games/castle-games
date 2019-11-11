import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Window from '~/common/window';

import { css } from 'react-emotion';

const STYLES_ROOT = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  height: 100vh;
  width: 100%;
  background: ${Constants.REFACTOR_COLORS.gameBackground};
`;

const STYLES_TOP = css`
  min-height: 48px;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_BODY = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  min-height: 25%;
  width: 100%;
`;

const STYLES_CONTENT = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  min-width: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_HEADER = css`
  display: flex;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_MEDIA = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_MEDIA_CONTAINER = css`
  display: flex;
  min-width: 10%;
  height: 100%;
  width: 100%;
`;

const STYLES_MEDIA_SIDEBAR = css`
  display: flex;
  height: 100%;
  flex-shrink: 0;
  position: relative;
`;

const STYLES_ACTIONS = css`
  display: flex;
  width: 100%;
  flex-shrink: 0;
`;

const STYLES_DEVELOPER = css`
  display: flex;
  width: 100%;
  flex-shrink: 0;
  position: relative;
  flex-direction: column;
`;

const STYLES_DRAGGABLE_SECTION_VERTICAL = css`
  width: 12px;
  height: 100%;
  position: absolute;
  right: -6px;
  top: 0;
  bottom: 0;
  cursor: ew-resize;
  z-index: 1;
  user-select; none;
`;

const STYLES_DRAGGABLE_SECTION_HORIZONTAL = css`
  height: 12px;
  width: 100%;
  position: absolute;
  top: -6px;
  left: 0;
  right: 0;
  cursor: ns-resize;
  z-index: 1;
  user-select; none;
`;

export default class GameScreenLayout extends React.Component {
  static defaultProps = {
    elementActions: null,
    elementAlert: null,
    elementDeveloper: null,
    elementGameSidebar: null,
    elementHeader: null,
  };

  state = {
    sidebar: 256,
    developer: 360,
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
    const initialMousePosition = resizing === 'developer' ? e.pageY : e.pageX;
    this.setState({ resizing, initialMousePosition, start: this.state[resizing] });
  };

  _handleMouseMove = (e) => {
    const MIN_SIZE = Window.getViewportSize().width * 0.1;
    const MAX_SIZE = Window.getViewportSize().width * 0.4;

    if (!this.state.resizing) {
      return;
    }

    let nextWidth;

    if (this.state.resizing === 'developer') {
      nextWidth = this.state.start - (e.pageY - this.state.initialMousePosition);
    }

    if (this.state.resizing === 'sidebar') {
      nextWidth = this.state.start + (e.pageX - this.state.initialMousePosition);
    }

    if (nextWidth > MAX_SIZE) {
      nextWidth = MAX_SIZE;
    }

    if (nextWidth < MIN_SIZE) {
      nextWidth = MIN_SIZE;
    }

    this.setState({ [this.state.resizing]: nextWidth }, () => {
      this.props.onWindowSizeUpdate();
    });
  };

  _handleMouseUp = (e) => {
    if (this.state.resizing) {
      this.setState({ resizing: null, initialMousePosition: null, start: null });
    }
  };

  render() {
    const {
      elementActions,
      elementAlert,
      elementDeveloper,
      elementGameSidebar,
      elementHeader,
    } = this.props;

    return (
      <div className={STYLES_ROOT}>
        {elementAlert ? <div className={STYLES_TOP}>{elementAlert}</div> : null}

        <div className={STYLES_BODY}>
          <div className={STYLES_CONTENT}>
            {elementHeader ? <div className={STYLES_HEADER}>{elementHeader}</div> : null}

            <div className={STYLES_MEDIA}>
              {elementGameSidebar ? (
                <div className={STYLES_MEDIA_SIDEBAR} style={{ width: this.state.sidebar }}>
                  {elementGameSidebar}
                  <div
                    className={STYLES_DRAGGABLE_SECTION_VERTICAL}
                    onMouseDown={(e) => this._handleMouseDown(e, 'sidebar')}
                  />
                </div>
              ) : null}
              <div className={STYLES_MEDIA_CONTAINER}>{this.props.children}</div>
            </div>

            {elementActions ? <div className={STYLES_ACTIONS}>{elementActions}</div> : null}
          </div>
        </div>
        {elementDeveloper ? (
          <div className={STYLES_DEVELOPER} style={{ height: this.state.developer }}>
            <div
              className={STYLES_DRAGGABLE_SECTION_HORIZONTAL}
              onMouseDown={(e) => this._handleMouseDown(e, 'developer')}
            />
            {elementDeveloper}
          </div>
        ) : null}
      </div>
    );
  }
}
