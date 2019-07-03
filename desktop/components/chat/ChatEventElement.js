import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Actions from '~/common/actions';

import { css, styled } from 'react-emotion';

import UIMessageBody from '~/components/reusable/UIMessageBody';

const STYLES_CONTAINER = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  flex-shrink: 0;
  width: 100%;
  padding: 8px 48px 8px 16px;
`;

const STYLES_NOTICE = css`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  background-color: yellow;
  border-radius: 4px;
  padding: 8px 0 8px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
`;

const STYLES_SUBDUED = css`
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 0 8px 0;
`;

const STYLES_LEFT = css`
  flex-shrink: 0;
  background-size: cover;
  background-position: 50% 50%;
  height: 40px;
  width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 4px;
`;

const STYLES_RIGHT = css`
  padding-left: 6px;
  min-width: 15%;
  width: 100%;
`;

const STYLES_AUTHOR_NAME = css`
  cursor: pointer;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 700;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_TIMESTAMP = css`
  font-weight: 400;
  color: ${Constants.REFACTOR_COLORS.subdued};
  margin-left: 4px;
  font-size: 10px;
`;

const STYLES_NOTICE_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  color: ${Constants.REFACTOR_COLORS.text};
`;

const STYLES_SUBDUED_MESSAGE = css`
  line-height: 20px;
  font-size: 14px;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-style: italic;
  color: ${Constants.REFACTOR_COLORS.subdued};
`;

const STYLES_ANCHOR = css`
  color: ${Constants.REFACTOR_COLORS.text};
  font-weight: 600;
  text-decoration: underline;
  :hover {
    color: ${Constants.REFACTOR_COLORS.text};
  }
  :visited {
    color: ${Constants.REFACTOR_COLORS.text};
  }
`;

class NoticeMessage extends React.Component {
  render() {
    const { message } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_NOTICE}>
          <span className={STYLES_LEFT}>🏰</span>
          <span className={STYLES_RIGHT}>
            <div className={STYLES_AUTHOR_NAME}>
              Castle Event
              <span className={STYLES_TIMESTAMP}>
                {Strings.toChatDate(this.props.message.timestamp)}
              </span>
            </div>
            <div className={STYLES_NOTICE_MESSAGE}>
              <UIMessageBody
                body={message.body}
                theme={this.props.theme}
                expandAttachments={false}
              />
            </div>
          </span>
        </div>
      </div>
    );
  }
}

class SubduedMessage extends React.Component {
  render() {
    const { message } = this.props;

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SUBDUED}>
          <span className={STYLES_RIGHT}>
            <div className={STYLES_SUBDUED_MESSAGE}>
              <UIMessageBody
                body={message.body}
                theme={this.props.theme}
                expandAttachments={false}
              />
            </div>
          </span>
        </div>
      </div>
    );
  }
}

export default class ChatEventElement extends React.Component {
  static defaultProps = {
    user: {
      name: 'Castle',
      photo: {
        url: null,
      },
    },
  };

  render() {
    const { message } = this.props;
    const type = message && message.body ? message.body.notificationType : null;
    switch (type) {
      case 'game-session':
        return <NoticeMessage {...this.props} />;
      case 'joined-castle':
      default:
        return <SubduedMessage {...this.props} />;
    }
  }
}
