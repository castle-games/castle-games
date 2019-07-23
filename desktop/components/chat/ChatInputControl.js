import * as React from 'react';
import * as ChatActions from '~/common/actions-chat';
import * as Emojis from '~/common/emojis';
import * as Strings from '~/common/strings';

import ChatInput from '~/components/chat/ChatInput';
import regexMatch from 'react-string-replace';

export default class ChatInputControl extends React.Component {
  _timeout;

  state = {
    index: 0,
    value: '',
    autocomplete: {
      type: null,
    },
  };

  componentWillUnmount() {
    this.clear();
  }

  clear = () => {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  };

  _handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({ value }, () => {
      let autocompleteType, query;
      regexMatch(value, /([@][\w_-]+)$/g, (match, i) => {
        if (!autocompleteType) {
          autocompleteType = 'users';
          query = match;
        }
        return match;
      });
      regexMatch(value, /[:]([\w_\-\+]+)$/g, (match, i) => {
        if (!autocompleteType) {
          autocompleteType = 'emoji';
          query = match;
        }
        return match;
      });

      if (autocompleteType) {
        this._searchAutocomplete(query, autocompleteType);
      } else {
        this.clear();
        return this.setState({
          autocomplete: {
            type: null,
          },
        });
      }
    });
  };

  _searchAutocomplete = (value, type) => {
    let callback,
      isNetworkRequest = false;
    if (type === 'users') {
      isNetworkRequest = true;
      callback = async () => {
        let users = [];
        let autocompleteResults = await ChatActions.getAutocompleteAsync(value, ['users']);
        if (autocompleteResults.users) {
          users = autocompleteResults.users;
        }
        if (this.props.addUsers) {
          this.props.addUsers(users);
        }
        this.setState({
          autocomplete: {
            type: 'users',
            users,
          },
        });
      };
    } else if (type === 'emoji') {
      callback = () => {
        let emoji = Emojis.autocompleteShortNames(value);
        this.setState({
          autocomplete: {
            type: 'emoji',
            emoji,
          },
        });
      };
    }
    this.clear();
    if (isNetworkRequest) {
      this._timeout = window.setTimeout(callback, 200);
    } else {
      callback();
    }
  };

  _handleSelectAutocompleteItem = (index) => {
    const { autocomplete } = this.state;
    if (autocomplete.type === 'users') {
      this._handleSelectUser(this.state.autocomplete.users[index]);
    } else if (autocomplete.type === 'emoji') {
      this._handleSelectEmoji(this.state.autocomplete.emoji[index]);
    }
  };

  _handleSelectEmoji = (emoji) => {
    let substitution = `:${emoji}:`;

    let newValue = regexMatch(this.state.value, /([:][\w_\-\+]+)$/g, (match, i) => {
      return substitution;
    });
    newValue = newValue.join().replace(`,${substitution},`, substitution);
    this._handleSelectValue(newValue);
  };

  _handleSelectUser = (user) => {
    let mention = `@${user.username}`;
    let newValue = regexMatch(this.state.value, /([@][\w_-]+)$/g, (match, i) => {
      return mention;
    });
    newValue = newValue.join().replace(`,${mention},`, mention);
    this._handleSelectValue(newValue);
  };

  _handleSelectValue = (value) => {
    this.setState({
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
    if (this.state.autocomplete.type && (e.which === 38 || e.which === 40)) {
      e.preventDefault();
      return;
    }

    // NOTE(jim): Prevent default return response when a user is navigating the popover.
    if (this.state.autocomplete.type && e.which === 13) {
      e.preventDefault();
      this._handleSelectAutocompleteFromKey();
      return;
    }

    // NOTE(jim): Prevent default return response when a user is navigating the popover.
    if (this.state.index > -1 && this.state.autocomplete.type && e.which === 9) {
      e.preventDefault();
      this._handleSelectAutocompleteFromKey();
      return;
    }

    if (e.which === 13 && !e.shiftKey) {
      e.preventDefault();

      if (!Strings.isEmpty(this.state.value.trim())) {
        this.props.onSendMessage(this.state.value);
        this.clear();
        this._handleSelectValue('');
      }
    }
  };

  _handleKeyUp = (e) => {
    const { index, autocomplete } = this.state;

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
    const { autocomplete } = this.state;
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
        value={this.state.value}
        index={this.state.index}
        autocomplete={this.state.autocomplete}
        onChange={this._handleInputChange}
        onSelectUser={this._handleSelectUser}
        onSelectEmoji={this._handleSelectEmoji}
        onKeyUp={this._handleKeyUp}
        onKeyDown={this._handleKeyDown}
      />
    );
  }
}
