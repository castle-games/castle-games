import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  position: relative;
  padding: 0 4px 4px 4px;
`;

const STYLES_INPUT = css`
  display: block;
  box-sizing: border-box;
  padding: 0 4px 0 4px;
  border-radius: 0;
  width: 100%;
  border: 1px solid ${Constants.colors.black};
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  font-size: 12px;
  height: 28px;
  margin: 0;

  :focus {
    outline: 0;
  }
`;

const STYLES_INPUT_READONLY = css`
  display: block;
  box-sizing: border-box;
  padding: 0 4px 0 4px;
  border-radius: 0;
  width: 100%;
  border: 1px solid ${Constants.colors.background4};
  background: ${Constants.colors.background2};
  color: ${Constants.colors.background4};
  font-size: 12px;
  height: 28px;
  margin: 0;
  cursor: default;

  :focus {
    outline: 0;
  }
`;

export default class ChatInput extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    onFocus: () => {},
    onBlur: () => {},
  };

  state = {
    focus: false,
  };

  _handleFocus = (e) => {
    this.setState({ focus: true });
    this.props.onFocus(e);
  };

  _handleBlur = (e) => {
    this.setState({ focus: false });
    this.props.onBlur(e);
  };

  render() {
    const inputStyle = this.props.readOnly ? STYLES_INPUT_READONLY : STYLES_INPUT;
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <ControlledInput
          autoFocus={this.props.autoFocus}
          onChange={this.props.onChange}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onSubmit={this.props.onSubmit}
          name={this.props.name}
          placeholder={this.props.placeholder}
          type={this.props.type}
          value={this.props.value}
          readOnly={this.props.readOnly}
          className={inputStyle}
        />
      </div>
    );
  }
}
