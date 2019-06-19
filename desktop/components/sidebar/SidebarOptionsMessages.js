import * as React from 'react';
import * as Constants from '~/common/constants';
import * as SVG from '~/common/svg';
import * as Actions from '~/common/actions';
import * as Strings from '~/common/strings';

import { css } from 'react-emotion';

import UISidebarInput from '~/components/reusable/UISidebarInput';

const STYLES_HEADER = css`
  border-bottom: 1px solid ${Constants.REFACTOR_COLORS.elements.border};
  color: ${Constants.REFACTOR_COLORS.text};
  font-family: ${Constants.REFACTOR_FONTS.system};
  width: 100%;
  flex-shrink: 0;
  padding: 8px 8px 8px 8px;
  margin-bottom: 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_HEADER_LEFT = css`
  min-width: 25%;
  width: 100%;
`;

const STYLES_HEADER_RIGHT = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 200ms ease color;
  padding: 8px;

  :hover {
    color: magenta;
  }
`;

const STYLES_OPTION = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  user-select: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: right;
  padding: 0 16px 0 16px;
  width: 100%;
  cursor: pointer;
  transition: color 200ms ease;

  :hover {
    color: magenta;
  }
`;

const STYLES_TITLE = css`
  font-family: ${Constants.REFACTOR_FONTS.system};
  color: ${Constants.REFACTOR_COLORS.subdued};
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  text-align: right;
  padding: 0 16px 0 16px;
  margin-bottom: 8px;
`;

const STYLES_FORM = css`
  padding: 0 16px 0 16px;
`;

export const delay = (ms) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export default class SidebarOptionsMessages extends React.Component {
  _timeout;

  state = {
    query: '',
    results: [],
  };

  componentWillUnmount() {
    window.clearTimeout(this._timeout);
    this._timeout = null;
  }

  _handleChange = (e) => {
    const value = e.target.value;
    this.setState({ [e.target.name]: value }, () => {
      window.clearTimeout(this._timeout);
      this._timeout = null;
      this._handleSearch(value);
    });
  };

  _handleSearch = (value) => {
    this._timeout = window.setTimeout(async () => {
      let users = [];

      let autocompleteResults = await Actions.getAutocompleteAsync(value);
      if (autocompleteResults.users) {
        users = autocompleteResults.users;
      }

      this.setState({ results: users });
    }, 300);
  };

  render() {
    const { viewer } = this.props;

    let users = [];
    if (this.state.results) {
      users = this.state.results;
    }

    return (
      <React.Fragment>
        <header className={STYLES_HEADER}>
          <div className={STYLES_HEADER_LEFT} />
          <div className={STYLES_HEADER_RIGHT} onClick={this.props.onDismiss}>
            <SVG.Dismiss size="16px" />
          </div>
        </header>
        <div className={STYLES_TITLE}>Find a user</div>

        <div className={STYLES_FORM}>
          <UISidebarInput
            label="By username"
            name="query"
            onChange={this._handleChange}
            value={this.state.query}
          />
        </div>

        {users.length ? (
          <div className={STYLES_TITLE} style={{ marginTop: 40 }}>
            Users found
          </div>
        ) : null}
        {users.map((u) => {
          if (u.username === viewer.username) {
            return null;
          }

          return (
            <div
              key={`username-${u.userId}`}
              className={STYLES_OPTION}
              onClick={() => this.props.onSendMessage(u)}>
              {Strings.getPresentationName(u)}
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}
