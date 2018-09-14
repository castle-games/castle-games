import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';

import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';
import UISmallButtonDark from '~/core-components/reusable/UISmallButtonDark';
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
  background: ${Constants.colors.black40};
  color: ${Constants.colors.white};
  padding: 0 16px 0 16px;
  border-top: 1px solid ${Constants.colors.white10};
`;

const STYLES_CONTAINER_LEFT = css`
  flex-shrink: 0;
  font-size: 16px;
  padding-right: 2px;
  color: ${Constants.colors.white60};
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

export default class CoreBrowserURLInput extends React.Component {
  _input;

  _handleFocusInput = () => this._input.focus();

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTAINER_LEFT} onClick={this._handleFocusInput}>
          ghost://
        </div>
        <div className={STYLES_CONTAINER_MIDDLE}>
          <ControlledInput
            ref={c => {
              this._input = c;
            }}
            className={STYLES_INPUT}
            value={this.props.value}
            name={this.props.name}
            placeholder={this.props.placeholder}
            onSubmit={this.props.onURLSubmit}
            onChange={this.props.onURLChange}
          />
        </div>
        <div className={STYLES_CONTAINER_RIGHT}>
          <UIControl onClick={this.props.onToggleDashboard}>Dashboard</UIControl>
        </div>
        <div className={STYLES_CONTAINER_TOOLBAR}>
          <UISmallButtonDark
            icon={<UISVG.Favorite height="16px" />}
            onClick={this.props.onFavoriteMedia}
          />
          {!this.props.expanded ? (
            <UISmallButtonDark
              icon={<UISVG.Expand height="16px" />}
              onClick={this.props.onToggleMediaExpanded}
            />
          ) : (
            <UISmallButtonDark
              icon={<UISVG.Collapse height="16px" />}
              onClick={this.props.onToggleMediaExpanded}
            />
          )}
        </div>
      </div>
    );
  }
}
