import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
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
          query={this.props.searchQuery}
          onSearchReset={this.props.onSearchReset}
          onChange={this.props.onSearchChange}
          onSubmit={this.props.onSearchSubmit}
        />
        {this._renderTopNavigationItems()}
        <Viewer />
      </div>
    );
  }
}
