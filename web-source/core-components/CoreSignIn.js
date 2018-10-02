import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIInput from '~/core-components/reusable/UIInput';
import UIButton from '~/core-components/reusable/UIButton';
import UIHeadingGroup from '~/core-components/reusable/UIHeadingGroup';

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

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background ${Constants.brand.background};
  color: ${Constants.brand.text};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_TOP = css`
  display: flex;
  min-height: 25%;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const STYLES_BOTTOM = css`
  border-top: ${Constants.brand.foreground} 1px solid;
  color: ${Constants.brand.line};
  display: flex;
  align-items: center;
  height: 48px;
  width: 100%;
  flex-shrink: 0;
  padding: 0 24px 0 24px;
`;

const STYLES_CONTENTS = css`
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
`;

const STYLES_LINK = css`
  font-weight: 600;
  color: ${Constants.brand.line};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 24px;
  top: 8px;
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
        <div className={STYLES_TOP}>
          <div className={STYLES_CONTENTS}>
            <UIHeadingGroup title="Welcome!">
              Enter your username and password to create a new account or sign into an existing one.
            </UIHeadingGroup>
            <UIInput
              label="username"
              name="username"
              placeholder="Type a username..."
              onChange={this._handleChange}
              value={this.state.username}
            />
            <UIInput
              label="password"
              name="password"
              type="password"
              placeholder="Type a password..."
              onChange={this._handleChange}
              value={this.state.password}
            />
            <UIButton>Submit</UIButton>
          </div>
        </div>

        <div className={STYLES_BOTTOM}>
          <span className={STYLES_LINK}>Terms of Service</span>
          <span className={STYLES_LINK}>Privacy Policy</span>
        </div>
      </div>
    );
  }
}
