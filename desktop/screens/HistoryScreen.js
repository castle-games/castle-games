import * as React from 'react';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UIGameGrid from '~/components/reusable/UIGameGrid';
import UIButton from '~/components/reusable/UIButton';
import UIEmptyState from '~/components/reusable/UIEmptyState';
import UIHeading from '~/components/reusable/UIHeading';

import { HistoryContext } from '~/contexts/HistoryContext';
import { NavigationContext } from '~/contexts/NavigationContext';

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
        <UIButton onClick={this.props.navigation.navigateToHome}>Browse Games</UIButton>
      </div>
    );
  };

  render() {
    const history = this.props.history.getItems();
    let contentElement;

    if (!history || !history.length) {
      contentElement = this._renderEmpty();
    } else {
      contentElement = (
        <div>
          <UIGameGrid
            game={this.props.navigation.game}
            onGameSelect={this.props.navigation.navigateToGame}
            onUserSelect={this.props.navigation.navigateToUserProfile}
            gameItems={history}
          />
          <UIButton onClick={this.props.history.clear}>Clear history</UIButton>
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
  render() {
    return (
      <HistoryContext.Consumer>
        {(history) => (
          <NavigationContext.Consumer>
            {(navigation) => <HistoryScreen navigation={navigation} history={history} />}
          </NavigationContext.Consumer>
        )}
      </HistoryContext.Consumer>
    );
  }
}
