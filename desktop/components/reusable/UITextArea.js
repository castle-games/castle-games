import * as React from 'react';
import * as Constants from '~/common/constants';
import Plain from 'slate-plain-serializer';
import { css } from 'react-emotion';

import ControlledInput from '~/components/primitives/ControlledInput';
import ContentEditor from '~/editor/ContentEditor';

const STYLES_CONTAINER = css`
  position: relative;
`;

const STYLES_INPUT = css`
  border: 1px solid ${Constants.colors.black};
  background: ${Constants.colors.white};
  color: ${Constants.colors.black};
  display: block;
  box-sizing: border-box;
  padding: 32px 8px 16px 8px;
  min-height: 112px;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  font-weight: 300;
  margin: 0 0 0 0;
  transition: 200ms ease all;

  :focus {
    border: 1px solid ${Constants.colors.action};
  }
`;

const STYLES_LABEL = css`
  color: ${Constants.colors.black};
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

  _handleFocus = (e) => {
    this.setState({ focus: true });

    this.props.onFocus(e);
  };

  _handleBlur = (e) => {
    this.setState({ focus: false });

    this.props.onBlur(e);
  };

  render() {
    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <label className={STYLES_LABEL}>{this.props.label}</label>
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
