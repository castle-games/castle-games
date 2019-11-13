import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';

import LoginSignupControl from '~/components/LoginSignupControl';
import UIButton from '~/components/reusable/UIButton';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.system};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${Constants.colors.background};
  color: ${Constants.colors.text};
`;

const STYLES_PREFACE = css`
  max-width: 512px;

  h2 {
    font-family: ${Constants.font.heading};
    font-size: 24px;
    margin-bottom: 16px;
  }

  p {
    line-height: ${Constants.linescale.base};
    font-size: 14px;
    font-weight: 400;
    margin-top: 16px;
    margin-bottom: 12px;
  }
`;

const STYLES_ACTIONS = css`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  width: 100%;

  div {
    cursor: pointer;
    text-decoration: underline;
    color: fuchsia;
    padding: 8px 0;
  }
`;

export default class SignInScreen extends React.Component {
  static contextType = CurrentUserContext;
  static defaultProps = {
    navigateToHome: () => {},
  };
  state = {
    mode: 'preface', // 'preface' or 'sign-in'
  };

  _handleDidSignIn = async (user) => {
    await this.context.setCurrentUser(user);
    this.props.navigateToHome();
    this.context.refreshCurrentUser();
  };

  _handleContinueAsGuest = async () => {
    const { user } = this.context;
    if (user) {
      // already a guest
      return this.props.navigateToHome();
    } else {
      let user;
      try {
        user = await Actions.createAnonymousUser();
      } catch (e) {
        console.warn(`Error during initial app auth: ${e}`);
      }
      if (user) {
        await this.context.setCurrentUser(user);
      }
    }
  };

  _renderPreface = () => {
    const { user } = this.context;
    if (user && user.isAnonymous) {
      return (
        <div className={STYLES_PREFACE}>
          <h2>Welcome, stranger!</h2>
          <p>You're browsing Castle as a guest.</p>
          <p>
            As a guest, you can play games, make games, and read the community chat. You get a
            temporary name and avatar, and other people can see that you are a guest.
          </p>
          <p>
            To customize your profile, share your games with others, and chat with others, please
            sign in or create a Castle account.
          </p>
          <div className={STYLES_ACTIONS}>
            <UIButton onClick={() => this.setState({ mode: 'sign-in' })}>
              Register or Sign In
            </UIButton>
            <div onClick={this._handleContinueAsGuest}>Continue as a guest</div>
          </div>
        </div>
      );
    } else if (this.context.timeLastLoaded) {
      return (
        <div className={STYLES_PREFACE}>
          <h2>You're signed out of Castle</h2>
          <p>
            Welcome back! Please sign in to make and play games in Castle, or continue as a guest.
          </p>
          <div className={STYLES_ACTIONS}>
            <UIButton onClick={() => this.setState({ mode: 'sign-in' })}>
              Register or Sign In
            </UIButton>
            <div onClick={this._handleContinueAsGuest}>Continue as a guest</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={STYLES_PREFACE}>
          <h2>We weren't able to load Castle properly.</h2>
          <p>
            This can happen if you load Castle for the very first time without an internet
            connection. Try signing in to Castle, or check your internet connection and launch
            Castle again.
          </p>
          <div className={STYLES_ACTIONS}>
            <UIButton onClick={() => this.setState({ mode: 'sign-in' })}>Sign In</UIButton>
          </div>
        </div>
      );
    }
  };

  render() {
    const { mode } = this.state;

    let content;
    switch (mode) {
      case 'sign-in':
        content = <LoginSignupControl onSignIn={this._handleDidSignIn} />;
        break;
      case 'preface':
      default:
        content = this._renderPreface();
        break;
    }

    return <div className={STYLES_CONTAINER}>{content}</div>;
  }
}
