import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  position: relative;
`;

const STYLES_INPUT = css`
  display: block;
  box-sizing: border-box;
  padding: 16px 8px 0 8px;
  border-radius: 4px;
  width: 100%;
  font-weight: 600;
  border: 2px solid ${Constants.brand.line};
  background: ${Constants.brand.background};
  box-shadow: 2px 2px 0 ${Constants.brand.foreground};
  color: ${Constants.brand.line};
  font-size: 16px;
  height: 64px;
  margin: 0 0 24px 0;
  transition: 200ms ease all;

  :focus {
    outline: 0;
    color: ${Constants.colors.white};
    border: 2px solid ${Constants.colors.white};
    background: ${Constants.brand.line};
    box-shadow: 2px 2px 0 ${Constants.brand.foreground};
  }
`;

const STYLES_LABEL = css`
  color: ${Constants.brand.line};
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  left: 10px;
  top: 8px;
  position: absolute;
`;

const STYLES_LABEL_WHITE = css`
  color: ${Constants.colors.white};
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  left: 10px;
  top: 8px;
  position: absolute;
`;

export default class UIInput extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    onFocus: () => {},
    onBlur: () => {},
  };

  state = {
    focus: false,
  };

  _handleFocus = e => {
    this.setState({ focus: true });

    this.props.onFocus(e);
  };

  _handleBlur = e => {
    this.setState({ focus: false });

    this.props.onBlur(e);
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <label className={!this.state.focus ? STYLES_LABEL : STYLES_LABEL_WHITE}>
          {this.props.label}
        </label>
        <ControlledInput
          onChange={this.props.onChange}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onSubmit={this.props.onSubmit}
          name={this.props.name}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.props.username}
          className={STYLES_INPUT}
        />
      </div>
    );
  }
}
