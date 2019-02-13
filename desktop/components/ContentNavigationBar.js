import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import { NavigationContext } from '~/contexts/NavigationContext';
import { NavigatorContext } from '~/contexts/NavigatorContext';
import SearchInput from '~/components/SearchInput';
import * as Urls from '~/common/urls';
import Viewer from '~/components/Viewer';

const STYLES_CONTAINER = css`
  background: #242729;
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
  color: ${Constants.colors.white};
  cursor: pointer;
  font-size: ${Constants.typescale.lvl6};
  font-weight: 400;
  text-decoration: underline;
  margin: 0 6px 0 6px;
`;

class ContentNavigationBar extends React.Component {
  _renderTopNavigationItems = () => {
    let { game, navigator } = this.props;
    let maybePlayingItem;
    if (game) {
      maybePlayingItem = (
        <div className={STYLES_NAV_ITEM} onClick={navigator.navigateToCurrentGame}>
          Playing
        </div>
      );
    }
    return (
      <div className={STYLES_NAV_ITEMS}>
        {maybePlayingItem}
        <div className={STYLES_NAV_ITEM} onClick={navigator.navigateToHome}>
          Home
        </div>
        <div className={STYLES_NAV_ITEM} onClick={navigator.navigateToHistory}>
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

export default class ContentNavigationBarWithContext extends React.Component {
  render() {
    return (
      <NavigationContext.Consumer>
        {(navigation) => (
          <NavigatorContext.Consumer>
            {(navigator) => (
              <ContentNavigationBar game={navigation.game} navigator={navigator} {...this.props} />
            )}
          </NavigatorContext.Consumer>
        )}
      </NavigationContext.Consumer>
    );
  }
}
