import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import { ConnectionStatus } from 'castle-chat-lib';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';
import { SocialContext } from '~/contexts/SocialContext';
import { NavigatorContext } from '~/contexts/NavigationContext';
import { ChatContext } from '~/contexts/ChatContext';

const STYLES_CONTAINER = css`
  flex-shrink: 0;
  height: 100vh;
  font-family: ${Constants.REFACTOR_FONTS.system};
  background: ${Constants.REFACTOR_COLORS.elements.channels};
  color: ${Constants.REFACTOR_COLORS.text};
`;

class ChatSidebar extends React.Component {
  render() {
    const { currentUser, navigator, social, chat } = this.props;

    console.log({ currentUser, navigator, social, chat });

    return <div className={STYLES_CONTAINER}>.</div>;
  }
}

export default class ChatSidebarWithContext extends React.Component {
  render() {
    return (
      <CurrentUserContext.Consumer>
        {(currentUser) => {
          return (
            <SocialContext.Consumer>
              {(social) => {
                return (
                  <ChatContext.Consumer>
                    {(chat) => {
                      return (
                        <NavigatorContext.Consumer>
                          {(navigator) => (
                            <ChatSidebar
                              currentUser={currentUser}
                              navigator={navigator}
                              social={social}
                              chat={chat}
                            />
                          )}
                        </NavigatorContext.Consumer>
                      );
                    }}
                  </ChatContext.Consumer>
                );
              }}
            </SocialContext.Consumer>
          );
        }}
      </CurrentUserContext.Consumer>
    );
  }
}
