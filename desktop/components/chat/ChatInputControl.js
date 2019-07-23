import * as React from 'react';

import ChatInput from '~/components/chat/ChatInput';
import regexMatch from 'react-string-replace';

export default class ChatInputControl extends React.Component {
  state = {
    index: 0,
  };

  _handleSelectAutocompleteItem = (index) => {
    const { autocomplete } = this.props;
    if (autocomplete.type === 'users') {
      this._handleSelectUser(this.props.autocomplete.users[index]);
    } else if (autocomplete.type === 'emoji') {
      this._handleSelectEmoji(this.props.autocomplete.emoji[index]);
    }
  };

  _handleSelectEmoji = (emoji) => {
    let substitution = `:${emoji}:`;

    let newValue = regexMatch(this.props.value, /([:][\w_\-\+]+)$/g, (match, i) => {
      return substitution;
    });
    newValue = newValue.join().replace(`,${substitution},`, substitution);
    this._handleSelectValue(newValue);
  };

  _handleSelectUser = (user) => {
    let mention = `@${user.username}`;

    // NOTE(jim): Regex only captures at the end of the string as you type.
    let newValue = regexMatch(this.props.value, /([@][\w_-]+)$/g, (match, i) => {
      return mention;
    });
    newValue = newValue.join().replace(`,${mention},`, mention);
    this._handleSelectValue(newValue);
  };

  _handleSelectValue = (value) => {
    // NOTE(jim): Sometimes the regex adds extra characters around a successful mention.
    this.props.onForceChange({
      value,
      autocomplete: { type: null },
    });
  };

  _handleSelectAutocompleteFromKey = () => {
    const length = this._getAutocompleteLength();
    if (length === 1) {
      this._handleSelectAutocompleteItem(0);
    } else if (this.state.index >= 0) {
      this._handleSelectAutocompleteItem(this.state.index);
    }
    this.setState({ index: 0 });
  };

  _handleKeyDown = (e) => {
    // NOTE(jim): Prevent default up and down for multiline textarea
    if (this.props.autocomplete.type && (e.which === 38 || e.which === 40)) {
      e.preventDefault();
      return;
    }

    // NOTE(jim): Prevent default return response when a user is navigating the popover.
    if (this.props.autocomplete.type && e.which === 13) {
      e.preventDefault();
      this._handleSelectAutocompleteFromKey();
      return;
    }

    // NOTE(jim): Prevent default return response when a user is navigating the popover.
    if (this.state.index > -1 && this.props.autocomplete.type && e.which === 9) {
      e.preventDefault();
      this._handleSelectAutocompleteFromKey();
      return;
    }

    this.props.onKeyDown(e);
  };

  _handleKeyUp = (e) => {
    const { index } = this.state;
    const { autocomplete } = this.props;

    const length = this._getAutocompleteLength();
    if (e.which === 38) {
      e.preventDefault();
      this.setState({
        index: index < length - 1 ? index + 1 : length - 1,
      });
      return;
    }

    if (e.which === 40) {
      e.preventDefault();
      this.setState({ index: index > -1 ? index - 1 : -1 });
      return;
    }
  };

  _getAutocompleteLength = () => {
    const { autocomplete } = this.props;
    let length = 0;
    if (autocomplete.type === 'users') {
      length = autocomplete.users.length;
    } else if (autocomplete.type === 'emoji') {
      length = autocomplete.emoji.length;
    }
    return length;
  };

  render() {
    return (
      <ChatInput
        {...this.props}
        onSelectUser={this._handleSelectUser}
        onSelectEmoji={this._handleSelectEmoji}
        onKeyUp={this._handleKeyUp}
        onKeyDown={this._handleKeyDown}
        index={this.state.index}
      />
    );
  }
}
