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
  position: relative;
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
  justify-content: center;
  align-items: center;
  display: flex;
`;

export default class CoreRootURLInput extends React.Component {
  _input;

  _handleFocusInput = () => this._input.focus();

  _handleSubmit = e => {
    this._input.blur();
    this.props.onSubmit(e);
  };

  render() {
    let muteIcon = (this.props.isMuted) ?
        <SVG.Mute height="16px" /> :
        <SVG.Audio height="16px" />;
    let muteElement = (
      <UIButtonDarkSmall
        icon={muteIcon}
        onClick={this.props.onToggleMute}
        style={{ background: Constants.colors.black }}
        />
    );

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
            onSubmit={this._handleSubmit}
            onChange={this.props.onChange}
          />
        </div>
        <div className={STYLES_CONTAINER_RIGHT} />
        <div className={STYLES_CONTAINER_TOOLBAR}>
          <UIButtonDarkSmall
            icon={<SVG.Play height="10px" />}
            onClick={this._handleSubmit}
            style={{ background: Constants.colors.black }}
          />
          {muteElement}
        </div>
      </div>
    );
  }
}