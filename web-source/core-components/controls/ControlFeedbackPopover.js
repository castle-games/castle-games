import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UIPopover from '~/core-components/reusable/UIPopover';
import DOMRectBoundary from '~/core-components/primitives/DOMRectBoundary';
import UIInput from '~/core-components/reusable/UIInput';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTROL = css`
  position: relative;
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

    this.setState({ email: null, message: null, visible: false });
  };

  render() {
    return (
      <DOMRectBoundary
        className={STYLES_CONTROL}
        onDismiss={this._handleHide}
        captureScroll={false}>
        <UIPopover style={{ bottom: 0, left: 0 }} active={this.state.visible}>
          <div style={{ marginBottom: 16 }}>
            <UIInput
              value={this.state.email}
              label="E-mail"
              name={`email`}
              onChange={this._handleChange}
            />

            <UIInput
              value={this.state.message}
              label="message"
              name={`message`}
              onChange={this._handleChange}
              onSubmit={this._handleSubmit}
            />
          </div>

          <UIControl style={{ marginTop: 24 }} onClick={this._handleSubmit}>
            Submit
          </UIControl>
        </UIPopover>
        <div onClick={this._handleToggleShow}>{this.props.children}</div>
      </DOMRectBoundary>
    );
  }
}
