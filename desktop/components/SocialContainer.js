import * as React from 'react';
import { css } from 'react-emotion';

import ChatContainer from '~/components/social/ChatContainer';
import * as Constants from '~/common/constants';
import { CurrentUserContext } from '~/contexts/CurrentUserContext';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.white};
  width: 30vh;
  min-width: 280px;
`;

export default class SocialContainer extends React.Component {
  static contextType = CurrentUserContext;
  render() {
    let { user } = this.context;
    let contentElement;
    if (user) {
      contentElement = (
        <ChatContainer />
      );
    } else {
      // TODO: what happens here when you aren't logged in?
      contentElement = (<span>Log in to chat</span>);
    }
    return (
      <div className={STYLES_CONTAINER}>
        {contentElement}
      </div>
    );
  }
}
