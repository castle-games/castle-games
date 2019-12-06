import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as NativeUtil from '~/native/nativeutil';
import * as Strings from '~/common/strings';
import * as Analytics from '~/common/analytics';

import { css } from 'react-emotion';

import SignInPrompt from '~/components/SignInPrompt';
import UIInputSecondary from '~/components/reusable/UIInputSecondary';
import UIButton from '~/components/reusable/UIButton';
import UIUserPreview from '~/components/reusable/UIUserPreview';

const STYLES_CONTENTS = css`
  width: 100%;
  max-width: 528px;
  padding: 24px;
`;

const STYLES_LEGAL_TEXT = css`
  margin-top: 16px;
  font-size: 13px;
`;

const STYLES_SPACER = css`
  height: 16px;
`;

const STYLES_HEADING = css`
  font-family: ${Constants.font.heading};
  font-size: 24px;
  margin-bottom: 16px;
`;

const STYLES_PARAGRAPH = css`
  line-height: ${Constants.linescale.base};
  font-size: 14px;
  font-weight: 400;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const STYLES_FOOTER = css`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 24px;
`;

const STYLES_ACTION = css`
  font-family: ${Constants.font.default};
  color: #0069ff;
  text-decoration: underline;
  cursor: pointer;
  transition: 200ms ease color;

  :hover {
    color: ${Constants.colors.brand2};
  }
`;

const STYLES_ERROR_MESSAGE = css`
  background: ${Constants.colors.error};
  color: ${Constants.colors.white};
  flex-shrink: 0;
  display: flex;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin: 16px 0 16px 0;
`;

const ErrorMessage = (props) => {
  return <h5 className={STYLES_ERROR_MESSAGE}>{props.children}</h5>;
};

export default class LoginSignupScreen extends React.Component {
  // steps:
  //  WHO - input who you are
  //  PASSWORD - put in your password
  //  SIGNUP - create an account

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

    identifyUserError: null,
    signupError: null,
    loginError: null,
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

  _handleViewPrivacyPolicy = () => {
    NativeUtil.openExternalURL(`${Constants.WEB_HOST}/legal/privacy`);
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
      identifyUserError: null,
    });
  };

  _goToSuccess = () => {
    this.props.onSignIn && this.props.onSignIn(this.state.localViewer);
    this.setState({ step: 'SUCCESS' });
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
        return <div />; // won't be seen because we redirect
      default:
        return this._renderWho();
    }
  }

  _handlePasswordReset = async (e) => {
    if (!this.state.suggestedUser || !this.state.suggestedUser.userId) {
      console.error('Cannot reset password: No user');
      return;
    }

    Actions.sendResetPasswordEmail({
      userId: this.state.suggestedUser.userId,
    });
  };

  _handleLoginAsync = async (e) => {
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

    Analytics.trackLogin({ user });

    this.setState({ localViewer: user }, this._goToSuccess);
  };

  _handleSubmitEmailAsync = async (e) => {
    e.preventDefault();

    if (!this.state.whoSubmitEnabled) {
      return;
    }

    this.setState({ whoSubmitEnabled: false });
    let user;
    try {
      user = await Actions.getExistingUser({ who: this.state.who });
    } catch (e) {
      this.setState({
        identifyUserError: `There was a problem looking up the email or username. Are you connected to the internet? (${e.message})`,
        whoSubmitEnabled: true,
      });
      return;
    }

    if (user) {
      await this.setState({
        suggestedUser: user,
      });
      this._goToPassword();
    } else {
      this._goToSignup();
    }
  };

  _handleSignUpAsync = async (e) => {
    e.preventDefault();

    if (!this.state.signupSubmitEnabled) {
      return;
    }

    this.setState({ signupSubmitEnabled: false });

    try {
      const response = await Actions.signup({
        name: this.state.name,
        username: this.state.username ? this.state.username.toLowerCase() : '',
        email: this.state.email ? this.state.email.toLowerCase() : '',
        password: this.state.password,
      });

      let localViewer;
      if (response && response.data && response.data.signup) {
        localViewer = response.data.signup;
        Analytics.trackSignUp({ user: localViewer });
        this.setState({ localViewer, signupError: null }, this._goToSuccess);
        return;
      }
      if (!localViewer) {
        throw new Error(`Server didn't respond with a user`);
      }
    } catch (e) {
      this.setState({
        signupError: e.message,
        signupSubmitEnabled: true,
      });
    }
  };

  _handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

  _renderPassword = () => {
    let maybeErrorNode;
    if (!Strings.isEmpty(this.state.loginError)) {
      maybeErrorNode = <h5 className={STYLES_ERROR_MESSAGE}>Error: {this.state.loginError}</h5>;
    }

    return (
      <div className={STYLES_CONTENTS}>
        <form onSubmit={this._handleLoginAsync}>
          <UIUserPreview user={this.state.suggestedUser} />
          <div className={STYLES_SPACER} />
          {maybeErrorNode}

          <UIInputSecondary
            key="login-password"
            autoFocus={true}
            label="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={this._handleChange}
            value={this.state.password}
          />
          <div className={STYLES_SPACER} />
          <UIButton onClick={this._handleLoginAsync}>Sign in</UIButton>
          <div
            style={{ margin: `16px 0 16px 0` }}
            className={STYLES_ACTION}
            onClick={this._handlePasswordReset}>
            → Reset Your Password
          </div>
        </form>

        <div className={STYLES_FOOTER}>
          Not {this.state.suggestedUser.name || '@' + this.state.suggestedUser.username}?{' '}
          <span className={STYLES_ACTION} onClick={this._goToWho}>
            Sign in
          </span>{' '}
          as someone else or{' '}
          <span className={STYLES_ACTION} onClick={this._goToSignup}>
            create a new account
          </span>
          .
        </div>
      </div>
    );
  };

  _renderSignup = () => {
    let maybeErrorNode;
    if (!Strings.isEmpty(this.state.signupError)) {
      maybeErrorNode = <h5 className={STYLES_ERROR_MESSAGE}>Error: {this.state.signupError}</h5>;
    }

    return (
      <div className={STYLES_CONTENTS}>
        <form onSubmit={this._handleSignUpAsync}>
          <div className={STYLES_HEADING}>Create a Castle account</div>
          {maybeErrorNode}
          <UIInputSecondary
            autoFocus
            label="username"
            name="username"
            placeholder="Username"
            onChange={this._handleChange}
            value={this.state.username}
          />
          <div className={STYLES_SPACER} />
          <UIInputSecondary
            label="name"
            name="name"
            type="text"
            placeholder="Your name"
            onChange={this._handleChange}
            value={this.state.name}
          />
          <div className={STYLES_SPACER} />
          <UIInputSecondary
            label="email"
            name="email"
            type="email"
            noValidate
            placeholder="E-mail address"
            onChange={this._handleChange}
            value={this.state.email}
          />
          <div className={STYLES_SPACER} />
          <UIInputSecondary
            label="password"
            name="password"
            type="password"
            placeholder="New password"
            onChange={this._handleChange}
            value={this.state.password}
          />
          <div className={STYLES_LEGAL_TEXT}>
            By clicking "Create Account," you are agreeing to Castle's{' '}
            <span className={STYLES_ACTION} onClick={this._handleViewPrivacyPolicy}>
              privacy policy.
            </span>
          </div>
          <div className={STYLES_SPACER} />
          <UIButton onClick={this._handleSignUpAsync}>Create Account</UIButton>
        </form>

        <div className={STYLES_FOOTER}>
          Already have an account?{' '}
          <span className={STYLES_ACTION} onClick={this._goToWho}>
            Sign in
          </span>{' '}
          instead.
        </div>
      </div>
    );
  };

  _renderWho = () => {
    let maybeErrorNode;
    if (!Strings.isEmpty(this.state.identifyUserError)) {
      maybeErrorNode = (
        <h5 className={STYLES_ERROR_MESSAGE}>Error: {this.state.identifyUserError}</h5>
      );
    }
    return (
      <div className={STYLES_CONTENTS}>
        <form onSubmit={this._handleSubmitEmailAsync}>
          <div className={STYLES_HEADING}>Sign in or create account</div>
          <SignInPrompt />
          {maybeErrorNode}
          <UIInputSecondary
            value=""
            autoFocus
            label="Email or Username"
            name="who"
            placeholder=""
            onChange={this._handleChange}
            value={this.state.who}
          />
          <div className={STYLES_SPACER} />
          <UIButton
            type="submit"
            disabled={!this.state.whoSubmitEnabled}
            onFocus={this._handleSubmitEmailAsync}
            onClick={this._handleSubmitEmailAsync}>
            Continue
          </UIButton>
          <div className={STYLES_FOOTER}>
            You'll have another chance to review your info before submitting.
          </div>
        </form>
      </div>
    );
  };
}
