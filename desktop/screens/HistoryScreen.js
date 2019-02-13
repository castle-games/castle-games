import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIButton from '~/components/reusable/UIButton';
import UIEmptyState from '~/components/reusable/UIEmptyState';
import UIHeading from '~/components/reusable/UIHeading';

import History from '~/common/history';
import { NavigationContext } from '~/contexts/NavigationContext';
import { NavigatorContext } from '~/contexts/NavigatorContext';

const STYLES_CONTAINER = css`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  color: ${Constants.colors.text};

  ::-webkit-scrollbar {
    display: none;
    width: 1px;
  }
  padding: 16px;
`;

const STYLES_PARAGRAPH = css`
  color: ${Constants.colors.black};
  font-size: ${Constants.typescale.base};
  line-height: ${Constants.linescale.base};
  margin: 0 0 16px 16px;
`;

class HistoryScreen extends React.Component {
  _renderEmpty = () => {
    return (
      <div>
        <div className={STYLES_PARAGRAPH}>
          After you play some games in Castle, return here to find your recent plays.
        </div>
        <UIButton onClick={this.props.navigator.navigateToHome}>Browse Games</UIButton>
      </div>
    );
  };

  render() {
    const { history } = this.props;
    let contentElement;

    if (!history || !history.length) {
      contentElement = this._renderEmpty();
    } else {
      contentElement = (
        <div>
          <UIGameGrid
            game={this.props.game}
            onGameSelect={this.props.navigator.navigateToGame}
            onUserSelect={this.props.navigator.navigateToUserProfile}
            gameItems={history}
          />
          <UIButton onClick={this.props.onClearHistory}>Clear history</UIButton>
        </div>
      );
    }

    return (
      <div className={STYLES_CONTAINER}>
        <UIHeading>Recent</UIHeading>
        {contentElement}
      </div>
    );
  }
}

export default class HistoryScreenWithContext extends React.Component {
  state = {
    historyItems: [],
  };

  componentDidMount() {
    this.setState({ historyItems: History.getItems() });
  }

  _clearHistory = () => {
    History.clear();
    this.setState({ historyItems: History.getItems() });
  };

  render() {
    return (
      <NavigatorContext.Consumer>
        {(navigator) => (
          <NavigationContext.Consumer>
            {(navigation) => (
              <HistoryScreen
                game={navigation.game}
                navigator={navigator}
                history={this.state.historyItems}
                onClearHistory={this._clearHistory}
              />
            )}
          </NavigationContext.Consumer>
        )}
      </NavigatorContext.Consumer>
    );
  }
}
