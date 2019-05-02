import * as React from 'react';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { NavigatorContext } from '~/contexts/NavigationContext';

import UIButtonSecondary from '~/components/reusable/UIButtonSecondary';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIUserGrid from '~/components/reusable/UIUserGrid';

const STYLES_CONTAINER = css`
  background: ${Constants.colors.background};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
`;

const STYLES_SEARCH_RESPONSE = css`
  color: ${Constants.colors.black};
  font-size: 48px;
  line-height: 56px;
  padding: 24px;
  max-width: 640px;
`;

const STYLES_SEARCH_RESPONSE_ACTION = css`
  color: ${Constants.colors.black};
  font-size: 48px;
  line-height: 56px;
  padding: 24px;
  max-width: 640px;

  :hover {
    cursor: pointer;
  }
`;

const STYLES_SECTION = css`
  padding-bottom: 64px;
`;

export default class SearchScreen extends React.Component {
  static contextType = NavigatorContext;
  static defaultProps = {
    // TODO: remove
    allContent: {
      games: [],
      users: [],
    },
  };
  state = {
    results: {
      games: [],
      users: [],
    },
  };

  // NOTE(jim): Since we've organized this component in a unique way.
  // Mount needs to trigger an updateResults to support the first search character.
  componentDidMount() {
    this._updateResults(this.props);
  }

  // NOTE(jim): Set state is called outside of this component, and therefore we need
  // to check if the query has changed before its reflected at the end of the update
  // cycle
  componentWillUpdate(nextProps, nextState) {
    if (this.props.query !== nextProps.query) {
      this._updateResults(nextProps);
    }
  }

  _updateResults = ({ query }) => {
    if (Strings.isEmpty(query)) {
      this.setState({
        results: {
          games: [],
          users: [],
        },
      });
    } else {
      this.setState({
        results: {
          games: this.props.allContent.games.filter((m) =>
            this._filterGameWithSearchState(m, query)
          ),
          users: this.props.allContent.users.filter((u) =>
            this._filterUserWithSearchState(u, query)
          ),
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

  _filterGameWithSearchState = (m, originalQuery) => {
    if (!m) {
      return false;
    }

    const query = this._stringAsSearchInvariant(this.props.query);
    if (this._stringIncludesSearchQuery(m.name, query)) {
      return true;
    }

    if (Strings.isEmpty(m.name) && this._stringIncludesSearchQuery(m.url, originalQuery)) {
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

  _filterUserWithSearchState = (u, originalQuery) => {
    if (!u) {
      return false;
    }

    const query = this._stringAsSearchInvariant(originalQuery);
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

  _navigateToGame = async (game) => {
    await this.context.navigateToGame(game);
    this.props.onSearchReset();
  };

  _navigateToUserProfile = async (user) => {
    await this.context.navigateToUserProfile(user);
    this.props.onSearchReset();
  };

  _navigateToSignIn = async () => {
    await this.context.navigateToSignIn();
    this.props.onSearchReset();
  };

  _renderNoResults = () => {
    if (this.props.query && Strings.isMaybeCastleURL(this.props.query)) {
      return (
        <React.Fragment>
          <div className={STYLES_SEARCH_RESPONSE}>
            We did not find find anything matching{' '}
            <strong style={{ color: Constants.colors.searchEmphasis }}>"{this.props.query}"</strong>
            , but it looks like a game URL.
          </div>
          <div
            className={STYLES_SEARCH_RESPONSE_ACTION}
            onClick={() => this._maybeNavigateToUrl(this.props.query)}>
            Open{' '}
            <strong style={{ color: Constants.colors.searchEmphasis }}>{this.props.query}</strong>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <div className={STYLES_SEARCH_RESPONSE}>
          We did not find find anything matching{' '}
          <strong style={{ color: Constants.colors.searchEmphasis }}>"{this.props.query}"</strong>.
        </div>
      );
    }
  };

  render() {
    let maybeGameResults, maybeUserResults, maybeNoResults;
    if (this.state.results.games && this.state.results.games.length) {
      maybeGameResults = (
        <UIGameGrid
          gameItems={this.state.results.games}
          onUserSelect={this._navigateToUserProfile}
          onGameSelect={this._navigateToGame}
          onSignInSelect={this._navigateToSignIn}
          viewer={this.props.viewer}
        />
      );
    }

    if (this.state.results.users && this.state.results.users.length) {
      maybeUserResults = (
        <UIUserGrid
          users={this.state.results.users}
          onUserSelect={this._navigateToUserProfile}
          viewer={this.props.viewer}
        />
      );
    }

    if (!maybeGameResults && !maybeUserResults) {
      maybeNoResults = this._renderNoResults();
    }

    return (
      <div className={STYLES_CONTAINER}>
        <div className={STYLES_SECTION}>
          {maybeGameResults}
          {maybeUserResults}
          {maybeNoResults}
        </div>
      </div>
    );
  }
}
