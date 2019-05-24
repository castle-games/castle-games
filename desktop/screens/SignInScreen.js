import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import LoginSignupControl from '~/components/LoginSignupControl';

// TODO(jim):
export default class SignInScreen extends React.Component {
  render() {
    return (
      <LoginSignupControl
        style={{
          backgroundColor: Constants.REFACTOR_COLORS.elements.body,
          color: Constants.REFACTOR_COLORS.text,
        }}
        navigator={this.props.navigator}
      />
    );
  }
}
