import * as React from 'react';
import * as Constants from '~/common/constants';
import Plain from 'slate-plain-serializer';
import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';
import ContentEditor from '~/editor/ContentEditor';

const STYLES_CONTAINER = css`
  position: relative;
`;

const STYLES_INPUT = css`
  display: block;
  box-sizing: border-box;
  padding: 32px 8px 16px 8px;
  min-height: 112px;
  border-radius: 4px;
  width: 100%;
  border: 2px solid #333333;
  background: #323232;
  color: ${Constants.colors.white};
  font-size: 16px;
  font-weight: 300;
  margin: 0 0 0 0;
  transition: 200ms ease all;

  :focus {
    color: ${Constants.colors.white};
    border: 2px solid ${Constants.colors.white};
    background: ${Constants.colors.foreground};
  }
`;

const STYLES_LABEL = css`
  color: #777;
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

export default class UITextArea extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onSubmit: () => {},
    onFocus: () => {},
    onBlur: () => {},
    value: Plain.deserialize(''),
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
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <label className={!this.state.focus ? STYLES_LABEL : STYLES_LABEL_WHITE}>
          {this.props.label}
        </label>
        <ContentEditor
          autoFocus={this.props.autoFocus}
          readOnly={this.props.readOnly}
          onChange={this.props.onChange}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
          onSubmit={this.props.onSubmit}
          placeholder={this.props.placeholder}
          value={this.props.value}
          className={STYLES_INPUT}
        />
      </div>
    );
  }
}
