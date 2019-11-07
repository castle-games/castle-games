import * as React from 'react';
import * as Actions from '~/common/actions';
import * as Constants from '~/common/constants';

import { css } from 'react-emotion';

import UILoadingCard from '~/components/reusable/UILoadingCard';

const STYLES_CONTAINER = css`
  background: white;
  width: 100%;
  height: 100%;
  display: flex;
`;

const STYLES_CONTENT = css`
  width: 100%;
  height: 100%;
`;

const STYLES_TOP_BAR = css`
  background: #f3f3f3;
  flex-shrink: 0;
  width: 100%;
  height: 48px;
`;

const STYLES_SCREEN = css`
  margin-top: 54px;
  margin-right: ${Constants.sidebar.width};
`;

const STYLES_SIDEBAR = css``;

const STYLES_CONTENT_CARDS = css`
  display: flex;
  flex-wrap: wrap;
  margin: 48px 24px;
`;

export default class AppLoadingScreen extends React.Component {
  state = {
    cards: null,
  };

  async componentDidMount() {
    await Actions.delay(1000);
    this.setState({ cards: Array.from({ length: 12 }) });
  }

  render() {
    const { cards } = this.state;
    return (
      <div id="loader-inner" className={STYLES_CONTAINER}>
        <div className={STYLES_CONTENT}>
          <div className={STYLES_TOP_BAR} />
          <div className={STYLES_SCREEN}>
            <div className={STYLES_CONTENT_CARDS}>
              {cards && cards.map((card, ii) => <UILoadingCard key={ii} />)}
            </div>
          </div>
        </div>
        <div className={STYLES_SIDEBAR} />
      </div>
    );
  }
}
