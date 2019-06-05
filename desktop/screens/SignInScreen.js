import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';
import { SocialContext } from '~/contexts/SocialContext';
import { ChatSessionContext } from '~/contexts/ChatSessionContext';

import LoginSignupControl from '~/components/LoginSignupControl';

// TODO(jim): delete LoginSignupControl at some point.
export default class SignInScreen extends React.Component {
  render() {
    return (
      <SocialContext.Consumer>
        {(social) => {
          return (
            <ChatSessionContext.Consumer>
              {(chat) => {
                return (
                  <LoginSignupControl
                    chat={chat}
                    social={social}
                    navigator={this.props.navigator}
                  />
                );
              }}
            </ChatSessionContext.Consumer>
          );
        }}
      </SocialContext.Consumer>
    );
  }
}
