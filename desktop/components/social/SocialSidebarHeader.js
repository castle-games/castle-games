import * as React from 'react';
import * as ChatUtilities from '~/common/chat-utilities';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import Viewer from '~/components/Viewer';

const STYLES_HEADER = css`
  background: #ececed;
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  height: ${Constants.sidebar.collapsedWidth};
  max-height: ${Constants.sidebar.collapsedWidth};
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_VIEWER = css`
  display: flex;
  width: ${Constants.sidebar.collapsedWidth};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const STYLES_HEADER_LEFT = css`
  padding: 8px 8px 8px 16px;
  min-width: 25%;
  width: 100%;
`;

const STYLES_H2 = css`
  font-size: 12px;
`;

const STYLES_P = css`
  margin: 4px 0 4px 0;
  font-size: 12px;
  line-height: 14px;
  height: 12px;
  color: ${Constants.REFACTOR_COLORS.subdued};

  span {
    display: inline-block;
    vertical-align: top;
  }
`;

const STYLES_ONLINE = css`
  color: ${Constants.REFACTOR_COLORS.subdued}:
  cursor: pointer;

  span {
    padding: 0 8px 0 8px;
  }

  #action {
    display: inline;
    cursor: pointer;

    :hover {
      color: magenta;
    }
  }
`;

const STYLES_LINK = css`
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
`;

const STYLES_CHANNEL_NAME = css``;

export default class SocialSidebarHeader extends React.Component {
  static defaultProps = {
    isExpanded: true,
  };

  _renderTitle = () => {
    const { channel, onChannelClick } = this.props;
    let content;
    if (channel.type === 'dm') {
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {channel.name}
        </span>
      );
    } else {
      let name;
      if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
        name = 'Community Chat';
      } else {
        name = channel.name;
      }
      content = (
        <span className={STYLES_CHANNEL_NAME} onClick={onChannelClick}>
          {name}
        </span>
      );
    }
    return <h2 className={STYLES_H2}>{content}</h2>;
  };

  _getHeading = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'dm':
        return `A private conversation with ${channel.name}`;
      case 'game':
        return `People playing ${channel.name}`;
      default:
        if (channel.name === ChatUtilities.EVERYONE_CHANNEL_NAME) {
          return 'Everyone on Castle';
        }
        break;
    }
    return 'This is a public channel.';
  };

  _getLeaveMessage = () => {
    const { channel } = this.props;
    switch (channel.type) {
      case 'dm':
        return 'Leave conversation';
        break;
      default:
        return 'Leave channel';
        break;
    }
  };

  _renderActions = () => {
    const { channel, numChannelMembers } = this.props;
    if (channel.type !== 'dm' && numChannelMembers) {
      return (
        <span className={STYLES_ONLINE} onClick={this.props.onMembersClick}>
          <span>&middot;</span>
          <div id="action">{numChannelMembers} online</div>
        </span>
      );
    } else {
      return null;
    }
  };

  render() {
    const { channel, isExpanded } = this.props;
    if (!channel) {
      return null;
    }

    return (
      <header className={STYLES_HEADER}>
        {isExpanded ? (
          <div className={STYLES_HEADER_LEFT}>
            {this._renderTitle()}
            <p className={STYLES_P}>
              <span>{this._getHeading()}</span>
              {this._renderActions()}
            </p>
          </div>
        ) : null}
        <div className={STYLES_VIEWER}>
          <Viewer />
        </div>
      </header>
    );
  }
}
