import * as React from 'react';
import * as Constants from '~/common/constants';
import * as UISVG from '~/core-components/reusable/UISVG';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIPopover from '~/core-components/reusable/UIPopover';
import DOMRectBoundary from '~/core-components/primitives/DOMRectBoundary';
import ControlledInput from '~/core-components/primitives/ControlledInput';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTROL = css`
  position: relative;
`;

const STYLES_TRIGGER = css``;

const STYLES_LABEL = css`
  font-size: 10px;
  margin-bottom: 4px;
`;

const STYLES_INPUT = css`
  box-sizing: border-box;
  display: block;
  width: 100%;
  border: 1px solid ${Constants.colors.white60};
  padding: 0 16px 0 16px;
  background ${Constants.colors.black};
  font-size: 12px;
  color: ${Constants.colors.white};
  height: 40px;
  border-radius: 4px;
  outline: 0;

  :focus {
    border: 1px solid ${Constants.colors.white};
    outline: 0;
  }
`;

export default class ControlFeedbackPopover extends React.Component {
  state = {
    visible: false,
    email: '',
    message: '',
  };

  _handleChange = e => this.setState({ [e.target.name]: e.target.value });

  _handleHide = () => this.setState({ visible: false });

  _handleToggleShow = () => {
    this.setState({ visible: !this.state.visible });
  };

  _handleSubmit = () => {
    this.props.onRegisterMedia({ email: this.state.email, message: this.state.message });
  };

  render() {
    return (
      <DOMRectBoundary
        className={STYLES_CONTROL}
        onDismiss={this._handleHide}
        captureScroll={false}>
        <UIPopover style={{ bottom: 56, left: 0 }} active={this.state.visible}>
          <div style={{ marginBottom: 16 }}>
            <div className={STYLES_LABEL}>Email</div>
            <ControlledInput
              className={STYLES_INPUT}
              value={this.state.email}
              name={`email`}
              onChange={this._handleChange}
            />
          </div>
          <div>
            <div className={STYLES_LABEL}>Message</div>
            <ControlledInput
              className={STYLES_INPUT}
              value={this.state.message}
              name={`message`}
              onChange={this._handleChange}
              onSubmit={this._handleSubmit}
            />
          </div>

          <UIControl style={{ marginTop: 24 }} onClick={this._handleSubmit}>
            Submit
          </UIControl>
        </UIPopover>
        <div className={STYLES_TRIGGER} onClick={this._handleToggleShow}>
          {this.props.children}
        </div>
      </DOMRectBoundary>
    );
  }
}
