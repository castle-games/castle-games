import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIButton from '~/components/reusable/UIButton';

const DIRECT_MESSAGE_PREFIX = 'dm-';

const STYLES_CONTAINER = css`
  height: 100%;
  min-height: 25%;
  width: 100%;
  overflow-y: scroll;
  overflow-wrap: break-word;
  padding: 16px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const STYLES_CHANNEL_OPTION = css`
  border-radius: 4px;
  border: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  font-family: ${Constants.REFACTOR_FONTS.system};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  padding: 16px;
  margin-bottom: 16px;
  transition: 200ms ease all;
  transition-property: color, background;
  cursor: pointer;
`;

const STYLES_CHANNEL_TITLE = css`
  font-weight: 600;
  font-size: 18px;
`;

const STYLES_CHANNEL_PARAGRAPH = css`
  margin-top: 16px;
  line-height: 1.5;
`;

const STYLES_COLUMN = css`
  max-width: 672px;
  margin: 88px auto 0 auto;
  padding: 0 24px 72px 24px;
`;

const ChannelOptionItem = (props) => {
  return (
    <div className={STYLES_CHANNEL_OPTION}>
      <h2 className={STYLES_CHANNEL_TITLE}>{props.title}</h2>
      <p className={STYLES_CHANNEL_PARAGRAPH}>{props.children}</p>
      <div style={{ marginTop: 32 }}>
        <UIButton onClick={props.onClick}>{props.buttonText}</UIButton>
      </div>
    </div>
  );
};

export default class ChatOptions extends React.Component {
  static defaultProps = {
    channel: {
      channelId: ``,
    },
  };

  render() {
    let channelNoun = `channel`;
    if (this.props.channel.channelId.startsWith(DIRECT_MESSAGE_PREFIX)) {
      channelNoun = `direct messages`;
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_COLUMN}>
          <ChannelOptionItem
            onClick={this.props.onLeaveChannel}
            buttonText={`Remove ${channelNoun}`}
            title={`Remove ${channelNoun}`}>
            When you remove this {channelNoun}, it will be removed from your sidebar and you will no
            longer receive notifications.
          </ChannelOptionItem>
        </div>
      </div>
    );
  }
}
