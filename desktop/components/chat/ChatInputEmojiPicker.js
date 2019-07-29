import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Emojis from '~/common/emojis';

import { css } from 'react-emotion';

const STYLES_CONTAINER = css`
  position: absolute;
  bottom: 56px;
  right: 16px;
  width: 384px;
  height: 256px;
  display: flex;
  flex-wrap: wrap;

  padding: 8px;

  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);

  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_EMOJI_ITEM = css`
  padding: 4px;
  margin: 2px;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;

  :hover {
    background: #ececec;
  }
`;

export default class ChatInputEmojiPicker extends React.Component {
  static defaultProps = {
    onSelectEmoji: (shortName) => {},
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        {Object.entries(Emojis.SHORT_NAME_TO_OBJECT).map(([name, emoji], ii) => (
          <div
            key={`emoji-${ii}`}
            className={STYLES_EMOJI_ITEM}
            onClick={() => this.props.onSelectEmoji(name, true)}>
            {Emojis.getEmojiComponent(name)}
          </div>
        ))}
      </div>
    );
  }
}
