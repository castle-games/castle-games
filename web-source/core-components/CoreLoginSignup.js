import React from 'react';
import { css } from 'react-emotion';

import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import UIInput from '~/core-components/reusable/UIInput';
import UIButton from '~/core-components/reusable/UIButton';
import UIHeadingGroup from '~/core-components/reusable/UIHeadingGroup';
import UILink from '~/core-components/reusable/UILink';
import UIUserPreview from '~/core-components/reusable/UIUserPreview';

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
  overflow-y: scroll;
  background ${Constants.colors.background};
  color: ${Constants.colors.white};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_CONTENTS = css`
  padding: 88px 16px 88px 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 320px;
`;

const STYLES_FOOTER = css`
  color: ${Constants.colors.white80};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 24px;
`;

const STYLES_ERROR_MESSAGE = css`
  flex-shrink: 0;
  display: block;
  padding-bottom: 24px;
  color: ${Constants.colors.red};
`;

export default class CoreLoginSignup extends React.Component {
  // steps:
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
    step: 'WHO',

    whoSubmitEnabled: true,
    passwordSubmitEnabled: true,
    signupSubmitEnabled: true,

    localViewer: null,
    suggestedUser: null,

    signupError: null,
  };

  _goToSignup = () => {
    let s = {
      step: 'SIGNUP',
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
  };

  _goToPassword = () => {
    this.setState({
      step: 'PASSWORD',
      passwordSubmitEnabled: true,
      loginError: null,
    });
  };

  _goToWho = () => {
    this.setState({
      step: 'WHO',
      whoSubmitEnabled: true,
    });
  };

  _goToSuccess = () => {
    this.setState({ step: 'SUCCESS' }, () => {
      this.props.onLogin(this.state.localViewer);
    });
  };

  render() {
    switch (this.state.step) {
      case 'WHO':
        return this._renderWho();
      case 'PASSWORD':
        return this._renderPassword();
      case 'SIGNUP':
        return this._renderSignup();
      case 'SUCCESS':
        return this._renderSuccess();
      default:
        this.setState({ step: 'WHO' });
        return this._renderWho();
    }
  }

  _handleLoginAsync = async e => {
    e.preventDefault();

    if (!this.state.passwordSubmitEnabled) {
      return;
    }

    this.setState({ passwordSubmitEnabled: false });

    const user = await Actions.login({
      userId: this.state.suggestedUser.userId,
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

    this.setState({ localViewer: user }, this._goToSuccess);
  };

  _handleSubmitEmailAsync = async e => {
    e.preventDefault();

    if (!this.state.whoSubmitEnabled) {
      return;
    }

    this.setState({ whoSubmitEnabled: false });
    const user = await Actions.getExistingUser({ who: this.state.who });

    if (user) {
      this.setState({
        suggestedUser: user,
      });
      this._goToPassword();

      return;
    }

    this._goToSignup();
  };

  _handleSignUpAsync = async e => {
    e.preventDefault();

    if (!this.state.signupSubmitEnabled) {
      return;
    }

    this.setState({ signupSubmitEnabled: false });

    const response = await Actions.signup({
      name: this.state.name,
      username: this.state.username ? this.state.username.toLowerCase() : '',
      email: this.state.email ? this.state.email.toLowerCase() : '',
      password: this.state.password,
    });

    if (response.errors) {
      this.setState({
        signupError: response.errors[0].message,
        signupSubmitEnabled: true,
      });
    } else {
      let localViewer;

      if (response && response.data && response.data.signup) {
        localViewer = response.data.signup;
        this.setState({ localViewer, signupError: null }, this._goToSuccess);
        return;
      }

      if (!localViewer) {
        this.setState({
          signupError: "Server didn't respond with an user",
          signupSubmitEnabled: true,
        });
      }
    }
  };

  _handleChange = e => this.setState({ [e.target.name]: e.target.value });

  // TODO(jim): The user won't even see this because authentication takes them to
  // another scene almost immediately.
  _renderSuccess = () => {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <UIHeadingGroup title="Successfully signed in">
            <UIUserPreview user={this.state.localViewer} />
          </UIHeadingGroup>
        </div>
      </div>
    );
  };

  _renderPassword = () => {
    let imgSrc = Constants.TRANSPARENT_GIF_DATA_URL;

    // TODO(jim): How reliable is this? Where does imgixURL come from?
    if (
      this.state.suggestedUser &&
      this.state.suggestedUser.photo &&
      this.state.suggestedUser.photo.imgixUrl
    ) {
      imgSrc = this.state.suggestedUser.photo.imgixUrl;
    }

    let maybeErrorNode;
    if (!Strings.isEmpty(this.state.loginError)) {
      maybeErrorNode = <h5 className={STYLES_ERROR_MESSAGE}>{this.state.loginError}</h5>;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form onSubmit={this._handleLoginAsync}>
            <UIHeadingGroup title="Sign in">
              <UIUserPreview user={this.state.suggestedUser} />
            </UIHeadingGroup>
            {maybeErrorNode}

            <UIInput
              key="login-password"
              autoFocus={true}
              label="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={this._handleChange}
              value={this.state.password}
            />
            <UIButton onClick={this._handleLoginAsync}>Sign in</UIButton>
          </form>

          <div className={STYLES_FOOTER}>
            Not {this.state.suggestedUser.name || '@' + this.state.suggestedUser.username}?{' '}
            <UILink onClick={this._goToWho}>Sign in</UILink> as someone else or{' '}
            <UILink onClick={this._goToSignup}>create a new account</UILink>.
          </div>
        </div>
      </div>
    );
  };

  _renderSignup = () => {
    let maybeErrorNode;
    if (!Strings.isEmpty(this.state.signupError)) {
      maybeErrorNode = <h5 className={STYLES_ERROR_MESSAGE}>{this.state.signupError}</h5>;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form onSubmit={this._handleSignUpAsync}>
            <UIHeadingGroup title="Create a Castle account" />
            {maybeErrorNode}
            <UIInput
              autoFocus
              label="username"
              name="username"
              placeholder="Username"
              onChange={this._handleChange}
              value={this.state.username}
            />
            <UIInput
              label="name"
              name="name"
              type="text"
              placeholder="Your name"
              onChange={this._handleChange}
              value={this.state.name}
            />
            <UIInput
              label="email"
              name="email"
              type="email"
              noValidate
              placeholder="E-mail address"
              onChange={this._handleChange}
              value={this.state.email}
            />

            <UIInput
              label="password"
              name="password"
              type="password"
              placeholder="New password"
              onChange={this._handleChange}
              value={this.state.password}
            />
            <UIButton onClick={this._handleSignUpAsync}>Create Account</UIButton>
          </form>

          <div className={STYLES_FOOTER}>
            Already have an account? <UILink onClick={this._goToWho}>Sign in</UILink> instead.
          </div>
        </div>
      </div>
    );
  };

  _renderWho = () => {
    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENTS}>
          <form onSubmit={this._handleSubmitEmailAsync}>
            <UIHeadingGroup title="Sign in or create account">
              Sign in or register with Castle to share art and games you've made.
            </UIHeadingGroup>
            <UIInput
              value=""
              autoFocus
              label="Email or Username"
              name="who"
              placeholder=""
              onChange={this._handleChange}
              value={this.state.who}
            />
            <UIButton
              type="submit"
              onFocus={this._handleSubmitEmailAsync}
              onClick={this._handleSubmitEmailAsync}>
              Continue
            </UIButton>
            <div className={STYLES_FOOTER}>
              You'll have another chance to review your info before submitting.
            </div>
          </form>
        </div>
      </div>
    );
  };
}
