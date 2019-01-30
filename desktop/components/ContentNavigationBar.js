import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import { NavigationContext } from '~/contexts/NavigationContext';
import SearchInput from '~/components/SearchInput';
import * as Urls from '~/common/urls';
import Viewer from '~/components/Viewer';

const STYLES_CONTAINER = css`
  font-family: ${Constants.font.default};
  background: ${Constants.colors.white};
  height: 48px;
  flex-shrink: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const STYLES_NAV_ITEMS = css`
  display: flex;
`;

const STYLES_NAV_ITEM = css`
  display: inline-flex;
  color: ${Constants.colors.black};
  cursor: pointer;
  font-size: 10pt;
  margin: 0 6px 0 6px;
`;

export default class ContentNavigationBar extends React.Component {
  static contextType = NavigationContext;
  state = {
    searchQuery: '',
  };

  _handleSearchReset = () => {
    this.setState({
      searchQuery: '',
    });
    // TODO: clear any search results
  };

  _handleSearchChange = async (e) => {
    // TODO: show search results
    this.setState(
      {
        searchQuery: e.target.value,
      },
      () => {
        if (Strings.isEmpty(this.state.searchQuery)) {
          return this._handleSearchReset();
        }
      }
    );
  };

  _handleSearchSubmit = async (e) => {
    this._handleSearchChange(e);
    // TODO: we should already be showing search results
    // for now, assume this is a URL and try to navigate to it
    this._handleUrlSubmit(e);
  };

  _handleUrlSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    let url;
    try {
      url = this.state.searchQuery.slice(0).trim();
      if (Urls.isPrivateUrl(url)) {
        url = url.replace('castle://', 'http://');
      }
    } catch (_) {}
    if (Strings.isEmpty(url)) {
      return;
    }

    this.context.navigateToGameUrl(url);
    this._handleSearchReset();
  };

  _renderTopNavigationItems = () => {
    let maybePlayingItem;
    if (this.context.game) {
      maybePlayingItem = (
        <div
          className={STYLES_NAV_ITEM}
          onClick={this.context.navigateToCurrentGame}>
          Playing
        </div>
      );
    }
    return (
      <div className={STYLES_NAV_ITEMS}>
        {maybePlayingItem}
        <div
          className={STYLES_NAV_ITEM}
          onClick={this.context.navigateToHome}>
          Home
        </div>
        <div
          className={STYLES_NAV_ITEM}
          onClick={this.context.navigateToHistory}>
          Recent
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className={STYLES_CONTAINER}>
        <SearchInput
          searchQuery={this.state.searchQuery}
          onSearchReset={this._handleSearchReset}
          onChange={this._handleSearchChange}
          onSubmit={this._handleSearchSubmit}
        />
        {this._renderTopNavigationItems()}
        <Viewer />
      </div>
    );
  }
}
