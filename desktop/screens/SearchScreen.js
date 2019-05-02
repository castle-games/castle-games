import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';
import * as Strings from '~/common/strings';
import * as Urls from '~/common/urls';

import { css } from 'react-emotion';
import { NavigatorContext } from '~/contexts/NavigationContext';

import _ from 'lodash';
import UIButtonSecondary from '~/components/reusable/UIButtonSecondary';
import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIUserGrid from '~/components/reusable/UIUserGrid';

const SEARCH_DEBOUNCE_MS = 50;
const SEARCH_DEBOUNCE_MAX_MS = 150;

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

  constructor(props) {
    super(props);
    this._updateResultsDebounce = _.debounce(this._updateResults, SEARCH_DEBOUNCE_MS, {
      maxWait: SEARCH_DEBOUNCE_MAX_MS,
    });
  }

  // Mount needs to trigger an updateResults to support the first search character.
  componentDidMount() {
    this._updateResults(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.query !== nextProps.query) {
      this._updateResultsDebounce(nextProps);
    }
  }

  _updateResults = async ({ query }) => {
    query = this._stringAsSearchInvariant(query);
    if (Strings.isEmpty(query)) {
      this.setState({
        results: {
          games: [],
          users: [],
        },
      });
    } else {
      const results = await Actions.search(query);
      this.setState({
        results,
      });
    }
  };

  _stringAsSearchInvariant = (s) => {
    return s.toLowerCase().trim();
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
