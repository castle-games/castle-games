import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/core-components/primitives/svg';

import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';
import UIButtonDarkSmall from '~/core-components/reusable/UIButtonDarkSmall';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  @keyframes url-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: url-animation 280ms ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  width: 100%;
  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  border-top: 1px solid ${Constants.colors.border};
`;

const STYLES_CONTAINER_LEFT = css`
  flex-shrink: 0;
  font-size: 16px;
  padding-right: 2px;
  color: ${Constants.colors.white};
  display: flex;
  align-items: center;
`;

const STYLES_CONTAINER_MIDDLE = css`
  min-width: 25%;
  width: 100%;
  padding-right: 16px;
  display: flex;
  align-items: center;
`;

const STYLES_CONTAINER_RIGHT = css`
  flex-shrink: 0;
  padding-left: 16px;
  display: flex;
  align-items: center;
`;

const STYLES_INPUT = css`
  background: transparent;
  font-family: ${Constants.font.default};
  color: ${Constants.colors.white};
  font-size: 16px;
  min-width: 25%;
  width: 100%;
  border: 0;
  outline: 0;
  margin: 0;
  padding: 0;

  :focus {
    border: 0;
    outline: 0;
  }
`;

const STYLES_CONTAINER_TOOLBAR = css`
  padding-left: 16px;
  flex-shrink: 0;
`;

const ENABLE_HIDE_OVERLAY = false;

export default class CoreRootURLInput extends React.Component {
  _input;

  _handleFocusInput = () => this._input.focus();

  render() {
    let dimensionToggleElement;
    if (this.props.media && this.props.media.dimensions) {
      dimensionToggleElement = !this.props.expanded ? (
        <UIButtonDarkSmall
          icon={<SVG.Expand height="16px" />}
          onClick={this.props.onToggleMediaExpanded}
        />
      ) : (
        <UIButtonDarkSmall
          icon={<SVG.Collapse height="16px" />}
          onClick={this.props.onToggleMediaExpanded}
        />
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_MIDDLE}>
          <ControlledInput
            ref={c => {
              this._input = c;
            }}
            className={STYLES_INPUT}
            value={this.props.value}
            name={this.props.name}
            placeholder={this.props.placeholder}
            onSubmit={this.props.onSubmit}
            onChange={this.props.onChange}
          />
        </div>
        <div className={STYLES_CONTAINER_RIGHT}>
          <UIButtonDarkSmall icon={<SVG.Play height="12px" />} onClick={this.props.onSubmit} />
        </div>
        <div className={STYLES_CONTAINER_TOOLBAR}>
          {dimensionToggleElement}
          {ENABLE_HIDE_OVERLAY ? (
            <UIButtonDarkSmall
              icon={<SVG.CloseOverlay height="16px" />}
              onClick={this.props.onHideOverlay}
            />
          ) : null}
          <UIButtonDarkSmall
            icon={<SVG.History height="16px" />}
            onClick={this.props.onToggleDashboard}
          />
        </div>
      </div>
    );
  }
}
