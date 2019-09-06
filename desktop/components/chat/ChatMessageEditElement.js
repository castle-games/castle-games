import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Actions from '~/common/actions';

import { css } from 'react-emotion';
import { UserPresenceContext } from '~/contexts/UserPresenceContext';

import ChatInputControl from '~/components/chat/ChatInputControl';
import UIAvatar from '~/components/reusable/UIAvatar';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  padding: 16px 12px 0 16px;
`;

const STYLES_RIGHT = css`
  background: 'red';
  padding-left: 8px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_MESSAGE = css`
  line-height: 16px;
  font-size: 12px;
  margin-top: 2px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_EDIT_ACTIONS = css`
  display: flex;
  padding-left: 8px;
`;

const STYLES_CANCEL = css`
  font-size: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued};
  text-decoration: underline;
  cursor: pointer;
`;

class ChatMessageEditElement extends React.Component {
  static defaultProps = {
    user: {
      name: 'Anonymous',
      photo: {
        url: null,
      },
    },
    theme: {
      textColor: null,
    },
  };

  state = {
    initialValue: '',
  };

  componentDidMount() {
    this._update(null, this.props);
  }

  componentDidUpdate(prevProps) {
    this._update(prevProps, this.props);
  }

  _update = (prevProps, props) => {
    let prevMessage, message;
    if (prevProps && prevProps.message) {
      prevMessage = prevProps.message;
    }
    if (props.message) {
      message = props.message;
    }
    if (prevMessage !== message && message.body) {
      const initialValue = ChatUtilities.messageBodyToPlainText(
        message.body,
        this.props.userIdToUser,
        { useEmojiShortName: true } // revert actual emoji characters back to :emoji:
      );
      this.setState({ initialValue });
    }
  };

  _handleSendMessage = (message) => {
    this.props.onSendMessageEdit(this.props.message, message);
  };

  render() {
    const { message } = this.props;
    const size = this.props.size ? this.props.size : 40;

    return (
      <div className={STYLES_CONTAINER} style={this.props.style}>
        <UIAvatar
          style={{ width: size, height: size }}
          showIndicator={false}
          src={this.props.user.photo ? this.props.user.photo.url : null}
        />
        <span className={STYLES_RIGHT}>
          <div
            className={STYLES_AUTHOR_MESSAGE}
            style={{
              color: this.props.theme.textColor,
            }}>
            <ChatInputControl
              isEditing={true}
              onEditCancel={this.props.onEditCancel}
              onSendMessage={this._handleSendMessage}
              addUsers={this.props.addUsers}
              initialValue={this.state.initialValue}
            />
            <div className={STYLES_EDIT_ACTIONS}>
              <div className={STYLES_CANCEL} onClick={this.props.onEditCancel}>
                Cancel Edit
              </div>
            </div>
          </div>
        </span>
      </div>
    );
  }
}

export default class ChatMessageEditElementWithContext extends React.Component {
  render() {
    return (
      <UserPresenceContext.Consumer>
        {(userPresence) => (
          <ChatMessageEditElement
            addUsers={userPresence.addUsers}
            userIdToUser={userPresence.userIdToUser}
            {...this.props}
          />
        )}
      </UserPresenceContext.Consumer>
    );
  }
}
