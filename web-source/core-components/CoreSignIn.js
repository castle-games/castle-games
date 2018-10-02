import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import ControlledInput from '~/core-components/primitives/ControlledInput';

const STYLES_CONTAINER = css`
  @keyframes authentication-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: authentication-animation 280ms ease;

  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CONTENTS = css`
  paddidng: 16px;
`;

const STYLES_INPUT = css`
  margin: 0;
  padding: 0 8px 0 8px;
  width: 100%;
  border: 4px solid ${Constants.colors.foreground};
  background: ${Constants.colors.background};
  color: ${Constants.colors.white};
  height: 48px;

  :focus {
    outline: 0;
  }
`;

const STYLES_BUTTON = css`
  paddding: 12px;
`;

export default class CoreSignIn extends React.Component {
  state = {
    username: '',
    password: '',
  };

  _handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <h1>Hello World</h1>
          <p>Hello Worldd</p>
          <ControlledInput
            onChange={this._handleChange}
            name="username"
            value={this.state.username}
            className={STYLES_INPUT}
          />
          <ControlledInput
            onChange={this._handleChange}
            type="password"
            name="password"
            value={this.state.password}
            className={STYLES_INPUT}
          />
          <button className={STYLES_BUTTON} onClick={this.props.onToggleBrowse}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

/*
import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIHeaderDismiss from '~/core-components/reusable/UIHeaderDismiss';
import UIEmptyState from '~/core-components/reusable/UIEmptyState';
import UILink from '~/core-components/reusable/UILink';
import UIControl from '~/core-components/reusable/UIControl';

const STYLES_CONTAINER = css`
  @keyframes authentication-animation {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  animation: authentication-animation 280ms ease;

  width: 420px;
  height: 100%;
  overflow-y: scroll;
  background ${Constants.colors.background};
  border-left: 1px solid ${Constants.colors.border};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

export default class CoreRootAuthenticateForm extends React.Component {
  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <UIHeaderDismiss onDismiss={this.props.onDismiss} />
        <UIEmptyState title="Authenticate">
          <span onClick={this.props.onSubmit} style={{ fontWeight: 600 }}>
            Click this
          </span>{' '}
          to test authentication example.
        </UIEmptyState>
      </div>
    );
  }
}
*/
