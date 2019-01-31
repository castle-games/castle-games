import * as React from 'react';
import { css } from 'react-emotion';

import * as Constants from '~/common/constants';
import GameGrid from '~/components/reusable/GameGrid';
import { NavigationContext } from '~/contexts/NavigationContext';
import * as Strings from '~/common/strings';
import UIButtonSecondary from '~/core-components/reusable/UIButtonSecondary';
import * as Urls from '~/common/urls';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${Constants.colors.white};
  border-top: 1px solid ${Constants.colors.border};
`;

const STYLES_HEADING = css`
  color: ${Constants.colors.black};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const STYLES_SECTION = css`
  padding: 16px 16px 32px 16px;
`;

export default class SearchScreen extends React.Component {
  static contextType = NavigationContext;
  static defaultProps = {
    allContent: {
      games: [],
      users: [],
    }
  };
  state = {
    results: {
      games: [],
      users: [],
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const oldQuery = (prevProps && prevProps.query) ? prevProps.query : null;
    const newQuery = this.props.query;
    if (oldQuery !== newQuery) {
      this._updateResults();
    }
  }

  _updateResults = () => {
    if (Strings.isEmpty(this.props.query)) {
      this.setState({
        results: {
          games: [],
          users: [],
        }
      });
    } else {
      this.setState({
        results: {
          games: this.props.allContent.games.filter(this._filterGameWithSearchState),
          users: this.props.allContent.users.filter(this._filterUserWithSearchState),
        },
      });
    }
  };

  _stringAsSearchInvariant = (s) => {
    return s.toLowerCase().trim();
  };

  _stringIncludesSearchQuery = (s, query) => {
    if (Strings.isEmpty(s)) {
      return false;
    }

    return this._stringAsSearchInvariant(s).includes(query);
  };

  _filterGameWithSearchState = (m) => {
    if (!m) {
      return false;
    }
    const query = this._stringAsSearchInvariant(this.props.query);
    if (this._stringIncludesSearchQuery(m.name, query)) {
      return true;
    }

    if (Strings.isEmpty(m.name) && this._stringIncludesSearchQuery(m.url, query)) {
      return true;
    }

    if (m.user) {
      if (this._stringIncludesSearchQuery(m.user.name, query)) {
        return true;
      }
      if (this._stringIncludesSearchQuery(m.user.username, query)) {
        return true;
      }
    }

    return false;
  };

  _filterUserWithSearchState = (u) => {
    if (!u) {
      return false;
    }
    const query = this._stringAsSearchInvariant(this.props.query);
    if (this._stringIncludesSearchQuery(u.name, query)) {
      return true;
    }
    if (this._stringIncludesSearchQuery(u.username, query)) {
      return true;
    }
    return false;
  };

  _maybeNavigateToUrl = (url) => {
    try {
      url = url.slice(0).trim();
      if (Urls.isPrivateUrl(url)) {
        url = url.replace('castle://', 'http://');
      }
    } catch (_) {}
    if (Strings.isEmpty(url)) {
      return;
    }

    this.context.navigateToGameUrl(url);
    this.props.onSearchReset();
  };

  _doesQueryLookLikeUrl = (query) => {
    query = query.slice(0).trim();
    return (
      query.endsWith('.lua') ||
      query.startsWith('castle:') ||
      query.startsWith('http')
    );
  };

  _renderNoResults = () => {
    if (this.props.query && this._doesQueryLookLikeUrl(this.props.query)) {
      return (
        <div className={STYLES_SECTION}>
          <div className={STYLES_HEADING}>
            No results
          </div>
          <div style={{ marginBottom: 12 }}>
            We didn't find find anything matching <b>"{this.props.query}"</b>, but it looks
            like a game URL.
          </div>
          <UIButtonSecondary onClick={() => this._maybeNavigateToUrl(this.props.query)}>
            Open <b>{this.props.query}</b>
          </UIButtonSecondary>
        </div>
      );
    } else {
      return (
        <div>No results for {this.props.query}</div>
      );
    }
  };

  _renderGameResults = () => {
    return (
      <div className={STYLES_SECTION}>
        <div className={STYLES_HEADING}>
          Games
        </div>
        <GameGrid
          gameItems={this.state.results.games}
          onUserSelect={this.context.naviateToUserProfile}
          onGameSelect={this.context.navigateToGame}
        />
      </div>
    );
  };

  render() {
    let maybeGameResults, maybeNoResults;
    if (this.state.results.games && this.state.results.games.length) {
      maybeGameResults = this._renderGameResults();
    }
    if (!maybeGameResults) {
      maybeNoResults = this._renderNoResults();
    }
    return (
      <div className={STYLES_CONTAINER}>
        {maybeGameResults}
        {maybeNoResults}
      </div>
    );
  }
}
