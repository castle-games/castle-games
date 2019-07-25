import * as React from 'react';
import * as ChatActions from '~/common/actions-chat';
import * as Emojis from '~/common/emojis';
import * as Strings from '~/common/strings';

import ChatInput from '~/components/chat/ChatInput';
import regexMatch from 'react-string-replace';

const Keys = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  UP: 38,
  DOWN: 40,
};

export default class ChatInputControl extends React.Component {
  _timeout;
  _inputRef;

  state = {
    index: 0,
    value: '',
    autocomplete: {
      type: null,
    },
    isEditAvailable: false,
  };

  componentDidMount() {
    this._update(null, this.props);
  }

  componentDidUpdate(prevProps) {
    this._update(prevProps, this.props);
  }

  componentWillUnmount() {
    this.clear();
  }

  focus = () => {
    if (this._inputRef) {
      this._inputRef.focus();
    }
  };

  _update = (prevProps, props) => {
    if (props.initialValue && props.initialValue !== prevProps.initialValue) {
      this.setState({ value: props.initialValue }, () => {
        this.focus();
      });
    }
  };

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
    } else if (length > 0 && this.state.index >= 0) {
      this._handleSelectAutocompleteItem(this.state.index);
    }
    this.setState({ index: 0 });
  };

  _handleKeyDown = (e) => {
    let isEventHandled = false;
    if (e.which === Keys.ESCAPE) {
      if (this.state.autocomplete.type) {
        // close autocomplete
        this.setState({ autocomplete: { type: null } });
        isEventHandled = true;
      } else if (this.props.isEditing) {
        this.props.onEditCancel();
        isEventHandled = true;
      }
    }
    if (this.state.autocomplete.type && (e.which === Keys.UP || e.which === Keys.DOWN)) {
      // NOTE(jim): Prevent default up and down for multiline textarea
      isEventHandled = true;
    } else if (
      this.state.index > -1 &&
      this.state.autocomplete.type &&
      this._getAutocompleteLength() > 0 &&
      (e.which === Keys.TAB || e.which === Keys.ENTER)
    ) {
      // NOTE(jim): Prevent default return response when a user is navigating the popover.
      isEventHandled = true;
      this._handleSelectAutocompleteFromKey();
    } else if (e.which === Keys.UP && this.props.isEditAvailable) {
      // up arrow edits last message
      isEventHandled = true;
      this.props.onSelectEdit();
    } else if (e.which === Keys.TAB && this.props.isEditing) {
      // even if we didn't capture tab for autocomplete, do not allow cycling focus
      isEventHandled = true;
    } else if (e.which === Keys.ENTER && !e.shiftKey) {
      // enter sends message
      isEventHandled = true;
      if (!Strings.isEmpty(this.state.value.trim())) {
        this.props.onSendMessage(this.state.value);
        this.clear();
        this._handleSelectValue('');
      }
    }

    if (isEventHandled) {
      e.preventDefault();
    }
  };

  _handleKeyUp = (e) => {
    const { index, autocomplete } = this.state;

    const length = this._getAutocompleteLength();
    if (e.which === Keys.UP) {
      e.preventDefault();
      this.setState({
        index: index < length - 1 ? index + 1 : 0,
      });
      return;
    }

    if (e.which === Keys.DOWN) {
      e.preventDefault();
      this.setState({ index: index > 0 ? index - 1 : length - 1 });
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
        ref={(c) => (this._inputRef = c)}
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
