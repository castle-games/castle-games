import React from 'react';
import { css } from 'react-emotion';

import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import UIInput from '~/core-components/reusable/UIInput';
import UIButton from '~/core-components/reusable/UIButton';
import UIHeadingGroup from '~/core-components/reusable/UIHeadingGroup';
import UILink from '~/core-components/reusable/UILink';

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
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CONTENTS = css`
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
`;

export default class CoreLoginSignup extends React.Component {
  // states:
  //  WHO - input who you are
  //  PASSWORD - put in your password
  //  SIGNUP - create an account
  static defaultProps = {
    onLogin: () => {},
  };

  state = {
    who: '',
    password: '',
    email: '',
    name: '',
    username: '',
    s: 'WHO',

    whoSubmitEnabled: true,
    passwordSubmitEnabled: true,
    signupSubmitEnabled: true,
  };

  async _submitEmailAsync() {
    if (!this.state.whoSubmitEnabled) {
      return;
    }

    this.setState({ whoSubmitEnabled: false });
    const user = await Actions.getExistingUser({ who: this.state.who });

    if (user) {
      this.setState({
        loginUser: user,
      });
      this._goToPassword();

      return;
    }

    this._goToSignup();
  }

  _goToSignup() {
    let s = {
      s: 'SIGNUP',
      signupSubmitEnabled: true,
    };

    let who = this.state.who;
    if (who && who.indexOf(' ') !== -1) {
      s.name = who;
    } else if (who && who.indexOf('@') !== -1) {
      s.email = who;
    } else if (who) {
      s.username = who;
    }
    this.setState(s);
  }

  _goToPassword() {
    this.setState({
      s: 'PASSWORD',
      passwordSubmitEnabled: true,
      loginError: null,
    });
  }

  _goToWho() {
    this.setState({
      s: 'WHO',
      whoSubmitEnabled: true,
    });
  }

  render() {
    switch (this.state.s) {
      case 'WHO':
        return this._renderWho();
      case 'PASSWORD':
        return this._renderPassword();
      case 'SIGNUP':
        return this._renderSignup();
      case 'SUCCESS':
        return this._renderSuccess();
      default:
        this.setState({ s: 'WHO' });
        return this._renderWho();
    }
  }

  async _loginAsync() {
    if (!this.state.passwordSubmitEnabled) {
      return;
    }

    this.setState({ passwordSubmitEnabled: false });

    const user = await Actions.login({
      userId: this.state.loginUser.userId,
      password: this.state.password,
    });

    if (!user) {
      return;
    }

    if (user.errors) {
      if (user.errors.length > 0) {
        this.setState({
          passwordSubmitEnabled: true,
          loginError: user.errors[0].message,
        });
      }

      return;
    }

    this.setState({ loggedInUser: user }, this._goToSuccess);
  }

  _goToSuccess() {
    this.setState({ s: 'SUCCESS' }, () => {
      this.props.onLogin(this.state.loggedInUser);
    });
  }

  async _signupAsync() {
    if (!this.state.signupSubmitEnabled) {
      return;
    }

    this.setState({ signupSubmitEnabled: false });

    const loggedInUser = await Actions.signup({
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    });

    if (loggedInUser) {
      this.setState({ loggedInUser }, this._goToSuccess);
    }
  }

  _renderSuccess() {
    let imgSrc = Constants.TRANSPARENT_GIF_DATA_URL;
    if (this.state.loginUser.photo && this.state.loginUser.photo.imgixUrl) {
      imgSrc = this.state.loginUser.photo.imgixUrl;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <UIHeadingGroup title="Successfully signed in">
            <h3>{this.state.loginUser.name}</h3>
            <h5>{'@' + this.state.loginUser.username}</h5>
          </UIHeadingGroup>
        </div>
      </div>
    );
  }

  _renderPassword() {
    let imgSrc = Constants.TRANSPARENT_GIF_DATA_URL;
    if (this.state.loginUser.photo && this.state.loginUser.photo.imgixUrl) {
      imgSrc = this.state.loginUser.photo.imgixUrl;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form
            onSubmit={event => {
              event.preventDefault();
              this._loginAsync();
            }}>
            <UIHeadingGroup title="Sign in">
              <h3>{this.state.loginUser.name}</h3>
              <h5>{'@' + this.state.loginUser.username}</h5>
            </UIHeadingGroup>
            <h5
              style={{
                paddingBottom: 8,
                height: 24,
                color: Constants.base.red,
              }}>
              {this.state.loginError || ' '}
            </h5>
            <UIInput
              key="login-password"
              autoFocus={true}
              label="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={event => {
                this.setState({ password: event.target.value });
              }}
              value={this.state.password}
            />
            <UIButton
              onClick={event => {
                event.preventDefault();
                this._loginAsync();
              }}>
              Sign in
            </UIButton>
          </form>
        </div>

        <p />
        <p>
          Not {this.state.loginUser.name || '@' + this.state.loginUser.username}?{' '}
          <UILink
            onClick={event => {
              event.preventDefault();
              this._goToWho();
            }}>
            Sign in as someone else
          </UILink>{' '}
          or{' '}
          <UILink
            onClick={event => {
              event.preventDefault();
              this._goToSignup();
            }}>
            Create a new account
          </UILink>
        </p>
        <p />
        <p>
          Forgot your password?
          <UILink
            onClick={event => {
              event.preventDefault();
              alert('Not implemented yet! :( E-mail ccheever@expo.io to get it reset');
            }}>
            &nbsp;Reset it
          </UILink>
        </p>
      </div>
    );
  }

  _renderSignup() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form
            onSubmit={event => {
              event.preventDefault();
              this._signupAsync();
            }}>
            <UIHeadingGroup title="Create a Castle account" />
            <UIInput
              autoFocus
              label="username"
              name="username"
              placeholder="Username"
              onChange={event => {
                this.setState({ username: event.target.value });
              }}
              value={this.state.username}
            />
            <UIInput
              label="name"
              name="name"
              type="text"
              placeholder="Your name"
              onChange={event => {
                this.setState({ name: event.target.value });
              }}
              value={this.state.name}
            />
            <UIInput
              label="email"
              name="email"
              type="email"
              noValidate={true}
              placeholder="E-mail address"
              onChange={event => {
                this.setState({ email: event.target.value });
              }}
              value={this.state.email}
            />

            <UIInput
              label="password"
              name="password"
              type="password"
              placeholder="New password"
              onChange={event => {
                this.setState({ password: event.target.value });
              }}
              value={this.state.password}
            />
            <UIButton
              onClick={() => {
                this._signupAsync();
              }}>
              Create Account
            </UIButton>
          </form>
        </div>

        <p>
          Already have an account?{' '}
          <UILink
            onClick={() => {
              this._goToWho();
            }}>
            Sign in instead
          </UILink>
        </p>
      </div>
    );
  }

  _renderWho() {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form
            onSubmit={event => {
              event.preventDefault();
              this._submitEmailAsync();
            }}>
            <UIHeadingGroup title="Sign in or Create Account" />
            <p
              style={{
                paddingBottom: 24,
                color: Constants.base.gray,
              }}>
              <small>
                Sign in to create playlists and share art and games you've made with everyone on
                Castle.
              </small>
            </p>
            <UIInput
              value=""
              autoFocus={true}
              label="Your account"
              name="email"
              placeholder="E-mail or username"
              onChange={event => {
                this.setState({ who: event.target.value });
              }}
              value={this.state.who}
            />
            <UIButton
              value="Next"
              type="submit"
              onFocus={event => {
                this._submitEmailAsync();
              }}
              onClick={event => {
                event.preventDefault();
                this._submitEmailAsync();
              }}>
              Next
            </UIButton>
          </form>
        </div>
      </div>
    );
  }
}
