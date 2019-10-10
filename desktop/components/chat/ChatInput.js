import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/components/primitives/svg';

import { css } from 'react-emotion';

import ReactDOM from 'react-dom';
import AutoSizeTextarea from 'react-textarea-autosize';
import ChatInputEmojiItem from '~/components/chat/ChatInputEmojiItem';
import ChatInputMention from '~/components/chat/ChatInputMention';
import UIBoundary from '~/components/reusable/UIBoundary';
import UIEmojiPicker from '~/components/reusable/UIEmojiPicker';

const STYLES_CONTAINER = css`
  flex-shrink: 0;
  width: 100%;
  padding: 0px 16px 8px 16px;
  position: relative;
`;

const STYLES_AUTOCOMPLETE = css`
  position: absolute;
  bottom: 56px;
  border-radius: 4px;
  border: 1px solid rgba(219, 219, 219, 1);
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  left: 16px;
  right: 16px;
  display: flex;
  flex-direction: column-reverse;
`;

const STYLES_INPUT = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  border: 2px solid ${Constants.REFACTOR_COLORS.elements.border};
  display: flex;
  width: 100%;
  height: 100%;
  outline: 0;
  font-size: 12px;
  background: transparent;
  font-weight: 400;
  padding: 8px 24px 8px 8px;
  box-sizing: border-box;
  resize: none;
  border-radius: 4px;
  transition: 200ms ease border;

  ::placeholder {
    color: #aaa;
  }

  :focus {
    border: 2px solid magenta;
    outline: 0;
  }
`;

const STYLES_INLINE_CONTROLS = css`
  display: flex;
  color: ${Constants.REFACTOR_COLORS.subdued};
  position: absolute;
  right: 22px;
  bottom: 13px;
`;

const STYLES_EMOJI_TOGGLE = css`
  padding: 0 4px;
  cursor: pointer;
`;

const STYLES_VOICE_CHAT_CONTROL = css`
  padding: 0 4px;
  cursor: pointer;
`;

const STYLES_VOICE_CHAT_ACTIVE = css`
  @keyframes voice-chat-live-opacity-change {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }

  animation: voice-chat-live-opacity-change infinite 1600ms;
`;

export default class ChatInput extends React.Component {
  _input;

  static defaultProps = {
    index: 0,
    theme: {
      textColor: null,
      inputBackground: Constants.colors.white,
      useNarrowModals: false,
    },
    autocomplete: {
      type: null,
    },
    showInlineControls: true,
    isShowingEmojiPicker: false,
    isVoiceChatAvailable: false,
    isVoiceChatActive: false,
  };

  componentDidMount() {
    window.addEventListener('keyup', this.props.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.props.onKeyUp);
  }

  focus = () => {
    const element = ReactDOM.findDOMNode(this._input);
    element.focus();
  };

  _handleSelectUser = (user) => {
    this.props.onSelectUser(user);
    this.focus();
  };

  _handleSelectEmoji = (emoji, append = false) => {
    this.props.onSelectEmoji(emoji, append);
    this.focus();
  };

  _renderAutocomplete = () => {
    const { autocomplete, index } = this.props;
    if (autocomplete.type === 'users' && autocomplete.users.length) {
      return (
        <div className={STYLES_AUTOCOMPLETE}>
          {autocomplete.users.map((o, i) => {
            return (
              <ChatInputMention
                onClick={() => this._handleSelectUser(o)}
                user={o}
                key={`option-${i}`}
                isSelected={i === index}
              />
            );
          })}
        </div>
      );
    } else if (autocomplete.type === 'emoji' && autocomplete.emoji.length) {
      return (
        <div className={STYLES_AUTOCOMPLETE}>
          {autocomplete.emoji.map((o, i) => {
            return (
              <ChatInputEmojiItem
                onClick={() => this._handleSelectEmoji(o)}
                shortName={o}
                key={`option-${i}`}
                isSelected={i === index}
              />
            );
          })}
        </div>
      );
    }
  };

  _renderEmojiPicker = () => {
    if (this.props.isShowingEmojiPicker) {
      const { useNarrowModals } = this.props.theme;
      return (
        <UIBoundary
          enabled={true}
          captureResize={false}
          captureScroll={false}
          onOutsideRectEvent={this.props.onToggleEmojiPicker}>
          <UIEmojiPicker onSelectEmoji={this._handleSelectEmoji} isNarrowWidth={useNarrowModals} />
        </UIBoundary>
      );
    }
    return null;
  };

  _renderVoiceChatControl = () => {
    if (this.props.isVoiceChatAvailable) {
      if (this.props.isVoiceChatActive) {
        return (
          <div className={STYLES_VOICE_CHAT_ACTIVE}>
            <SVG.VoiceChatEnabled size="17" />
          </div>
        );
      } else {
        return <SVG.VoiceChatDisabled size="17" />;
      }
    }
    return null;
  };

  render() {
    let inputStyles;
    let containerStyles;
    if (this.props.isSidebar) {
      inputStyles = {
        color: this.props.theme.textColor,
        background: this.props.theme.inputBackground,
      };
    }

    return (
      <div className={STYLES_CONTAINER} style={containerStyles}>
        {this._renderAutocomplete()}
        {this._renderEmojiPicker()}
        <AutoSizeTextarea
          ref={(c) => {
            this._input = c;
          }}
          className={STYLES_INPUT}
          autoComplete="off"
          placeholder={this.props.placeholder}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
          onKeyDown={this.props.onKeyDown}
          style={inputStyles}
        />
        {this.props.showInlineControls && (
          <div className={STYLES_INLINE_CONTROLS}>
            <div className={STYLES_VOICE_CHAT_CONTROL} onClick={this.props.onToggleVoiceChat}>
              {this._renderVoiceChatControl()}
            </div>
            <div className={STYLES_EMOJI_TOGGLE} onClick={this.props.onToggleEmojiPicker}>
              <SVG.ChatEmojiPicker size="17" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
